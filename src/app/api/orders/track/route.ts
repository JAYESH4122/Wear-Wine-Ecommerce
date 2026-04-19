import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { withCors } from '@/lib/server/cors'

export const OPTIONS = async (request: Request) => {
  return withCors(request, new Response(null, { status: 204 }))
}

export const POST = async (request: Request): Promise<Response> => {
  const body = (await request.json().catch(() => null)) as {
    emailOrPhone?: string
    orderId?: string
  } | null

  if (!body || !body.emailOrPhone) {
    return withCors(
      request,
      Response.json({ error: 'Email or Phone is required' }, { status: 400 }),
    )
  }

  const { emailOrPhone, orderId } = body
  const payload = await getPayload({ config: configPromise })

  const value = emailOrPhone.trim().toLowerCase()

  const where: any = {
    or: [
      { email: { equals: value } },
      { phone: { equals: emailOrPhone.trim() } },
    ],
  }

  if (orderId) {
    // If orderId is provided, it must match EXACTLY
    // We wrap the existing 'or' in an 'and' with the orderId check
    const originalOr = where.or
    delete where.or
    where.and = [
      { or: originalOr },
      { orderId: { equals: orderId.trim() } },
    ]
  }

  try {
    const { docs } = await payload.find({
      collection: 'orders',
      where,
      overrideAccess: true,
      limit: 20,
      sort: '-createdAt',
      select: {
        orderId: true,
        status: true,
        trackingId: true,
        createdAt: true,
      },
    })

    return withCors(request, Response.json({ docs }))
  } catch (error) {
    console.error('[api/orders/track] Error:', error)
    return withCors(
      request,
      Response.json({ error: 'Internal server error' }, { status: 500 }),
    )
  }
}
