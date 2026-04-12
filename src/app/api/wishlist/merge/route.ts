import { getServerSession } from 'next-auth'
import { getPayload } from 'payload'

import configPromise from '@/payload.config'
import { authOptions } from '@/lib/auth'
import {
  collectionRowsToWishlistItems,
  filterValidWishlistItems,
  hydrateWishlistItems,
  mergeWishlistIds,
  normalizeWishlistItems,
  requirePayloadUser,
  wishlistItemsToCollectionRows,
} from '@/lib/server/commerce'
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit'
import { withCors } from '@/lib/server/cors'

const unauthorized = (request: Request) =>
  withCors(request, Response.json({ error: 'Unauthorized' }, { status: 401 }))

const invalidBody = (request: Request, message: string) =>
  withCors(request, Response.json({ error: message }, { status: 400 }))

const tooManyRequests = (request: Request) =>
  withCors(request, Response.json({ error: 'Too many requests' }, { status: 429 }))

const getUserWishlist = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  payloadUserId: string | number,
  user: unknown,
) => {
  const found = await payload.find({
    collection: 'wishlists',
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

export const POST = async (request: Request): Promise<Response> => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return unauthorized(request)

  const ip = getClientIp(request)
  const rate = checkRateLimit({
    key: `wishlist-merge:${ip}`,
    limit: 40,
    windowMs: 15 * 60 * 1000,
  })

  if (rate.limited) return tooManyRequests(request)

  const body = (await request.json().catch(() => null)) as { productIds?: unknown } | null
  if (!body) return invalidBody(request, 'Invalid request body')

  const incomingItems = normalizeWishlistItems(
    Array.isArray(body.productIds) ? body.productIds.map((productId) => ({ productId })) : [],
  )

  // Security: Limit wishlist size
  if (incomingItems.length > 100) return invalidBody(request, 'Too many items in wishlist')

  const payload = await getPayload({ config: configPromise })
  const payloadUser = await requirePayloadUser(payload, session.user.id)
  if (!payloadUser) return unauthorized(request)

  const validIncomingItems = await filterValidWishlistItems(payload, incomingItems)
  const wishlistDoc = await getUserWishlist(payload, payloadUser.id, payloadUser)
  const existingItems = await filterValidWishlistItems(
    payload,
    collectionRowsToWishlistItems(wishlistDoc?.products),
  )

  const existingItemById = new Map(existingItems.map((item) => [item.productId, item] as const))
  const mergedIds = mergeWishlistIds(
    existingItems.map((item) => item.productId),
    validIncomingItems.map((item) => item.productId),
  )
  const mergedItems = mergedIds.map((id) => existingItemById.get(id) ?? { productId: id })

  if (!wishlistDoc) {
    await payload.create({
      collection: 'wishlists',
      data: {
        user: payloadUser.id,
        products: wishlistItemsToCollectionRows(mergedItems),
      },
      user: payloadUser,
      overrideAccess: false,
    })
  } else {
    await payload.update({
      collection: 'wishlists',
      id: wishlistDoc.id,
      data: {
        products: wishlistItemsToCollectionRows(mergedItems),
      },
      user: payloadUser,
      overrideAccess: false,
    })
  }

  const products = await hydrateWishlistItems(payload, mergedItems)

  return withCors(
    request,
    Response.json({
      items: products,
    }),
  )
}
