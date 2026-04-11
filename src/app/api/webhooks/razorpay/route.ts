import { getPayload } from 'payload'
import crypto from 'crypto'
import type { Order } from '@/payload-types'

import configPromise from '@/payload.config'

export const POST = async (request: Request): Promise<Response> => {
  const signature = request.headers.get('x-razorpay-signature')
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET

  if (!signature || !secret) {
    return Response.json({ error: 'Missing signature or secret' }, { status: 400 })
  }

  const body = await request.text()
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  if (signature !== expectedSignature) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let event: any
  try {
    event = JSON.parse(body)
  } catch {
    return Response.json({ error: 'Invalid webhook payload' }, { status: 400 })
  }

  const eventName = typeof event?.event === 'string' ? event.event : null
  const handledEvents = new Set(['order.paid', 'payment.captured', 'payment.failed'])
  if (!eventName || !handledEvents.has(eventName)) {
    return Response.json({ received: true })
  }

  const razorpayOrderId = event.payload?.order?.entity?.id ?? event.payload?.payment?.entity?.order_id ?? null
  if (!razorpayOrderId) {
    console.error('[razorpay-webhook] Missing razorpayOrderId', { event: eventName })
    return Response.json({ received: true })
  }

  const payload = await getPayload({ config: configPromise })
  const orders = await payload.find({
    collection: 'orders',
    where: {
      razorpayOrderId: {
        equals: razorpayOrderId,
      },
    },
    overrideAccess: true,
    limit: 2,
    depth: 0,
  })

  if (orders.docs.length === 0) {
    console.error('[razorpay-webhook] Order not found', {
      event: eventName,
      razorpayOrderId,
    })
    return Response.json({ received: true })
  }
  if (orders.totalDocs > 1) {
    console.error('[razorpay-webhook] Duplicate orders found for razorpayOrderId', {
      event: eventName,
      razorpayOrderId,
      matches: orders.totalDocs,
    })
    return Response.json({ received: true })
  }

  const order = orders.docs[0]

  if (eventName === 'order.paid' || eventName === 'payment.captured') {
    if (order.status === 'paid') {
      console.info('[razorpay-webhook] Already paid, skipping', {
        orderId: String(order.id),
        razorpayOrderId,
        event: eventName,
      })
      return Response.json({ received: true })
    }

    const updateData: Partial<Order> = {
      status: 'paid',
      razorpayPaymentId: event.payload?.payment?.entity?.id ?? order.razorpayPaymentId,
      razorpaySignature: order.razorpaySignature,
    }

    await payload.update({
      collection: 'orders',
      id: order.id,
      data: updateData,
      overrideAccess: true,
    })

    console.info('[razorpay-webhook] Marked order as paid', {
      orderId: String(order.id),
      razorpayOrderId,
      event: eventName,
    })
    return Response.json({ received: true })
  }

  if (eventName === 'payment.failed' && order.status !== 'paid') {
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        status: 'failed',
        razorpayPaymentId: event.payload?.payment?.entity?.id ?? order.razorpayPaymentId,
      },
      overrideAccess: true,
    })

    console.info('[razorpay-webhook] Marked order as failed', {
      orderId: String(order.id),
      razorpayOrderId,
    })
  }

  return Response.json({ received: true })
}
