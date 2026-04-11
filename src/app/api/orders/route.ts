import { getServerSession } from 'next-auth'
import { getPayload } from 'payload'

import configPromise from '@/payload.config'
import { authOptions } from '@/lib/auth'
import {
  cartItemsToCollectionRows,
  collectionRowsToCartItems,
  fetchProductsByIds,
  normalizeCartItems,
  requirePayloadUser,
} from '@/lib/server/commerce'
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit'
import { withCors } from '@/lib/server/cors'

const invalidBody = (request: Request, message: string) =>
  withCors(request, Response.json({ error: message }, { status: 400 }))

const tooManyRequests = (request: Request) =>
  withCors(request, Response.json({ error: 'Too many requests' }, { status: 429 }))

const unauthorized = (request: Request) =>
  withCors(request, Response.json({ error: 'Unauthorized' }, { status: 401 }))

const getUserCart = async (payload: Awaited<ReturnType<typeof getPayload>>, payloadUserId: string | number, user: unknown) => {
  const found = await payload.find({
    collection: 'carts',
    where: {
      user: {
        equals: payloadUserId,
      },
    },
    limit: 1,
    depth: 0,
    user,
    overrideAccess: false,
  })

  return found.docs[0] || null
}

export const OPTIONS = async (request: Request) => {
  return withCors(request, new Response(null, { status: 204 }))
}

export const GET = async (request: Request): Promise<Response> => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return unauthorized(request)

  const payload = await getPayload({ config: configPromise })
  const payloadUser = await requirePayloadUser(payload, session.user.id)
  if (!payloadUser) return unauthorized(request)

  const orders = await payload.find({
    collection: 'orders',
    where: {
      user: {
        equals: payloadUser.id,
      },
    },
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

export const POST = async (request: Request): Promise<Response> => {
  const ip = getClientIp(request)
  const rate = checkRateLimit({
    key: `orders-create:${ip}`,
    limit: 20,
    windowMs: 15 * 60 * 1000,
  })

  if (rate.limited) return tooManyRequests(request)

  const body = (await request.json().catch(() => null)) as
    | {
        email?: unknown
        phone?: unknown
        items?: unknown
        status?: unknown
        shippingAddress?: {
          fullName?: string
          addressLine1?: string
          addressLine2?: string
          city?: string
          state?: string
          country?: string
          postalCode?: string
          landmark?: string
        }
      }
    | null

  if (!body) return invalidBody(request, 'Invalid request body')

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email) return invalidBody(request, 'Email is required')

  const normalizedItems = normalizeCartItems(body.items)
  if (normalizedItems.length === 0) return invalidBody(request, 'Cart items are required')

  const payload = await getPayload({ config: configPromise })
  const session = await getServerSession(authOptions)

  const payloadUser = session?.user?.id ? await requirePayloadUser(payload, session.user.id) : null

  // Security: If logged in, email MUST match user email
  if (payloadUser && email !== payloadUser.email.toLowerCase()) {
    return invalidBody(request, 'Email mismatch for authenticated user')
  }

  const productsById = await fetchProductsByIds(
    payload,
    normalizedItems.map((item) => item.productId),
  )

  const validItems = normalizedItems
    .map((item) => {
      const product = productsById.get(String(item.productId))
      if (!product) return null
      
      return {
        product: item.productId,
        quantity: item.quantity,
        name: product.name,
        price: typeof product.salePrice === 'number' ? product.salePrice : product.price
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  if (validItems.length === 0) return invalidBody(request, 'No valid products were provided')

  const computedTotal = validItems.reduce((sum, item) => {
    return sum + item.price * item.quantity
  }, 0)

  // Security: Status MUST be pending for new orders from this endpoint
  const status = 'pending'

  const order = await payload.create({
    collection: 'orders',
    data: {
      user: payloadUser?.id,
      email,
      phone: (typeof body.phone === 'string' ? body.phone : '') || '9999999999', // Placeholder if not provided
      shippingAddress: body.shippingAddress
        ? {
            fullName: body.shippingAddress.fullName || 'Legacy User',
            addressLine1: body.shippingAddress.addressLine1 || 'Legacy Address',
            addressLine2: body.shippingAddress.addressLine2 || '',
            city: body.shippingAddress.city || 'Legacy City',
            state: body.shippingAddress.state || 'Legacy State',
            country: body.shippingAddress.country || 'India',
            postalCode: body.shippingAddress.postalCode || '000000',
            landmark: body.shippingAddress.landmark || '',
          }
        : {
            fullName: 'Legacy User',
            addressLine1: 'Legacy Address',
            city: 'Legacy City',
            state: 'Legacy State',
            country: 'India',
            postalCode: '000000',
          },
      items: validItems,
      total: computedTotal,
      status,
    },
    overrideAccess: true,
  })

  if (payloadUser) {
    const cartDoc = await getUserCart(payload, payloadUser.id, payloadUser)
    if (cartDoc) {
      const currentItems = collectionRowsToCartItems(cartDoc.items)
      const orderedIds = new Set(validItems.map((item) => String(item.product)))
      const remainingItems = currentItems.filter((item) => !orderedIds.has(String(item.productId)))

      await payload.update({
        collection: 'carts',
        id: cartDoc.id,
        data: {
          items: cartItemsToCollectionRows(remainingItems),
        },
        user: payloadUser,
        overrideAccess: false,
      })
    }
  }

  return withCors(
    request,
    Response.json(
      {
        order: {
          id: order.id,
          email: order.email,
          total: order.total,
          status: order.status,
        },
      },
      {
        status: 201,
      },
    ),
  )
}
