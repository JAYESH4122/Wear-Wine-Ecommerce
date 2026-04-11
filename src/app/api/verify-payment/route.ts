import { getPayload } from 'payload'
import crypto from 'crypto'

import configPromise from '@/payload.config'
import { withCors } from '@/lib/server/cors'

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
  } | null

  console.info('[verify-payment] Received payload:', {
    razorpayOrderId: body?.razorpay_order_id,
    razorpayPaymentId: body?.razorpay_payment_id,
    hasSignature: !!body?.razorpay_signature,
  })

  if (!body || !body.razorpay_order_id || !body.razorpay_payment_id || !body.razorpay_signature) {
    return withCors(request, Response.json({ error: 'Missing required fields' }, { status: 400 }))
  }

  const payload = await getPayload({ config: configPromise })

  try {
    const orders = await payload.find({
      collection: 'orders',
      where: {
        razorpayOrderId: {
          equals: body.razorpay_order_id,
        },
      },
      overrideAccess: true,
      limit: 2,
      depth: 0,
    })

    if (orders.docs.length === 0) {
      console.error('[verify-payment] Order not found', {
        razorpayOrderId: body.razorpay_order_id,
      })
      return withCors(request, Response.json({ error: 'Order not found' }, { status: 404 }))
    }
    if (orders.totalDocs > 1) {
      console.error('[verify-payment] Duplicate orders found for razorpayOrderId', {
        razorpayOrderId: body.razorpay_order_id,
        matches: orders.totalDocs,
      })
      return withCors(request, Response.json({ error: 'Order mapping conflict' }, { status: 409 }))
    }

    const order = orders.docs[0]
    const isValid = verifySignature(body.razorpay_order_id, body.razorpay_payment_id, body.razorpay_signature)

    const updatedOrder = await payload.update({
      collection: 'orders',
      id: order.id,
      data: isValid
        ? {
            status: 'paid',
            razorpayPaymentId: body.razorpay_payment_id,
            razorpaySignature: body.razorpay_signature,
          }
        : {
            status: 'failed',
            razorpayPaymentId: body.razorpay_payment_id,
            razorpaySignature: body.razorpay_signature,
          },
      overrideAccess: true,
    })

    console.info('[verify-payment] Verification completed', {
      orderId: String(order.id),
      razorpayOrderId: body.razorpay_order_id,
      status: updatedOrder.status,
      validSignature: isValid,
    })

    if (!isValid) {
      return withCors(request, Response.json({ error: 'Invalid signature' }, { status: 400 }))
    }

    return withCors(request, Response.json({ success: true, orderId: updatedOrder.id }))
  } catch (error) {
    console.error('[verify-payment] Failed to verify payment', {
      razorpayOrderId: body.razorpay_order_id,
      error: error instanceof Error ? error.message : 'unknown',
    })
    return withCors(request, Response.json({ error: 'Failed to update order' }, { status: 500 }))
  }
}
