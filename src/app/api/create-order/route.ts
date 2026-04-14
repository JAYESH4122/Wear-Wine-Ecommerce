import { getServerSession } from 'next-auth'
import { getPayload } from 'payload'
import Razorpay from 'razorpay'

import configPromise from '@/payload.config'
import { authOptions } from '@/lib/auth'
import {
  checkVariantStock,
  fetchProductsByIds,
  normalizeCartItems,
  requirePayloadUser,
} from '@/lib/server/commerce'
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit'
import { withCors } from '@/lib/server/cors'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

const invalidBody = (request: Request, message: string) =>
  withCors(request, Response.json({ error: message }, { status: 400 }))

const tooManyRequests = (request: Request) =>
  withCors(request, Response.json({ error: 'Too many requests' }, { status: 429 }))

type ShippingAddressInput = {
  fullName?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  landmark?: string
}

const normalizeMoney = (value: number) => Math.round(value * 100) / 100

const toTrimmedString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '')

const normalizeShippingAddress = (shippingAddress: ShippingAddressInput | undefined) => {
  if (!shippingAddress) return null

  const normalized = {
    fullName: toTrimmedString(shippingAddress.fullName),
    addressLine1: toTrimmedString(shippingAddress.addressLine1),
    addressLine2: toTrimmedString(shippingAddress.addressLine2),
    city: toTrimmedString(shippingAddress.city),
    state: toTrimmedString(shippingAddress.state),
    country: toTrimmedString(shippingAddress.country),
    postalCode: toTrimmedString(shippingAddress.postalCode),
    landmark: toTrimmedString(shippingAddress.landmark),
  }

  if (
    !normalized.fullName
    || !normalized.addressLine1
    || !normalized.city
    || !normalized.state
    || !normalized.country
    || !normalized.postalCode
  ) {
    return null
  }

  return normalized
}



export const OPTIONS = async (request: Request) => {
  return withCors(request, new Response(null, { status: 204 }))
}

export const POST = async (request: Request): Promise<Response> => {
  const ip = getClientIp(request)
  const rate = checkRateLimit({
    key: `razorpay-create:${ip}`,
    limit: 20,
    windowMs: 15 * 60 * 1000,
  })

  if (rate.limited) return tooManyRequests(request)

  const body = (await request.json().catch(() => null)) as
    | {
        email?: unknown
        phone?: unknown
        total?: unknown
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
        items?: unknown
      }
    | null

  if (!body) return invalidBody(request, 'Invalid request body')

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const providedTotal = Number(body.total)
  const shippingAddress = normalizeShippingAddress(body.shippingAddress)

  if (!email) return invalidBody(request, 'Email is required')
  if (!phone) return invalidBody(request, 'Phone is required')
  if (!Number.isFinite(providedTotal) || providedTotal <= 0) return invalidBody(request, 'Total is required')
  if (!shippingAddress) return invalidBody(request, 'All required shipping address fields must be provided')

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

  // Stock availability check before charging the customer
  const stockErrors = checkVariantStock(normalizedItems, productsById)
  if (stockErrors.length > 0) {
    const detail = stockErrors
      .map((e) => `"${e.productName}" (requested: ${e.requested}, available: ${e.available})`)
      .join('; ')
    console.warn('[create-order] Stock unavailable for items', { stockErrors })
    return withCors(
      request,
      Response.json(
        {
          error: 'Insufficient stock for one or more items',
          stockErrors,
          detail,
        },
        { status: 400 },
      ),
    )
  }

  const computedTotal = validItems.reduce((sum, item) => {
    return sum + item.price * item.quantity
  }, 0)
  const normalizedComputedTotal = normalizeMoney(computedTotal)

  if (normalizeMoney(providedTotal) !== normalizedComputedTotal) {
    return invalidBody(request, 'Order total mismatch')
  }

  // Razorpay expects amount in paise (multiply by 100)
  const amountInPaise = Math.round(normalizedComputedTotal * 100)

  try {
    // 1. Create Order in Razorpay ONLY
    // We do NOT create the Payload order record yet to avoid "zombie" entries.
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `RCPT-${Date.now()}`,
      notes: {
        email,
        itemCount: String(validItems.length),
      },
    })

    console.info('[create-order] Razorpay order generated', {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      isGuest: !payloadUser?.id,
    })

    return withCors(
      request,
      Response.json({
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        // We return validItems and total so the frontend can pass them to verify-payment
        // or just keep them in state.
      })
    )
  } catch (error) {
    console.error('[create-order] Failed to create Razorpay order', {
      error: error instanceof Error ? error.stack || error.message : String(error),
    })
    return withCors(request, Response.json({ error: error instanceof Error ? error.message : 'Failed to create payment order' }, { status: 500 }))
  }
}
