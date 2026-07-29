import crypto from 'crypto'
import Razorpay from 'razorpay'

type RazorpayMode = 'test' | 'live'

type PaymentRuntimeConfig = {
  enabled: boolean
  keyId: string
  keySecret: string
  mode: RazorpayMode
}

export type RazorpayFetchedPayment = {
  id: string
  order_id: string
  amount: number | string
  currency: string
  status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed'
  captured: boolean
}

const isProductionRuntime = () => {
  if (process.env.VERCEL_ENV) return process.env.VERCEL_ENV === 'production'
  return process.env.NODE_ENV === 'production'
}

export const arePaymentsEnabled = () => process.env.PAYMENTS_ENABLED === 'true'

export const getPaymentRuntimeConfig = (): PaymentRuntimeConfig => {
  const enabled = arePaymentsEnabled()
  const mode = process.env.RAZORPAY_MODE
  const keyId = process.env.RAZORPAY_KEY_ID?.trim() ?? ''
  const publicKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() ?? ''
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim() ?? ''
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim() ?? ''

  if (!enabled) {
    return {
      enabled: false,
      keyId,
      keySecret,
      mode: mode === 'live' ? 'live' : 'test',
    }
  }

  if (mode !== 'test' && mode !== 'live') {
    throw new Error('RAZORPAY_MODE must be either "test" or "live"')
  }
  if (!keyId || !keySecret || !publicKeyId) {
    throw new Error('Razorpay credentials are incomplete')
  }
  if (Buffer.byteLength(webhookSecret, 'utf8') < 32) {
    throw new Error('RAZORPAY_WEBHOOK_SECRET must contain at least 32 bytes')
  }
  if (keyId !== publicKeyId) {
    throw new Error('Server and browser Razorpay Key IDs must match')
  }

  const expectedPrefix = mode === 'live' ? 'rzp_live_' : 'rzp_test_'
  if (!keyId.startsWith(expectedPrefix)) {
    throw new Error(`Razorpay Key ID does not match ${mode} mode`)
  }
  if (mode === 'live' && !isProductionRuntime()) {
    throw new Error('Live Razorpay credentials are forbidden outside production')
  }
  if (mode === 'test' && isProductionRuntime()) {
    throw new Error('Test Razorpay credentials are forbidden when production payments are enabled')
  }

  return { enabled, keyId, keySecret, mode }
}

export const getRazorpayClient = () => {
  const runtime = getPaymentRuntimeConfig()
  if (!runtime.enabled) return null

  return new Razorpay({
    key_id: runtime.keyId,
    key_secret: runtime.keySecret,
  })
}

export const fetchRazorpayPayment = async (
  razorpay: Razorpay,
  paymentId: string,
): Promise<RazorpayFetchedPayment> => {
  // Razorpay's overload declarations intersect Promise and callback return
  // types. Isolate that SDK typing issue at this adapter boundary.
  return await (razorpay.payments.fetch(paymentId) as unknown as Promise<RazorpayFetchedPayment>)
}

export const constantTimeHexEqual = (received: string, expected: string) => {
  if (!/^[a-f0-9]+$/i.test(received) || !/^[a-f0-9]+$/i.test(expected)) return false

  const receivedBuffer = Buffer.from(received, 'hex')
  const expectedBuffer = Buffer.from(expected, 'hex')
  if (receivedBuffer.length !== expectedBuffer.length) return false

  return crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
}

export const verifyPaymentSignature = ({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string
  paymentId: string
  signature: string
}) => {
  const { keySecret } = getPaymentRuntimeConfig()
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')

  return constantTimeHexEqual(signature, expected)
}

export const verifyWebhookSignature = (rawBody: string, signature: string) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim()
  if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
    throw new Error('RAZORPAY_WEBHOOK_SECRET must contain at least 32 bytes')
  }

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  return constantTimeHexEqual(signature, expected)
}
