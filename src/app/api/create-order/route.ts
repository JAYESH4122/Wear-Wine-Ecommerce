import { getServerSession } from 'next-auth'
import { getPayload } from 'payload'

import { authOptions } from '@/lib/auth'
import { normalizeShippingAddress, requirePayloadUser } from '@/lib/server/commerce'
import { rejectDisallowedOrigin, withCors } from '@/lib/server/cors'
import {
  buildPaymentSnapshot,
  InvalidCartError,
  opaqueAttemptId,
} from '@/lib/server/payment-attempts'
import { assertLiveBusinessReadiness } from '@/lib/server/live-readiness'
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit'
import {
  arePaymentsEnabled,
  getPaymentRuntimeConfig,
  getRazorpayClient,
} from '@/lib/server/razorpay'
import configPromise from '@/payload.config'

const invalidBody = (request: Request, message: string) =>
  withCors(request, Response.json({ error: message }, { status: 400 }))

const paymentsUnavailable = (request: Request) =>
  withCors(
    request,
    Response.json({ error: 'Payments are temporarily unavailable' }, { status: 503 }),
  )

const cleanText = (value: unknown, maxLength: number) => {
  if (typeof value !== 'string') return ''
  const cleaned = value.trim()
  return cleaned.length <= maxLength ? cleaned : ''
}

export const OPTIONS = async (request: Request) =>
  withCors(request, new Response(null, { status: 204 }))

export const POST = async (request: Request): Promise<Response> => {
  const originRejection = rejectDisallowedOrigin(request)
  if (originRejection) return originRejection

  // Keep checkout closed until the deployment explicitly enables payments.
  // Live mode additionally requires the CMS business-readiness gate below.
  if (!arePaymentsEnabled()) {
    return withCors(
      request,
      Response.json(
        { error: 'Checkout is temporarily paused while payment readiness is verified.' },
        {
          status: 503,
          headers: {
            'Cache-Control': 'no-store',
            'Retry-After': '900',
          },
        },
      ),
    )
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > 32_768) return invalidBody(request, 'Request body is too large')

  const rate = await checkRateLimit({
    key: `razorpay-create:${getClientIp(request)}`,
    limit: 10,
    windowMs: 15 * 60 * 1000,
  })
  if (rate.limited) {
    return withCors(request, Response.json({ error: 'Too many requests' }, { status: 429 }))
  }

  let razorpay
  let paymentRuntime
  try {
    paymentRuntime = getPaymentRuntimeConfig()
    razorpay = getRazorpayClient()
  } catch (error) {
    console.error('[create-order] Unsafe Razorpay configuration', {
      error: error instanceof Error ? error.message : 'unknown',
    })
    return paymentsUnavailable(request)
  }
  if (!razorpay) return paymentsUnavailable(request)

  const body = (await request.json().catch(() => null)) as
    | {
        email?: unknown
        phone?: unknown
        shippingAddress?: Record<string, unknown>
        items?: unknown
      }
    | null
  if (!body) return invalidBody(request, 'Invalid request body')

  const email = cleanText(body.email, 254).toLowerCase()
  const phone = cleanText(body.phone, 20).replace(/[\s()-]/g, '')
  const shippingAddress = normalizeShippingAddress({
    fullName: cleanText(body.shippingAddress?.fullName, 100),
    addressLine1: cleanText(body.shippingAddress?.addressLine1, 200),
    addressLine2: cleanText(body.shippingAddress?.addressLine2, 200),
    city: cleanText(body.shippingAddress?.city, 100),
    state: cleanText(body.shippingAddress?.state, 100),
    country: cleanText(body.shippingAddress?.country, 100),
    postalCode: cleanText(body.shippingAddress?.postalCode, 20),
    landmark: cleanText(body.shippingAddress?.landmark, 150),
  })

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return invalidBody(request, 'A valid email is required')
  }
  if (!/^\+?[0-9]{10,15}$/.test(phone)) {
    return invalidBody(request, 'A valid phone number is required')
  }
  if (!shippingAddress) {
    return invalidBody(request, 'All required shipping address fields must be provided')
  }

  const payload = await getPayload({ config: configPromise })
  if (paymentRuntime.mode === 'live') {
    try {
      await assertLiveBusinessReadiness(payload)
    } catch (error) {
      console.error('[create-order] Live payments blocked by the business-readiness gate', {
        error: error instanceof Error ? error.message : 'unknown',
      })
      return paymentsUnavailable(request)
    }
  }

  const session = await getServerSession(authOptions)
  const payloadUser = session?.user?.id
    ? await requirePayloadUser(payload, session.user.id)
    : null

  if (session?.user?.id && !payloadUser) {
    return withCors(request, Response.json({ error: 'Unauthorized' }, { status: 401 }))
  }
  if (payloadUser && email !== payloadUser.email.toLowerCase()) {
    return invalidBody(request, 'Email mismatch for authenticated user')
  }

  let snapshot
  try {
    snapshot = await buildPaymentSnapshot(payload, body.items)
  } catch (error) {
    if (error instanceof InvalidCartError) return invalidBody(request, error.message)
    throw error
  }

  const attemptId = opaqueAttemptId()
  const attempt = await payload.create({
    collection: 'payment-attempts',
    data: {
      attemptId,
      user: payloadUser?.id,
      email,
      phone,
      shippingAddress,
      items: snapshot.items,
      amountPaise: snapshot.amountPaise,
      currency: 'INR',
      status: 'creating',
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
    overrideAccess: true,
  })

  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: snapshot.amountPaise,
      currency: 'INR',
      receipt: attemptId,
      notes: { payment_attempt: attemptId },
    })

    if (
      Number(razorpayOrder.amount) !== snapshot.amountPaise
      || razorpayOrder.currency !== 'INR'
    ) {
      throw new Error('Razorpay returned a mismatched order')
    }

    await payload.update({
      collection: 'payment-attempts',
      id: attempt.id,
      data: {
        status: 'pending',
        razorpayOrderId: razorpayOrder.id,
      },
      overrideAccess: true,
    })

    console.info('[create-order] Payment attempt created', {
      attemptId,
      razorpayOrderId: razorpayOrder.id,
      amountPaise: snapshot.amountPaise,
      authenticated: Boolean(payloadUser),
    })

    return withCors(
      request,
      Response.json({
        attemptId,
        razorpayOrderId: razorpayOrder.id,
        amount: snapshot.amountPaise,
        currency: 'INR',
      }),
    )
  } catch (error) {
    await payload.update({
      collection: 'payment-attempts',
      id: attempt.id,
      data: {
        status: 'failed',
        failureReason: 'Razorpay order creation failed',
        processedAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })
    console.error('[create-order] Razorpay order creation failed', {
      attemptId,
      error: error instanceof Error ? error.message : 'unknown',
    })
    return paymentsUnavailable(request)
  }
}
