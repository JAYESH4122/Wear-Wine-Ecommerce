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

  const event = JSON.parse(body)
  const payload = await getPayload({ config: configPromise })

  if (event.event === 'order.paid' || event.event === 'payment.captured' || event.event === 'payment.failed') {
    const razorpayOrderId = event.payload.order?.entity?.id || event.payload.payment?.entity?.order_id
    const status = (event.event === 'order.paid' || event.event === 'payment.captured') ? 'paid' : 'failed'

    if (razorpayOrderId) {
      // Find orders with this razorpayOrderId
      const orders = await payload.find({
        collection: 'orders',
        where: {
          razorpayOrderId: {
            equals: razorpayOrderId,
          },
        },
        overrideAccess: true,
      })

      if (orders.docs.length > 0) {
        const order = orders.docs[0]

        // Idempotency: Only update if status is changing
        if (order.status !== status) {
          const updateData: Partial<Order> = { status }
          
          if (status === 'paid') {
            updateData.razorpayPaymentId = event.payload.payment?.entity?.id || order.razorpayPaymentId
            updateData.razorpaySignature = event.payload.payment?.entity?.signature || order.razorpaySignature
          }

          await payload.update({
            collection: 'orders',
            id: order.id,
            data: updateData,
            overrideAccess: true,
          })
        }
      }
    }
  }

  return Response.json({ received: true })
}
