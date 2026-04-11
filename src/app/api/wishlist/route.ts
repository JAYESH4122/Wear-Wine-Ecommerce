import { getServerSession } from 'next-auth'
import { getPayload } from 'payload'

import configPromise from '@/payload.config'
import { authOptions } from '@/lib/auth'
import {
  collectionRowsToWishlistIds,
  filterValidWishlistIds,
  hydrateWishlistItems,
  normalizeWishlistProductIds,
  requirePayloadUser,
  wishlistIdsToCollectionRows,
} from '@/lib/server/commerce'
import { withCors } from '@/lib/server/cors'

const unauthorized = (request: Request) =>
  withCors(request, Response.json({ error: 'Unauthorized' }, { status: 401 }))

const invalidBody = (request: Request, message: string) =>
  withCors(request, Response.json({ error: message }, { status: 400 }))

const getUserWishlist = async (payload: Awaited<ReturnType<typeof getPayload>>, payloadUserId: string | number, user: unknown) => {
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

export const GET = async (request: Request): Promise<Response> => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return unauthorized(request)

  const payload = await getPayload({ config: configPromise })
  const payloadUser = await requirePayloadUser(payload, session.user.id)
  if (!payloadUser) return unauthorized(request)

  const wishlistDoc = await getUserWishlist(payload, payloadUser.id, payloadUser)
  const productIds = await filterValidWishlistIds(payload, collectionRowsToWishlistIds(wishlistDoc?.products))
  const products = await hydrateWishlistItems(payload, productIds)

  return withCors(
    request,
    Response.json({
      items: products,
    }),
  )
}

export const PUT = async (request: Request): Promise<Response> => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return unauthorized(request)

  const body = (await request.json().catch(() => null)) as { productIds?: unknown } | null
  if (!body) return invalidBody(request, 'Invalid request body')

  const normalizedIds = normalizeWishlistProductIds(body.productIds)

  const payload = await getPayload({ config: configPromise })
  const payloadUser = await requirePayloadUser(payload, session.user.id)
  if (!payloadUser) return unauthorized(request)

  const validIds = await filterValidWishlistIds(payload, normalizedIds)
  const wishlistDoc = await getUserWishlist(payload, payloadUser.id, payloadUser)

  if (!wishlistDoc) {
    await payload.create({
      collection: 'wishlists',
      data: {
        user: payloadUser.id,
        products: wishlistIdsToCollectionRows(validIds),
      },
      user: payloadUser,
      overrideAccess: false,
    })
  } else {
    await payload.update({
      collection: 'wishlists',
      id: wishlistDoc.id,
      data: {
        products: wishlistIdsToCollectionRows(validIds),
      },
      user: payloadUser,
      overrideAccess: false,
    })
  }

  const products = await hydrateWishlistItems(payload, validIds)

  return withCors(
    request,
    Response.json({
      items: products,
    }),
  )
}
