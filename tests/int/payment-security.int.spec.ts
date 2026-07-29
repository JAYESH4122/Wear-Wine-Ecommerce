import crypto from 'crypto'
import type { Payload } from 'payload'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  adminOnly,
  ownerOrAdminByID,
  ownerOrAdminCreateByUserField,
} from '@/access/ownerOrAdmin'
import {
  buildPaymentSnapshot,
  InvalidCartError,
  isCapturedPayment,
  paymentMatchesAttempt,
  shouldTransitionPaymentStatus,
  type PaymentAttemptRecord,
} from '@/lib/server/payment-attempts'
import {
  arePaymentsEnabled,
  constantTimeHexEqual,
  getPaymentRuntimeConfig,
  verifyPaymentSignature,
} from '@/lib/server/razorpay'
import { inspectLiveBusinessContent } from '@/lib/server/live-readiness'

const accessArgs = (user: unknown, data?: Record<string, unknown>) =>
  ({ req: { user }, data }) as never

const attempt = {
  attemptId: '00000000-0000-4000-8000-000000000000',
  razorpayOrderId: 'order_expected',
  amountPaise: 25_000,
  currency: 'INR',
} as PaymentAttemptRecord

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('payment trust boundary', () => {
  it('keeps payments disabled unless explicitly enabled', () => {
    vi.stubEnv('PAYMENTS_ENABLED', 'false')
    expect(arePaymentsEnabled()).toBe(false)
    expect(getPaymentRuntimeConfig().enabled).toBe(false)

    vi.stubEnv('PAYMENTS_ENABLED', 'true')
    expect(arePaymentsEnabled()).toBe(true)
  })

  it('rejects Razorpay payment details that are not bound to the stored attempt', () => {
    expect(
      paymentMatchesAttempt(
        { order_id: 'order_other', amount: 25_000, currency: 'INR' },
        attempt,
      ),
    ).toBe(false)
    expect(
      paymentMatchesAttempt(
        { order_id: 'order_expected', amount: 100, currency: 'INR' },
        attempt,
      ),
    ).toBe(false)
    expect(
      paymentMatchesAttempt(
        { order_id: 'order_expected', amount: 25_000, currency: 'USD' },
        attempt,
      ),
    ).toBe(false)
  })

  it('requires both captured status and the captured flag', () => {
    expect(isCapturedPayment({ status: 'authorized', captured: false })).toBe(false)
    expect(isCapturedPayment({ status: 'captured', captured: false })).toBe(false)
    expect(isCapturedPayment({ status: 'captured', captured: true })).toBe(true)
  })

  it('rejects forged signatures and compares equal digests safely', () => {
    vi.stubEnv('PAYMENTS_ENABLED', 'true')
    vi.stubEnv('RAZORPAY_MODE', 'test')
    vi.stubEnv('RAZORPAY_KEY_ID', 'rzp_test_example')
    vi.stubEnv('NEXT_PUBLIC_RAZORPAY_KEY_ID', 'rzp_test_example')
    vi.stubEnv('RAZORPAY_KEY_SECRET', 'test-secret')
    vi.stubEnv('RAZORPAY_WEBHOOK_SECRET', 'w'.repeat(32))
    vi.stubEnv('VERCEL_ENV', 'preview')

    const expected = crypto
      .createHmac('sha256', 'test-secret')
      .update('order_expected|pay_expected')
      .digest('hex')

    expect(
      verifyPaymentSignature({
        orderId: 'order_expected',
        paymentId: 'pay_expected',
        signature: expected,
      }),
    ).toBe(true)
    expect(
      verifyPaymentSignature({
        orderId: 'order_expected',
        paymentId: 'pay_expected',
        signature: '0'.repeat(64),
      }),
    ).toBe(false)
    expect(constantTimeHexEqual('aa', 'aaaa')).toBe(false)
  })

  it('rejects live keys outside production and test keys in production', () => {
    vi.stubEnv('PAYMENTS_ENABLED', 'true')
    vi.stubEnv('RAZORPAY_KEY_SECRET', 'secret')
    vi.stubEnv('RAZORPAY_WEBHOOK_SECRET', 'w'.repeat(32))

    vi.stubEnv('VERCEL_ENV', 'preview')
    vi.stubEnv('RAZORPAY_MODE', 'live')
    vi.stubEnv('RAZORPAY_KEY_ID', 'rzp_live_example')
    vi.stubEnv('NEXT_PUBLIC_RAZORPAY_KEY_ID', 'rzp_live_example')
    expect(() => getPaymentRuntimeConfig()).toThrow(/outside production/)

    vi.stubEnv('VERCEL_ENV', 'production')
    vi.stubEnv('RAZORPAY_MODE', 'test')
    vi.stubEnv('RAZORPAY_KEY_ID', 'rzp_test_example')
    vi.stubEnv('NEXT_PUBLIC_RAZORPAY_KEY_ID', 'rzp_test_example')
    expect(() => getPaymentRuntimeConfig()).toThrow(/forbidden/)
  })

  it('refuses to enable checkout without a durable webhook secret', () => {
    vi.stubEnv('PAYMENTS_ENABLED', 'true')
    vi.stubEnv('RAZORPAY_MODE', 'test')
    vi.stubEnv('RAZORPAY_KEY_ID', 'rzp_test_example')
    vi.stubEnv('NEXT_PUBLIC_RAZORPAY_KEY_ID', 'rzp_test_example')
    vi.stubEnv('RAZORPAY_KEY_SECRET', 'test-secret')
    vi.stubEnv('RAZORPAY_WEBHOOK_SECRET', 'too-short')
    vi.stubEnv('VERCEL_ENV', 'preview')

    expect(() => getPaymentRuntimeConfig()).toThrow(/at least 32 bytes/)
  })

  it('does not let delayed failure events regress captured or refunded payments', () => {
    expect(shouldTransitionPaymentStatus('captured', 'failed')).toBe(false)
    expect(shouldTransitionPaymentStatus('captured', 'refund_required')).toBe(true)
    expect(shouldTransitionPaymentStatus('refund_required', 'refunded')).toBe(true)
    expect(shouldTransitionPaymentStatus('refunded', 'refund_required')).toBe(false)
  })

  it('prices and snapshots the exact selected variant from server data', async () => {
    const payload = {
      find: vi.fn().mockResolvedValue({
        docs: [
          {
            id: 7,
            name: 'Server-priced shirt',
            price: 999,
            salePrice: 250,
            variants: [
              {
                id: 'variant-7-blue-m',
                size: { id: 2 },
                color: { id: 3 },
                stock: 4,
              },
            ],
          },
        ],
      }),
    } as unknown as Payload

    const snapshot = await buildPaymentSnapshot(payload, [
      {
        productId: 7,
        size: 2,
        color: 3,
        quantity: 2,
        total: 1,
        userId: 999,
      },
    ])

    expect(snapshot.amountPaise).toBe(50_000)
    expect(snapshot.items[0]).toMatchObject({
      product: 7,
      size: 2,
      color: 3,
      variantId: 'variant-7-blue-m',
      quantity: 2,
      unitPricePaise: 25_000,
    })
    expect(snapshot.items[0]).not.toHaveProperty('userId')
  })

  it('does not overcharge when a malformed sale price exceeds the base price', async () => {
    const payload = {
      find: vi.fn().mockResolvedValue({
        docs: [
          {
            id: 7,
            name: 'Mispriced sale shirt',
            price: 699,
            salePrice: 999,
            variants: [
              {
                id: 'variant-7-blue-m',
                size: { id: 2 },
                color: { id: 3 },
                stock: 4,
              },
            ],
          },
        ],
      }),
    } as unknown as Payload

    const snapshot = await buildPaymentSnapshot(payload, [
      { productId: 7, size: 2, color: 3, quantity: 1 },
    ])

    expect(snapshot.amountPaise).toBe(69_900)
    expect(snapshot.items[0]?.unitPricePaise).toBe(69_900)
  })

  it('rejects omitted variants, fractional quantities, and insufficient stock', async () => {
    const payload = {
      find: vi.fn().mockResolvedValue({
        docs: [
          {
            id: 7,
            name: 'Variant shirt',
            price: 250,
            variants: [
              {
                id: 'variant-7-blue-m',
                size: { id: 2 },
                color: { id: 3 },
                stock: 1,
              },
            ],
          },
        ],
      }),
    } as unknown as Payload

    await expect(
      buildPaymentSnapshot(payload, [{ productId: 7, quantity: 1 }]),
    ).rejects.toBeInstanceOf(InvalidCartError)
    await expect(
      buildPaymentSnapshot(payload, [
        { productId: 7, size: 2, color: 3, quantity: 1.5 },
      ]),
    ).rejects.toBeInstanceOf(InvalidCartError)
    await expect(
      buildPaymentSnapshot(payload, [
        { productId: 7, size: 2, color: 3, quantity: 2 },
      ]),
    ).rejects.toThrow(/Insufficient stock/)
  })
})

describe('Payload access controls', () => {
  it('denies anonymous user access and allows customers to read only themselves', () => {
    expect(ownerOrAdminByID(accessArgs(null))).toBe(false)
    expect(ownerOrAdminByID(accessArgs({ id: 42, roles: ['user'] }))).toEqual({
      id: { equals: 42 },
    })
    expect(ownerOrAdminByID(accessArgs({ id: 1, roles: ['admin'] }))).toBe(true)
  })

  it('permits customer-owned collection creation but blocks another user ID', () => {
    const customer = { id: 42, roles: ['user'] }
    expect(ownerOrAdminCreateByUserField(accessArgs(customer, { user: 42 }))).toBe(true)
    expect(ownerOrAdminCreateByUserField(accessArgs(customer, { user: 99 }))).toBe(false)
  })

  it('limits direct catalog and order mutations to admins', () => {
    expect(adminOnly(accessArgs({ id: 42, roles: ['user'] }))).toBe(false)
    expect(adminOnly(accessArgs({ id: 1, roles: ['admin'] }))).toBe(true)
  })
})

describe('live business readiness', () => {
  it('blocks known placeholder content and accepts reviewed contact and policies', () => {
    const placeholderIssues = inspectLiveBusinessContent({
      administratorCount: 1,
      footer: {
        contact: { email: 'hello@wearwine.com', phone: '+1 (555) 123-4567' },
      },
      policies: [
        { slug: 'privacy-policy', sections: [] },
        { slug: 'terms', sections: [] },
        {
          slug: 'shipping',
          sections: [
            {
              content:
                'Free standard shipping on all orders over ₹100. Refund and cancellation terms apply.',
            },
          ],
        },
      ],
    })
    expect(placeholderIssues.some((issue) => issue.includes('555'))).toBe(true)
    expect(placeholderIssues.some((issue) => issue.includes('free standard shipping'))).toBe(true)

    expect(
      inspectLiveBusinessContent({
        administratorCount: 1,
        footer: {
          contact: { email: 'support@merchant.example', phone: '+91 98765 43210' },
        },
        policies: [
          { slug: 'privacy-policy', sections: [{ content: 'Privacy terms.' }] },
          { slug: 'terms', sections: [{ content: 'Cancellation terms.' }] },
          { slug: 'shipping', sections: [{ content: 'Shipping and refund terms.' }] },
        ],
      }),
    ).toEqual([])
  })
})
