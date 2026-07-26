import { getServerSession } from 'next-auth'
import { getPayload } from 'payload'

import { authOptions } from '@/lib/auth'
import { requirePayloadUser } from '@/lib/server/commerce'
import { withCors } from '@/lib/server/cors'
import configPromise from '@/payload.config'

const unauthorized = (request: Request) =>
  withCors(request, Response.json({ error: 'Unauthorized' }, { status: 401 }))

export const OPTIONS = async (request: Request) =>
  withCors(request, new Response(null, { status: 204 }))

export const GET = async (request: Request): Promise<Response> => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return unauthorized(request)

  const payload = await getPayload({ config: configPromise })
  const payloadUser = await requirePayloadUser(payload, session.user.id)
  if (!payloadUser) return unauthorized(request)

  const orders = await payload.find({
    collection: 'orders',
    where: { user: { equals: payloadUser.id } },
    user: payloadUser,
    overrideAccess: false,
    depth: 0,
    sort: '-createdAt',
    limit: 100,
  })

  return withCors(
    request,
    Response.json({
      orders: orders.docs.map((order) => ({
        id: order.id,
        orderId: order.orderId,
        createdAt: order.createdAt,
        total: order.total,
        status: order.status,
        itemsCount: Array.isArray(order.items)
          ? order.items.reduce((sum, item) => sum + Number(item?.quantity ?? 0), 0)
          : 0,
      })),
    }),
  )
}
