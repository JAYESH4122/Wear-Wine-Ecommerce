import { getPayload } from 'payload'

import {
  finalizeCapturedPayment,
  isCapturedPayment,
  paymentMatchesAttempt,
  type PaymentAttemptRecord,
  recordPaymentState,
} from '@/lib/server/payment-attempts'
import { verifyWebhookSignature } from '@/lib/server/razorpay'
import configPromise from '@/payload.config'

type RazorpayEntity = Record<string, unknown>

const getEntity = (event: Record<string, unknown>, name: 'payment' | 'refund') => {
  const payload = event.payload
  if (!payload || typeof payload !== 'object') return null
  const wrapper = (payload as Record<string, unknown>)[name]
  if (!wrapper || typeof wrapper !== 'object') return null
  const entity = (wrapper as Record<string, unknown>).entity
  return entity && typeof entity === 'object' ? (entity as RazorpayEntity) : null
}

const findAttemptByField = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  field: 'razorpayOrderId' | 'razorpayPaymentId',
  value: string,
) => {
  const result = await payload.find({
    collection: 'payment-attempts',
    where: { [field]: { equals: value } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return (result.docs[0] as unknown as PaymentAttemptRecord | undefined) ?? null
}

const eventAlreadyProcessed = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  eventId: string,
) => {
  const existing = await payload.find({
    collection: 'payment-webhook-events',
    where: { eventId: { equals: eventId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return existing.totalDocs > 0
}

export const POST = async (request: Request): Promise<Response> => {
  const signature = request.headers.get('x-razorpay-signature')
  const eventId = request.headers.get('x-razorpay-event-id')?.trim()
  if (!signature || !/^[a-f0-9]{64}$/i.test(signature) || !eventId || eventId.length > 200) {
    return Response.json({ error: 'Invalid webhook headers' }, { status: 400 })
  }

  const rawBody = await request.text()
  if (Buffer.byteLength(rawBody, 'utf8') > 1_000_000) {
    return Response.json({ error: 'Webhook payload is too large' }, { status: 413 })
  }

  try {
    if (!verifyWebhookSignature(rawBody, signature)) {
      return Response.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }
  } catch (error) {
    console.error('[razorpay-webhook] Webhook secret is not safely configured', {
      error: error instanceof Error ? error.message : 'unknown',
    })
    return Response.json({ error: 'Webhook unavailable' }, { status: 503 })
  }

  let event: Record<string, unknown>
  try {
    event = JSON.parse(rawBody) as Record<string, unknown>
  } catch {
    return Response.json({ error: 'Invalid webhook JSON' }, { status: 400 })
  }

  const eventName = typeof event.event === 'string' ? event.event : ''
  const handledEvents = new Set([
    'payment.captured',
    'payment.failed',
    'refund.processed',
    'refund.failed',
  ])
  if (!handledEvents.has(eventName)) return Response.json({ received: true })

  const payload = await getPayload({ config: configPromise })
  if (await eventAlreadyProcessed(payload, eventId)) {
    return Response.json({ received: true, duplicate: true })
  }

  try {
    if (eventName === 'payment.captured' || eventName === 'payment.failed') {
      const payment = getEntity(event, 'payment')
      const orderId = typeof payment?.order_id === 'string' ? payment.order_id : ''
      const paymentId = typeof payment?.id === 'string' ? payment.id : ''
      if (!orderId || !paymentId) {
        return Response.json({ error: 'Malformed payment event' }, { status: 400 })
      }

      const attempt = await findAttemptByField(payload, 'razorpayOrderId', orderId)
      if (!attempt) {
        console.error('[razorpay-webhook] Payment attempt not found', { eventId, orderId })
        return Response.json({ error: 'Payment attempt not found' }, { status: 500 })
      }
      if (!paymentMatchesAttempt(payment ?? {}, attempt)) {
        return Response.json({ error: 'Payment details mismatch' }, { status: 400 })
      }

      if (eventName === 'payment.captured') {
        if (!isCapturedPayment(payment ?? {})) {
          return Response.json({ error: 'Payment is not captured' }, { status: 400 })
        }
        await finalizeCapturedPayment({
          payload,
          attemptId: attempt.attemptId,
          paymentId,
          event: { id: eventId, name: eventName },
        })
      } else {
        await recordPaymentState({
          payload,
          attempt,
          status: 'failed',
          paymentId,
          failureReason: 'Razorpay reported a failed payment',
          event: { id: eventId, name: eventName },
        })
      }
    } else {
      const refund = getEntity(event, 'refund')
      const paymentId = typeof refund?.payment_id === 'string' ? refund.payment_id : ''
      const refundId = typeof refund?.id === 'string' ? refund.id : ''
      if (!paymentId || !refundId) {
        return Response.json({ error: 'Malformed refund event' }, { status: 400 })
      }

      const attempt = await findAttemptByField(payload, 'razorpayPaymentId', paymentId)
      if (!attempt) {
        console.error('[razorpay-webhook] Refund payment attempt not found', {
          eventId,
          paymentId,
        })
        return Response.json({ error: 'Payment attempt not found' }, { status: 500 })
      }

      await recordPaymentState({
        payload,
        attempt,
        status: eventName === 'refund.processed' ? 'refunded' : 'refund_required',
        paymentId,
        refundId,
        failureReason:
          eventName === 'refund.failed' ? 'Razorpay reported a failed refund' : undefined,
        event: { id: eventId, name: eventName },
      })
    }

    return Response.json({ received: true })
  } catch (error) {
    if (await eventAlreadyProcessed(payload, eventId).catch(() => false)) {
      return Response.json({ received: true, duplicate: true })
    }
    console.error('[razorpay-webhook] Durable processing failed', {
      eventId,
      eventName,
      error: error instanceof Error ? error.message : 'unknown',
    })
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
