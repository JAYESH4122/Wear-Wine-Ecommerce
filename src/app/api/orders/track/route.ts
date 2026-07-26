import { getPayload } from 'payload'

import { rejectDisallowedOrigin, withCors } from '@/lib/server/cors'
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit'
import configPromise from '@/payload.config'

export const OPTIONS = async (request: Request) =>
  withCors(request, new Response(null, { status: 204 }))

export const POST = async (request: Request): Promise<Response> => {
  const originRejection = rejectDisallowedOrigin(request)
  if (originRejection) return originRejection

  const body = (await request.json().catch(() => null)) as {
    emailOrPhone?: unknown
    orderId?: unknown
  } | null

  const emailOrPhone =
    typeof body?.emailOrPhone === 'string' ? body.emailOrPhone.trim().toLowerCase() : ''
  const orderId = typeof body?.orderId === 'string' ? body.orderId.trim() : ''

  if (
    !emailOrPhone
    || emailOrPhone.length > 254
    || !orderId
    || orderId.length > 100
  ) {
    return withCors(
      request,
      Response.json({ error: 'Exact Order ID and Email or Phone are required' }, { status: 400 }),
    )
  }

  const rate = await checkRateLimit({
    key: `order-track:${getClientIp(request)}:${emailOrPhone}`,
    limit: 10,
    windowMs: 15 * 60 * 1000,
  })
  if (rate.limited) {
    return withCors(request, Response.json({ error: 'Too many requests' }, { status: 429 }))
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'orders',
      where: {
        and: [
          { orderId: { equals: orderId } },
          {
            or: [
              { email: { equals: emailOrPhone } },
              { phone: { equals: emailOrPhone } },
            ],
          },
        ],
      },
      overrideAccess: true,
      limit: 1,
      depth: 0,
      select: {
        orderId: true,
        status: true,
        trackingId: true,
        createdAt: true,
      },
    })

    return withCors(request, Response.json({ docs }))
  } catch (error) {
    console.error('[orders-track] Lookup failed', {
      error: error instanceof Error ? error.message : 'unknown',
    })
    return withCors(
      request,
      Response.json({ error: 'Tracking is temporarily unavailable' }, { status: 503 }),
    )
  }
}
