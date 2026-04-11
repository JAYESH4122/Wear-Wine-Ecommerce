import { getServerSession } from 'next-auth'
import { getPayload } from 'payload'
import Razorpay from 'razorpay'

import configPromise from '@/payload.config'
import { authOptions } from '@/lib/auth'
import {
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
  const shippingAddress = body.shippingAddress

  if (!email) return invalidBody(request, 'Email is required')
  if (!phone) return invalidBody(request, 'Phone is required')
  if (!shippingAddress) return invalidBody(request, 'Shipping address is required')

  const { fullName, addressLine1, city, state, country, postalCode } = shippingAddress
  if (!fullName || !addressLine1 || !city || !state || !country || !postalCode) {
    return invalidBody(request, 'All required shipping address fields must be provided')
  }

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

  const computedTotal = validItems.reduce((sum, item) => {
    return sum + item.price * item.quantity
  }, 0)

  // Razorpay expects amount in paise (multiply by 100)
  const amountInPaise = Math.round(computedTotal * 100)

  try {
    // 1. Create Order in Payload CMS
    const order = await payload.create({
      collection: 'orders',
      data: {
        user: payloadUser?.id || null,
        email,
        phone,
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
        total: computedTotal,
        status: 'pending',
      },
      overrideAccess: true,
    })

    // 2. Create Order in Razorpay
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: String(order.id),
      notes: {
        orderId: String(order.id),
        email,
      },
    })

    // 3. Update Payload order with razorpayOrderId
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        razorpayOrderId: razorpayOrder.id,
      },
      overrideAccess: true,
    })

    return withCors(
      request,
      Response.json({
        id: order.id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      })
    )
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return withCors(request, Response.json({ error: 'Failed to create payment order' }, { status: 500 }))
  }
}
