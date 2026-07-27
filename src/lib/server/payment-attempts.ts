import crypto from 'crypto'
import { sql } from '@payloadcms/db-postgres'
import {
  commitTransaction,
  createLocalReq,
  initTransaction,
  killTransaction,
  type Payload,
  type PayloadRequest,
} from 'payload'

import type { Product } from '@/payload-types'
import {
  fetchProductsByIds,
  normalizeCartItems,
  type CartInputItem,
} from '@/lib/server/commerce'

const MAX_CART_LINES = 50
const MAX_QUANTITY_PER_LINE = 10

type RelationshipValue = number | { id: number } | null | undefined

type ShippingAddress = {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  country: string
  postalCode: string
  landmark?: string
}

export type PaymentSnapshotItem = {
  product: number
  name: string
  size?: number
  color?: number
  variantKey: string
  variantId: string
  quantity: number
  unitPricePaise: number
  lineTotalPaise: number
}

export type PaymentAttemptRecord = {
  id: number
  attemptId: string
  user?: RelationshipValue
  email: string
  phone: string
  shippingAddress: ShippingAddress
  items: PaymentSnapshotItem[]
  amountPaise: number
  currency: 'INR'
  status:
    | 'creating'
    | 'pending'
    | 'authorized'
    | 'captured'
    | 'failed'
    | 'expired'
    | 'refund_required'
    | 'refunded'
  razorpayOrderId?: string | null
  razorpayPaymentId?: string | null
  order?: RelationshipValue
  expiresAt: string
}

export class InvalidCartError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidCartError'
  }
}

class InsufficientStockError extends Error {
  constructor() {
    super('Stock is no longer available')
    this.name = 'InsufficientStockError'
  }
}

const relationId = (value: RelationshipValue): number | null => {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && typeof value.id === 'number') return value.id
  return null
}

const variantRelationId = (value: unknown): number | null => {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = Number((value as { id?: unknown }).id)
    return Number.isInteger(id) && id > 0 ? id : null
  }
  return null
}

const exactVariant = (product: Product, item: CartInputItem) => {
  if (!Array.isArray(product.variants) || product.variants.length === 0) return null
  if (!item.size) return null

  return (
    product.variants.find((variant) => {
      const sizeId = variantRelationId(variant.size)
      const colorId = variantRelationId(variant.color)

      return sizeId === item.size && colorId === (item.color ?? null)
    }) ?? null
  )
}

const consolidateCartItems = (items: CartInputItem[]) => {
  const consolidated = new Map<string, CartInputItem>()

  for (const item of items) {
    const key = `${item.productId}:${item.size ?? 'none'}:${item.color ?? 'none'}`
    const existing = consolidated.get(key)
    const quantity = (existing?.quantity ?? 0) + item.quantity
    if (quantity > MAX_QUANTITY_PER_LINE) {
      throw new InvalidCartError(`A maximum of ${MAX_QUANTITY_PER_LINE} units is allowed per variant`)
    }
    consolidated.set(key, { ...item, quantity })
  }

  return [...consolidated.values()]
}

export const buildPaymentSnapshot = async (payload: Payload, input: unknown) => {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_CART_LINES) {
    throw new InvalidCartError('Cart must contain between 1 and 50 items')
  }
  if (
    input.some((raw) => {
      if (!raw || typeof raw !== 'object') return true
      const quantity = Number((raw as { quantity?: unknown }).quantity)
      return !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_LINE
    })
  ) {
    throw new InvalidCartError(
      `Each quantity must be a whole number between 1 and ${MAX_QUANTITY_PER_LINE}`,
    )
  }

  const normalized = normalizeCartItems(input)
  if (normalized.length !== input.length) {
    throw new InvalidCartError('Every cart item must contain a valid product, variant, and quantity')
  }

  const items = consolidateCartItems(normalized)
  const products = await fetchProductsByIds(
    payload,
    items.map((item) => item.productId),
  )
  if (products.size !== new Set(items.map((item) => item.productId)).size) {
    throw new InvalidCartError('One or more products are unavailable')
  }

  const snapshot: PaymentSnapshotItem[] = items.map((item) => {
    const product = products.get(String(item.productId))
    if (!product) throw new InvalidCartError('One or more products are unavailable')

    const variant = exactVariant(product, item)
    if (!variant?.id) {
      throw new InvalidCartError(`Select an exact available size and color for "${product.name}"`)
    }

    const available = Number(variant.stock ?? 0)
    if (!Number.isFinite(available) || available < item.quantity) {
      throw new InvalidCartError(`Insufficient stock for "${product.name}"`)
    }

    const basePrice = Number(product.price)
    const salePrice = Number(product.salePrice)
    const hasValidSalePrice =
      Number.isFinite(salePrice) && salePrice > 0 && salePrice < basePrice
    const price = hasValidSalePrice ? salePrice : basePrice
    const unitPricePaise = Math.round(Number(price) * 100)
    if (!Number.isSafeInteger(unitPricePaise) || unitPricePaise <= 0) {
      throw new InvalidCartError(`"${product.name}" has an invalid price`)
    }

    return {
      product: Number(product.id),
      name: product.name,
      size: item.size ?? undefined,
      color: item.color ?? undefined,
      variantKey: `${product.id}:${item.size}:${item.color ?? 'none'}`,
      variantId: String(variant.id),
      quantity: item.quantity,
      unitPricePaise,
      lineTotalPaise: unitPricePaise * item.quantity,
    }
  })

  const amountPaise = snapshot.reduce((sum, item) => sum + item.lineTotalPaise, 0)
  if (!Number.isSafeInteger(amountPaise) || amountPaise <= 0) {
    throw new InvalidCartError('The order amount is invalid')
  }

  return { amountPaise, items: snapshot }
}

export const findPaymentAttempt = async (
  payload: Payload,
  attemptId: string,
  req?: PayloadRequest,
): Promise<PaymentAttemptRecord | null> => {
  const result = await payload.find({
    collection: 'payment-attempts',
    where: { attemptId: { equals: attemptId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    ...(req ? { req } : {}),
  })

  return (result.docs[0] as unknown as PaymentAttemptRecord | undefined) ?? null
}

const createWebhookEvent = async ({
  payload,
  req,
  event,
  attempt,
}: {
  payload: Payload
  req: PayloadRequest
  event?: { id: string; name: string } | null
  attempt: PaymentAttemptRecord
}) => {
  if (!event) return

  await payload.create({
    collection: 'payment-webhook-events',
    data: {
      eventId: event.id,
      eventName: event.name,
      razorpayOrderId: attempt.razorpayOrderId ?? undefined,
      paymentAttempt: attempt.id,
      processedAt: new Date().toISOString(),
    },
    req,
    overrideAccess: true,
  })
}

const existingOrderId = async (payload: Payload, attempt: PaymentAttemptRecord, req?: PayloadRequest) => {
  const orderId = relationId(attempt.order)
  if (!orderId) return null

  const order = await payload.findByID({
    collection: 'orders',
    id: orderId,
    depth: 0,
    overrideAccess: true,
    ...(req ? { req } : {}),
  })
  return order.orderId
}

const getTransactionDatabase = async (payload: Payload, req: PayloadRequest) => {
  const transactionId = await req.transactionID
  const sessions = (payload.db as typeof payload.db & {
    sessions?: Record<string, { db?: { execute: (query: unknown) => Promise<unknown> } }>
  }).sessions
  const database = transactionId == null ? null : sessions?.[String(transactionId)]?.db
  if (!database) throw new Error('Postgres transaction session is unavailable')
  return database
}

const lockPaymentAttempt = async (
  payload: Payload,
  req: PayloadRequest,
  attemptId: string,
) => {
  const database = await getTransactionDatabase(payload, req)
  const result = (await database.execute(sql`
    SELECT "id"
    FROM "payment_attempts"
    WHERE "attempt_id" = ${attemptId}
    FOR UPDATE
  `)) as { rowCount?: number; rows?: unknown[] }

  const matched = result.rowCount ?? result.rows?.length ?? 0
  if (matched !== 1) throw new Error('Payment attempt not found')

  const attempt = await findPaymentAttempt(payload, attemptId, req)
  if (!attempt) throw new Error('Payment attempt not found')
  return attempt
}

const updateStockConditionally = async (
  database: { execute: (query: unknown) => Promise<unknown> },
  item: PaymentSnapshotItem,
) => {
  const result = (await database.execute(sql`
    UPDATE "products_variants"
    SET "stock" = "stock" - ${item.quantity}
    WHERE "id" = ${item.variantId}
      AND "_parent_id" = ${item.product}
      AND "stock" >= ${item.quantity}
    RETURNING "id"
  `)) as { rowCount?: number; rows?: unknown[] }

  const affected = result.rowCount ?? result.rows?.length ?? 0
  if (affected !== 1) throw new InsufficientStockError()
}

const markRefundRequired = async ({
  payload,
  attemptId,
  paymentId,
  event,
}: {
  payload: Payload
  attemptId: string
  paymentId: string
  event?: { id: string; name: string } | null
}) => {
  const req = await createLocalReq({}, payload)
  await initTransaction(req)

  try {
    const attempt = await lockPaymentAttempt(payload, req, attemptId)

    const completedOrderId = await existingOrderId(payload, attempt, req)
    if (completedOrderId) {
      await createWebhookEvent({ payload, req, event, attempt })
      await commitTransaction(req)
      return { state: 'captured' as const, orderId: completedOrderId }
    }

    await payload.update({
      collection: 'payment-attempts',
      id: attempt.id,
      data: {
        status: 'refund_required',
        razorpayPaymentId: paymentId,
        processedAt: new Date().toISOString(),
        failureReason: 'Captured payment could not be fulfilled because stock was unavailable',
      },
      req,
      overrideAccess: true,
    })
    await createWebhookEvent({ payload, req, event, attempt })
    await commitTransaction(req)
    return { state: 'refund_required' as const }
  } catch (error) {
    await killTransaction(req)
    throw error
  }
}

export const finalizeCapturedPayment = async ({
  payload,
  attemptId,
  paymentId,
  event,
}: {
  payload: Payload
  attemptId: string
  paymentId: string
  event?: { id: string; name: string } | null
}) => {
  const req = await createLocalReq({}, payload)
  await initTransaction(req)

  try {
    const attempt = await lockPaymentAttempt(payload, req, attemptId)

    const completedOrderId = await existingOrderId(payload, attempt, req)
    if (completedOrderId) {
      await createWebhookEvent({ payload, req, event, attempt })
      await commitTransaction(req)
      return { state: 'captured' as const, orderId: completedOrderId }
    }

    if (!attempt.razorpayOrderId) throw new Error('Payment attempt is missing its Razorpay order')
    const database = await getTransactionDatabase(payload, req)
    for (const item of attempt.items) {
      await updateStockConditionally(database, item)
    }

    const order = await payload.create({
      collection: 'orders',
      data: {
        orderId: `ORD-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
        paymentAttempt: attempt.id,
        user: relationId(attempt.user) ?? undefined,
        email: attempt.email,
        phone: attempt.phone,
        shippingAddress: attempt.shippingAddress,
        items: attempt.items.map((item) => ({
          product: item.product,
          name: item.name,
          size: item.size,
          color: item.color,
          price: item.unitPricePaise / 100,
          quantity: item.quantity,
        })),
        total: attempt.amountPaise / 100,
        status: 'placed',
        razorpayOrderId: attempt.razorpayOrderId,
        razorpayPaymentId: paymentId,
      },
      req,
      overrideAccess: true,
    })

    await payload.update({
      collection: 'payment-attempts',
      id: attempt.id,
      data: {
        status: 'captured',
        razorpayPaymentId: paymentId,
        order: order.id,
        processedAt: new Date().toISOString(),
      },
      req,
      overrideAccess: true,
    })
    await createWebhookEvent({ payload, req, event, attempt })
    await commitTransaction(req)

    return { state: 'captured' as const, orderId: order.orderId }
  } catch (error) {
    await killTransaction(req)
    if (error instanceof InsufficientStockError) {
      return markRefundRequired({ payload, attemptId, paymentId, event })
    }
    throw error
  }
}

export const recordPaymentState = async ({
  payload,
  attempt,
  status,
  paymentId,
  failureReason,
  refundId,
  event,
}: {
  payload: Payload
  attempt: PaymentAttemptRecord
  status: PaymentAttemptRecord['status']
  paymentId?: string
  failureReason?: string
  refundId?: string
  event?: { id: string; name: string } | null
}) => {
  const req = await createLocalReq({}, payload)
  await initTransaction(req)

  try {
    const latest = await lockPaymentAttempt(payload, req, attempt.attemptId)

    if (shouldTransitionPaymentStatus(latest.status, status)) {
      await payload.update({
        collection: 'payment-attempts',
        id: latest.id,
        data: {
          status,
          razorpayPaymentId: paymentId ?? latest.razorpayPaymentId ?? undefined,
          failureReason,
          refundId,
          processedAt: new Date().toISOString(),
        },
        req,
        overrideAccess: true,
      })
    }
    await createWebhookEvent({ payload, req, event, attempt: latest })
    await commitTransaction(req)
  } catch (error) {
    await killTransaction(req)
    throw error
  }
}

export const shouldTransitionPaymentStatus = (
  current: PaymentAttemptRecord['status'],
  next: PaymentAttemptRecord['status'],
) => {
  if (current === 'refunded') return false
  if (next === 'refunded') return true
  if (next === 'refund_required') {
    return current === 'captured' || current === 'refund_required'
  }

  return current !== 'captured' && current !== 'refund_required'
}

export const paymentMatchesAttempt = (
  payment: {
    order_id?: unknown
    amount?: unknown
    currency?: unknown
    status?: unknown
    captured?: unknown
  },
  attempt: PaymentAttemptRecord,
) => {
  return (
    payment.order_id === attempt.razorpayOrderId
    && Number(payment.amount) === attempt.amountPaise
    && payment.currency === attempt.currency
  )
}

export const isCapturedPayment = (payment: { status?: unknown; captured?: unknown }) =>
  payment.status === 'captured' && payment.captured === true

export const opaqueAttemptId = () => crypto.randomUUID()

export type { ShippingAddress }
