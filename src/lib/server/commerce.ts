import crypto from 'crypto'
import type { Payload, Where } from 'payload'

import type { Product, User } from '@/payload-types'

export type PrimitiveId = number

export type CartInputItem = {
  productId: PrimitiveId
  quantity: number
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

  const byProductId = new Map<string, CartInputItem>()

  for (const raw of value) {
    if (!raw || typeof raw !== 'object') continue

    const candidate = raw as { productId?: unknown; quantity?: unknown }
    const productId = normalizeProductId(candidate.productId)
    const quantity = Number(candidate.quantity)

    if (!productId || !Number.isFinite(quantity) || quantity <= 0) continue

    const safeQuantity = Math.max(1, Math.floor(quantity))
    const key = toIdKey(productId)
    const existing = byProductId.get(key)

    byProductId.set(key, {
      productId,
      quantity: (existing?.quantity ?? 0) + safeQuantity,
    })
  }

  return Array.from(byProductId.values())
}

export const normalizeWishlistProductIds = (value: unknown): PrimitiveId[] => {
  if (!Array.isArray(value)) return []

  const seen = new Set<string>()
  const output: PrimitiveId[] = []

  for (const raw of value) {
    const id = normalizeProductId(raw)
    if (!id) continue

    const key = toIdKey(id)
    if (seen.has(key)) continue

    seen.add(key)
    output.push(id)
  }

  return output
}

export const cartItemsToCollectionRows = (items: CartInputItem[]) => {
  return items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }))
}

export const wishlistIdsToCollectionRows = (productIds: PrimitiveId[]) => {
  return productIds.map((productId) => ({ productId }))
}

export const collectionRowsToCartItems = (
  rows: Array<{ productId?: unknown; quantity?: unknown } | null | undefined> | null | undefined,
): CartInputItem[] => {
  if (!Array.isArray(rows)) return []

  const mapped = rows
    .map((row) => {
      if (!row) return null

      const productId = normalizeProductId(row.productId)
      const quantity = Number(row.quantity)

      if (!productId || !Number.isFinite(quantity) || quantity <= 0) return null

      return {
        productId,
        quantity: Math.max(1, Math.floor(quantity)),
      }
    })
    .filter(Boolean)

  return normalizeCartItems(mapped)
}

export const collectionRowsToWishlistIds = (
  rows: Array<{ productId?: unknown } | null | undefined> | null | undefined,
): PrimitiveId[] => {
  if (!Array.isArray(rows)) return []
  return normalizeWishlistProductIds(rows.map((row) => row?.productId))
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
    depth: 1,
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

export const filterValidWishlistIds = async (payload: Payload, ids: PrimitiveId[]): Promise<PrimitiveId[]> => {
  const productMap = await fetchProductsByIds(payload, ids)
  return ids.filter((id) => productMap.has(toIdKey(id)))
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

      return {
        cartItemId: `${String(product.id)}-no-color-no-size`,
        product,
        quantity: item.quantity,
      }
    })
    .filter(Boolean) as Array<{ cartItemId: string; product: Product; quantity: number }>
}

export const hydrateWishlistItems = async (payload: Payload, productIds: PrimitiveId[]): Promise<Product[]> => {
  const productMap = await fetchProductsByIds(payload, productIds)

  return productIds
    .map((id) => productMap.get(toIdKey(id)) ?? null)
    .filter(Boolean) as Product[]
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
