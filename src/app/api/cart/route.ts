import { getServerSession } from 'next-auth'
import { getPayload } from 'payload'

import configPromise from '@/payload.config'
import { authOptions } from '@/lib/auth'
import {
  cartItemsToCollectionRows,
  collectionRowsToCartItems,
  filterValidCartItems,
  hydrateCartItems,
  normalizeCartItems,
  requirePayloadUser,
} from '@/lib/server/commerce'
import { withCors } from '@/lib/server/cors'

const unauthorized = (request: Request) =>
  withCors(request, Response.json({ error: 'Unauthorized' }, { status: 401 }))

const invalidBody = (request: Request, message: string) =>
  withCors(request, Response.json({ error: message }, { status: 400 }))

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

  const cartDoc = await getUserCart(payload, payloadUser.id, payloadUser)
  const cartItems = await filterValidCartItems(payload, collectionRowsToCartItems(cartDoc?.items))
  const hydratedItems = await hydrateCartItems(payload, cartItems)

  return withCors(
    request,
    Response.json({
      items: hydratedItems,
    }),
  )
}

export const PUT = async (request: Request): Promise<Response> => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return unauthorized(request)

  const body = (await request.json().catch(() => null)) as { items?: unknown } | null
  if (!body) return invalidBody(request, 'Invalid request body')

  const normalizedItems = normalizeCartItems(body.items)

  const payload = await getPayload({ config: configPromise })
  const payloadUser = await requirePayloadUser(payload, session.user.id)
  if (!payloadUser) return unauthorized(request)

  const validItems = await filterValidCartItems(payload, normalizedItems)
  const cartDoc = await getUserCart(payload, payloadUser.id, payloadUser)

  if (!cartDoc) {
    await payload.create({
      collection: 'carts',
      data: {
        user: payloadUser.id,
        items: cartItemsToCollectionRows(validItems),
      },
      user: payloadUser,
      overrideAccess: false,
    })
  } else {
    await payload.update({
      collection: 'carts',
      id: cartDoc.id,
      data: {
        items: cartItemsToCollectionRows(validItems),
      },
      user: payloadUser,
      overrideAccess: false,
    })
  }

  const hydratedItems = await hydrateCartItems(payload, validItems)

  return withCors(
    request,
    Response.json({
      items: hydratedItems,
    }),
  )
}
