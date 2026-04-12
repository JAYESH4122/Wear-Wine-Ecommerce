import crypto from 'crypto'
import type { Payload, Where } from 'payload'

import type { Product, User } from '@/payload-types'

export type PrimitiveId = number

export type CartInputItem = {
  productId: PrimitiveId
  quantity: number
  size?: PrimitiveId | null
  color?: PrimitiveId | null
}

export type WishlistInputItem = {
  productId: PrimitiveId
  size?: PrimitiveId | null
  color?: PrimitiveId | null
}

const toIdKey = (id: PrimitiveId): string => String(id)

const normalizeProductId = (value: unknown): PrimitiveId | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.floor(value)
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null

    const asNumber = Number(trimmed)
    if (!Number.isFinite(asNumber)) return null

    return Math.floor(asNumber)
  }

  return null
}

export const normalizeCartItems = (value: unknown): CartInputItem[] => {
  if (!Array.isArray(value)) return []

  return value
    .map((raw): CartInputItem | null => {
      if (!raw || typeof raw !== 'object') return null

      const candidate = raw as {
        productId?: unknown
        quantity?: unknown
        size?: unknown
        color?: unknown
      }
      const productId = normalizeProductId(candidate.productId)
      const quantity = Number(candidate.quantity)
      const size = normalizeProductId(candidate.size)
      const color = normalizeProductId(candidate.color)

      if (!productId || !Number.isFinite(quantity) || quantity <= 0) return null

      return {
        productId,
        quantity: Math.max(1, Math.floor(quantity)),
        size,
        color,
      }
    })
    .filter(Boolean) as CartInputItem[]
}

export const normalizeWishlistItems = (value: unknown): WishlistInputItem[] => {
  if (!Array.isArray(value)) return []

  return value
    .map((raw): WishlistInputItem | null => {
      if (!raw || typeof raw !== 'object') return null

      const candidate = raw as { productId?: unknown; size?: unknown; color?: unknown }
      const productId = normalizeProductId(candidate.productId)
      const size = normalizeProductId(candidate.size)
      const color = normalizeProductId(candidate.color)

      if (!productId) return null

      return {
        productId,
        size,
        color,
      }
    })
    .filter(Boolean) as WishlistInputItem[]
}

export const cartItemsToCollectionRows = (items: CartInputItem[]) => {
  return items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
  }))
}

export const wishlistItemsToCollectionRows = (items: WishlistInputItem[]) => {
  return items.map((item) => ({
    productId: item.productId,
    size: item.size,
    color: item.color,
  }))
}

export const collectionRowsToCartItems = (
  rows: Array<{
    productId?: unknown
    quantity?: unknown
    size?: unknown
    color?: unknown
  } | null | undefined> | null | undefined,
): CartInputItem[] => {
  if (!Array.isArray(rows)) return []

  const mapped = rows
    .map((row) => {
      if (!row) return null

      const productId = normalizeProductId(row.productId)
      const quantity = Number(row.quantity)
      const size = normalizeProductId(row.size)
      const color = normalizeProductId(row.color)

      if (!productId || !Number.isFinite(quantity) || quantity <= 0) return null

      return {
        productId,
        quantity: Math.max(1, Math.floor(quantity)),
        size,
        color,
      }
    })
    .filter(Boolean)

  return normalizeCartItems(mapped)
}

export const collectionRowsToWishlistItems = (
  rows: Array<{ productId?: unknown; size?: unknown; color?: unknown } | null | undefined> | null | undefined,
): WishlistInputItem[] => {
  if (!Array.isArray(rows)) return []
  return normalizeWishlistItems(rows)
}

export const fetchProductsByIds = async (payload: Payload, ids: PrimitiveId[]): Promise<Map<string, Product>> => {
  const uniqueIds = Array.from(new Set(ids))
  if (uniqueIds.length === 0) return new Map()

  const where: Where = {
    id: {
      in: uniqueIds,
    },
  }

  const products = await payload.find({
    collection: 'products',
    where,
    depth: 2,
    limit: uniqueIds.length,
    overrideAccess: true,
  })

  const map = new Map<string, Product>()
  for (const doc of products.docs) {
    map.set(toIdKey(doc.id), doc as Product)
  }

  return map
}

export const filterValidCartItems = async (payload: Payload, items: CartInputItem[]): Promise<CartInputItem[]> => {
  const productMap = await fetchProductsByIds(
    payload,
    items.map((item) => item.productId),
  )

  return items.filter((item) => productMap.has(toIdKey(item.productId)))
}

export const filterValidWishlistItems = async (
  payload: Payload,
  items: WishlistInputItem[],
): Promise<WishlistInputItem[]> => {
  const productMap = await fetchProductsByIds(
    payload,
    items.map((item) => item.productId),
  )
  return items.filter((item) => productMap.has(toIdKey(item.productId)))
}

export const hashGuestCartMerge = (userId: PrimitiveId, items: CartInputItem[]): string => {
  const sorted = [...items].sort((a, b) => toIdKey(a.productId).localeCompare(toIdKey(b.productId)))
  const serial = JSON.stringify({ userId: toIdKey(userId), items: sorted })
  return crypto.createHash('sha256').update(serial).digest('hex')
}

export const hydrateCartItems = async (
  payload: Payload,
  items: CartInputItem[],
): Promise<Array<{ cartItemId: string; product: Product; quantity: number }>> => {
  const productMap = await fetchProductsByIds(
    payload,
    items.map((item) => item.productId),
  )

  return items
    .map((item) => {
      const product = productMap.get(toIdKey(item.productId))
      if (!product) return null

      // Since the frontend uses more specific types, we let it handle the full objects
      // but we return the product with depth 2 hydration.
      return {
        cartItemId: `${String(product.id)}-${item.color || 'no-color'}-${item.size || 'no-size'}`,
        product,
        quantity: item.quantity,
        selectedSize: item.size,
        selectedColor: item.color,
      }
    })
    .filter(Boolean) as Array<{ cartItemId: string; product: Product; quantity: number }>
}

export const hydrateWishlistItems = async (
  payload: Payload,
  items: WishlistInputItem[],
): Promise<Array<{ product: Product; selectedSize?: PrimitiveId | null; selectedColor?: PrimitiveId | null }>> => {
  const productMap = await fetchProductsByIds(
    payload,
    items.map((item) => item.productId),
  )

  return items
    .map((item) => {
      const product = productMap.get(toIdKey(item.productId))
      if (!product) return null

      return {
        product,
        selectedSize: item.size,
        selectedColor: item.color,
      }
    })
    .filter(Boolean) as Array<{
    product: Product
    selectedSize?: PrimitiveId | null
    selectedColor?: PrimitiveId | null
  }>
}

export const requirePayloadUser = async (payload: Payload, sessionUserId: string): Promise<User | null> => {
  try {
    const user = await payload.findByID({
      collection: 'users',
      id: sessionUserId,
      depth: 0,
      overrideAccess: true,
    })

    return user as User
  } catch {
    return null
  }
}

export const mergeCartItems = (existing: CartInputItem[], incoming: CartInputItem[]): CartInputItem[] => {
  const map = new Map<string, CartInputItem>()

  for (const item of existing) {
    map.set(toIdKey(item.productId), { ...item })
  }

  for (const item of incoming) {
    const key = toIdKey(item.productId)
    const existingItem = map.get(key)
    map.set(key, {
      productId: item.productId,
      quantity: (existingItem?.quantity ?? 0) + item.quantity,
    })
  }

  return Array.from(map.values())
}

export const mergeWishlistIds = (existing: PrimitiveId[], incoming: PrimitiveId[]): PrimitiveId[] => {
  const seen = new Set<string>()
  const output: PrimitiveId[] = []

  for (const id of [...existing, ...incoming]) {
    const key = toIdKey(id)
    if (seen.has(key)) continue
    seen.add(key)
    output.push(id)
  }

  return output
}
