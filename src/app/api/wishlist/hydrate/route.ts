import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import {
  hydrateWishlistItems,
  normalizeWishlistItems,
} from '@/lib/server/commerce'
import { withCors } from '@/lib/server/cors'

export const OPTIONS = async (request: Request) => {
  return withCors(request, new Response(null, { status: 204 }))
}

export const POST = async (request: Request): Promise<Response> => {
  try {
    const body = (await request.json().catch(() => null)) as { items?: unknown } | null
    if (!body || !body.items) {
      return withCors(request, Response.json({ error: 'Invalid request body' }, { status: 400 }))
    }

    const normalizedItems = normalizeWishlistItems(body.items)
    if (normalizedItems.length === 0) {
      return withCors(request, Response.json({ items: [] }))
    }

    const payload = await getPayload({ config: configPromise })
    const hydratedItems = await hydrateWishlistItems(payload, normalizedItems)

    return withCors(
      request,
      Response.json({
        items: hydratedItems,
      }),
    )
  } catch (error) {
    console.error('Wishlist hydration error:', error)
    return withCors(request, Response.json({ error: 'Internal Server Error' }, { status: 500 }))
  }
}
