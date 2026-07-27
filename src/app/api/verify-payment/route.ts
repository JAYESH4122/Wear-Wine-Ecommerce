import { getPayload } from 'payload'

import { rejectDisallowedOrigin, withCors } from '@/lib/server/cors'
import {
  finalizeCapturedPayment,
  findPaymentAttempt,
  isCapturedPayment,
  paymentMatchesAttempt,
  recordPaymentState,
} from '@/lib/server/payment-attempts'
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit'
import {
  fetchRazorpayPayment,
  getRazorpayClient,
  verifyPaymentSignature,
} from '@/lib/server/razorpay'
import configPromise from '@/payload.config'

const validRazorpayId = (value: unknown, prefix: string): value is string =>
  typeof value === 'string'
  && value.length <= 100
  && value.startsWith(prefix)
  && /^[A-Za-z0-9_-]+$/.test(value)

export const OPTIONS = async (request: Request) =>
  withCors(request, new Response(null, { status: 204 }))

export const POST = async (request: Request): Promise<Response> => {
  const originRejection = rejectDisallowedOrigin(request)
  if (originRejection) return originRejection

  const rate = await checkRateLimit({
    key: `razorpay-verify:${getClientIp(request)}`,
    limit: 20,
    windowMs: 15 * 60 * 1000,
  })
  if (rate.limited) {
    return withCors(request, Response.json({ error: 'Too many requests' }, { status: 429 }))
  }

  const body = (await request.json().catch(() => null)) as
    | {
        attemptId?: unknown
        razorpay_order_id?: unknown
        razorpay_payment_id?: unknown
        razorpay_signature?: unknown
      }
    | null

  if (
    !body
    || typeof body.attemptId !== 'string'
    || !/^[0-9a-f-]{36}$/i.test(body.attemptId)
    || !validRazorpayId(body.razorpay_order_id, 'order_')
    || !validRazorpayId(body.razorpay_payment_id, 'pay_')
    || typeof body.razorpay_signature !== 'string'
    || !/^[a-f0-9]{64}$/i.test(body.razorpay_signature)
  ) {
    return withCors(request, Response.json({ error: 'Invalid payment response' }, { status: 400 }))
  }

  let razorpay
  try {
    razorpay = getRazorpayClient()
  } catch (error) {
    console.error('[verify-payment] Unsafe Razorpay configuration', {
      error: error instanceof Error ? error.message : 'unknown',
    })
    return withCors(
      request,
      Response.json({ error: 'Payments are temporarily unavailable' }, { status: 503 }),
    )
  }
  if (!razorpay) {
    return withCors(
      request,
      Response.json({ error: 'Payments are temporarily unavailable' }, { status: 503 }),
    )
  }

  const payload = await getPayload({ config: configPromise })
  const attempt = await findPaymentAttempt(payload, body.attemptId)
  if (!attempt?.razorpayOrderId || body.razorpay_order_id !== attempt.razorpayOrderId) {
    return withCors(request, Response.json({ error: 'Payment reference mismatch' }, { status: 400 }))
  }

  let signatureIsValid = false
  try {
    signatureIsValid = verifyPaymentSignature({
      orderId: attempt.razorpayOrderId,
      paymentId: body.razorpay_payment_id,
      signature: body.razorpay_signature,
    })
  } catch {
    return withCors(
      request,
      Response.json({ error: 'Payments are temporarily unavailable' }, { status: 503 }),
    )
  }
  if (!signatureIsValid) {
    return withCors(request, Response.json({ error: 'Invalid payment signature' }, { status: 400 }))
  }

  try {
    const payment = await fetchRazorpayPayment(razorpay, body.razorpay_payment_id)
    if (
      payment.id !== body.razorpay_payment_id
      || !paymentMatchesAttempt(payment, attempt)
    ) {
      return withCors(request, Response.json({ error: 'Payment details mismatch' }, { status: 400 }))
    }

    if (isCapturedPayment(payment)) {
      const result = await finalizeCapturedPayment({
        payload,
        attemptId: attempt.attemptId,
        paymentId: payment.id,
      })

      if (result.state === 'refund_required') {
        return withCors(
          request,
          Response.json(
            {
              state: 'refund_required',
              error: 'Payment was captured, but fulfilment requires a refund review',
            },
            { status: 409 },
          ),
        )
      }

      return withCors(
        request,
        Response.json({ success: true, state: 'captured', orderId: result.orderId }),
      )
    }

    if (payment.status === 'failed') {
      await recordPaymentState({
        payload,
        attempt,
        status: 'failed',
        paymentId: payment.id,
        failureReason: 'Razorpay reported a failed payment',
      })
      return withCors(
        request,
        Response.json({ state: 'failed', error: 'Payment failed' }, { status: 402 }),
      )
    }

    await recordPaymentState({
      payload,
      attempt,
      status: payment.status === 'authorized' ? 'authorized' : 'pending',
      paymentId: payment.id,
    })
    return withCors(request, Response.json({ success: true, state: 'processing' }))
  } catch (error) {
    console.error('[verify-payment] Verification failed', {
      attemptId: attempt.attemptId,
      error: error instanceof Error ? error.message : 'unknown',
    })
    return withCors(
      request,
      Response.json({ error: 'Payment verification is temporarily unavailable' }, { status: 503 }),
    )
  }
}
