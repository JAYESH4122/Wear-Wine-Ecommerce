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
    internal_order_id?: string
  } | null

  if (!body || !body.razorpay_order_id || !body.razorpay_payment_id || !body.razorpay_signature || !body.internal_order_id) {
    return withCors(request, Response.json({ error: 'Missing required fields' }, { status: 400 }))
  }

  const isValid = verifySignature(body.razorpay_order_id, body.razorpay_payment_id, body.razorpay_signature)

  const payload = await getPayload({ config: configPromise })

  // Find the order by razorpay_order_id instead of relying on internal_order_id
  const orders = await payload.find({
    collection: 'orders',
    where: {
      razorpayOrderId: {
        equals: body.razorpay_order_id,
      },
    },
    overrideAccess: true,
  })

  if (orders.docs.length === 0) {
    return withCors(request, Response.json({ error: 'Order not found' }, { status: 404 }))
  }

  const order = orders.docs[0]

  if (!isValid) {
    // Update order status to failed if signature is invalid
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        status: 'failed',
      },
      overrideAccess: true,
    })
    return withCors(request, Response.json({ error: 'Invalid signature' }, { status: 400 }))
  }

  try {
    // Update order to paid
    const updatedOrder = await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        status: 'paid',
        razorpayPaymentId: body.razorpay_payment_id,
        razorpaySignature: body.razorpay_signature,
      },
      overrideAccess: true,
    })

    return withCors(request, Response.json({ success: true, order: updatedOrder }))
  } catch (error) {
    console.error('Error updating order:', error)
    return withCors(request, Response.json({ error: 'Failed to update order' }, { status: 500 }))
  }
}
