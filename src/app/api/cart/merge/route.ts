import { getServerSession } from 'next-auth'
import { getPayload } from 'payload'

import configPromise from '@/payload.config'
import { authOptions } from '@/lib/auth'
import {
  cartItemsToCollectionRows,
  collectionRowsToCartItems,
  filterValidCartItems,
  hashGuestCartMerge,
  hydrateCartItems,
  mergeCartItems,
  normalizeCartItems,
  requirePayloadUser,
} from '@/lib/server/commerce'
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit'
import { withCors } from '@/lib/server/cors'

const unauthorized = (request: Request) =>
  withCors(request, Response.json({ error: 'Unauthorized' }, { status: 401 }))

const invalidBody = (request: Request, message: string) =>
  withCors(request, Response.json({ error: message }, { status: 400 }))

const tooManyRequests = (request: Request) =>
  withCors(request, Response.json({ error: 'Too many requests' }, { status: 429 }))

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

export const POST = async (request: Request): Promise<Response> => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return unauthorized(request)

  const ip = getClientIp(request)
  const rate = checkRateLimit({
    key: `cart-merge:${ip}`,
    limit: 40,
    windowMs: 15 * 60 * 1000,
  })

  if (rate.limited) return tooManyRequests(request)

  const body = (await request.json().catch(() => null)) as { items?: unknown } | null
  if (!body) return invalidBody(request, 'Invalid request body')

  const guestItems = normalizeCartItems(body.items)

  // Security: Limit guest cart size and item quantities
  if (guestItems.length > 50) return invalidBody(request, 'Too many items in cart')
  for (const item of guestItems) {
    if (item.quantity > 99) {
      item.quantity = 99 // Cap quantity per item
    }
  }

  const payload = await getPayload({ config: configPromise })
  const payloadUser = await requirePayloadUser(payload, session.user.id)
  if (!payloadUser) return unauthorized(request)

  const validGuestItems = await filterValidCartItems(payload, guestItems)
  const cartDoc = await getUserCart(payload, payloadUser.id, payloadUser)
  const existingItems = await filterValidCartItems(payload, collectionRowsToCartItems(cartDoc?.items))
  const guestHash = hashGuestCartMerge(payloadUser.id, validGuestItems)

  let mergedItems = existingItems

  if (!cartDoc) {
    mergedItems = validGuestItems

    await payload.create({
      collection: 'carts',
      data: {
        user: payloadUser.id,
        items: cartItemsToCollectionRows(mergedItems),
        lastMergedGuestHash: guestHash,
      },
      user: payloadUser,
      overrideAccess: false,
    })
  } else if (cartDoc.lastMergedGuestHash !== guestHash) {
    mergedItems = mergeCartItems(existingItems, validGuestItems)

    await payload.update({
      collection: 'carts',
      id: cartDoc.id,
      data: {
        items: cartItemsToCollectionRows(mergedItems),
        lastMergedGuestHash: guestHash,
      },
      user: payloadUser,
      overrideAccess: false,
    })
  }

  const hydratedItems = await hydrateCartItems(payload, mergedItems)

  return withCors(
    request,
    Response.json({
      items: hydratedItems,
    }),
  )
}
