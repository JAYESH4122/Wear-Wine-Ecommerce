import { getPayload } from 'payload'

import { rejectDisallowedOrigin, withCors } from '@/lib/server/cors'
import {
  finalizeCapturedPayment,
  findPaymentAttempt,
  isCapturedPayment,
  paymentMatchesAttempt,
  recordPaymentState,
} from '@/lib/server/payment-attempts'
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit'
import { fetchRazorpayPayment, getRazorpayClient } from '@/lib/server/razorpay'
import configPromise from '@/payload.config'

export const OPTIONS = async (request: Request) =>
  withCors(request, new Response(null, { status: 204 }))

export const POST = async (request: Request): Promise<Response> => {
  const originRejection = rejectDisallowedOrigin(request)
  if (originRejection) return originRejection

  const rate = await checkRateLimit({
    key: `payment-status:${getClientIp(request)}`,
    limit: 60,
    windowMs: 15 * 60 * 1000,
  })
  if (rate.limited) {
    return withCors(request, Response.json({ error: 'Too many requests' }, { status: 429 }))
  }

  const body = (await request.json().catch(() => null)) as { attemptId?: unknown } | null
  if (!body || typeof body.attemptId !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.attemptId)) {
    return withCors(request, Response.json({ error: 'Invalid payment reference' }, { status: 400 }))
  }

  const payload = await getPayload({ config: configPromise })
  let attempt = await findPaymentAttempt(payload, body.attemptId)
  if (!attempt) {
    return withCors(request, Response.json({ error: 'Payment reference not found' }, { status: 404 }))
  }

  if (attempt.status === 'captured' && attempt.order) {
    const orderReference = typeof attempt.order === 'object' ? attempt.order.id : attempt.order
    const order = await payload.findByID({
      collection: 'orders',
      id: orderReference,
      depth: 0,
      overrideAccess: true,
    })
    return withCors(
      request,
      Response.json({ state: 'captured', orderId: order.orderId }),
    )
  }
  if (attempt.status === 'failed' || attempt.status === 'expired') {
    return withCors(request, Response.json({ state: 'failed' }))
  }
  if (attempt.status === 'refund_required' || attempt.status === 'refunded') {
    return withCors(request, Response.json({ state: attempt.status }))
  }

  if (attempt.razorpayPaymentId) {
    try {
      const razorpay = getRazorpayClient()
      if (!razorpay) throw new Error('Payments disabled')
      const payment = await fetchRazorpayPayment(razorpay, attempt.razorpayPaymentId)
      if (!paymentMatchesAttempt(payment, attempt)) {
        return withCors(request, Response.json({ error: 'Payment details mismatch' }, { status: 409 }))
      }
      if (isCapturedPayment(payment)) {
        const result = await finalizeCapturedPayment({
          payload,
          attemptId: attempt.attemptId,
          paymentId: payment.id,
        })
        return withCors(
          request,
          Response.json(
            result.state === 'captured'
              ? { state: 'captured', orderId: result.orderId }
              : { state: 'refund_required' },
          ),
        )
      }
      if (payment.status === 'failed') {
        await recordPaymentState({
          payload,
          attempt,
          status: 'failed',
          paymentId: payment.id,
          failureReason: 'Razorpay reported a failed payment',
        })
        return withCors(request, Response.json({ state: 'failed' }))
      }
      attempt = {
        ...attempt,
        status: payment.status === 'authorized' ? 'authorized' : 'pending',
      }
    } catch (error) {
      console.error('[payment-status] Razorpay reconciliation failed', {
        attemptId: attempt.attemptId,
        error: error instanceof Error ? error.message : 'unknown',
      })
    }
  }

  return withCors(request, Response.json({ state: 'processing' }))
}
