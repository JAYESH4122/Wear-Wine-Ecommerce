import { getPayload } from 'payload'
import crypto from 'crypto'

import configPromise from '@/payload.config'
import { withCors } from '@/lib/server/cors'
import {
  deductVariantStock,
  fetchProductsByIds,
  normalizeCartItems,
  normalizeShippingAddress,
  normalizeMoney,
} from '@/lib/server/commerce'

const verifySignature = (orderId: string, paymentId: string, signature: string) => {
  const secret = process.env.RAZORPAY_KEY_SECRET!
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')

  return generatedSignature === signature
}

export const OPTIONS = async (request: Request) => {
  return withCors(request, new Response(null, { status: 204 }))
}

export const POST = async (request: Request): Promise<Response> => {
  const body = (await request.json().catch(() => null)) as {
    razorpay_order_id?: string
    razorpay_payment_id?: string
    razorpay_signature?: string
    orderData?: {
      email?: string
      phone?: string
      shippingAddress?: any
      items?: any
      total?: number
      userId?: string | null
    }
  } | null

  console.info('[verify-payment] Received payload:', {
    razorpayOrderId: body?.razorpay_order_id,
    razorpayPaymentId: body?.razorpay_payment_id,
    hasSignature: !!body?.razorpay_signature,
  })

  if (!body || !body.razorpay_order_id || !body.razorpay_payment_id || !body.razorpay_signature || !body.orderData) {
    return withCors(request, Response.json({ error: 'Missing required fields' }, { status: 400 }))
  }

  const { orderData } = body
  const payload = await getPayload({ config: configPromise })

  try {
    // 1. Idempotency Check: Prevent duplicate orders + double stock deduction
    const existingOrders = await payload.find({
      collection: 'orders',
      where: {
        razorpayPaymentId: {
          equals: body.razorpay_payment_id,
        },
      },
      overrideAccess: true,
      limit: 1,
    })

    if (existingOrders.docs.length > 0) {
      console.info('[verify-payment] Order already exists for this paymentId (Idempotency), returning success', {
        paymentId: body.razorpay_payment_id,
        orderId: existingOrders.docs[0].orderId,
      })
      return withCors(request, Response.json({ success: true, orderId: existingOrders.docs[0].orderId }))
    }

    // 2. Signature Verification
    const isValid = verifySignature(body.razorpay_order_id, body.razorpay_payment_id, body.razorpay_signature)
    if (!isValid) {
      console.error('[verify-payment] Invalid signature', {
        razorpayOrderId: body.razorpay_order_id,
        razorpayPaymentId: body.razorpay_payment_id,
      })
      return withCors(request, Response.json({ error: 'Invalid signature' }, { status: 400 }))
    }

    // 3. Security Re-validation (Prevent trust of frontend data)
    const normalizedItems = normalizeCartItems(orderData.items)
    const shippingAddress = normalizeShippingAddress(orderData.shippingAddress)

    if (!normalizedItems.length || !shippingAddress || !orderData.email || !orderData.phone) {
      return withCors(request, Response.json({ error: 'Invalid order data' }, { status: 400 }))
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
          // Persist the variant IDs so admin & stock logic can reference them
          size: item.size ?? undefined,
          color: item.color ?? undefined,
          quantity: item.quantity,
          name: product.name,
          price: typeof product.salePrice === 'number' ? product.salePrice : product.price,
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)

    const computedTotal = validItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const normalizedComputedTotal = normalizeMoney(computedTotal)

    // 4. Create Order in Payload (with variant snapshot)
    const orderId = `ORD-${Date.now()}`
    const order = await payload.create({
      collection: 'orders',
      data: {
        orderId,
        user: orderData.userId ? Number(orderData.userId) : null,
        email: orderData.email.toLowerCase().trim(),
        phone: orderData.phone.trim(),
        shippingAddress: {
          fullName: shippingAddress.fullName!,
          addressLine1: shippingAddress.addressLine1!,
          addressLine2: shippingAddress.addressLine2 || '',
          city: shippingAddress.city!,
          state: shippingAddress.state!,
          country: shippingAddress.country!,
          postalCode: shippingAddress.postalCode!,
          landmark: shippingAddress.landmark || '',
        },
        items: validItems,
        total: normalizedComputedTotal,
        status: 'placed',
        razorpayOrderId: body.razorpay_order_id,
        razorpayPaymentId: body.razorpay_payment_id,
        razorpaySignature: body.razorpay_signature,
      },
      overrideAccess: true,
    })

    console.info('[verify-payment] Order created successfully', {
      orderId: order.orderId,
      razorpayPaymentId: body.razorpay_payment_id,
    })

    // 5. Deduct stock for each ordered variant (non-blocking — order is already confirmed)
    await deductVariantStock(payload, normalizedItems, productsById)

    return withCors(request, Response.json({ success: true, orderId: order.orderId }))
  } catch (error) {
    console.error('[verify-payment] System error during verification/creation', {
      error: error instanceof Error ? error.message : 'unknown',
    })
    return withCors(request, Response.json({ error: 'Internal server error' }, { status: 500 }))
  }
}
