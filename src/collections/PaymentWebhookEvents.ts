import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/ownerOrAdmin'

export const PaymentWebhookEvents: CollectionConfig = {
  slug: 'payment-webhook-events',
  admin: {
    hidden: true,
    useAsTitle: 'eventId',
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: adminOnly,
    update: adminOnly,
  },
  fields: [
    {
      name: 'eventId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'eventName',
      type: 'text',
      required: true,
    },
    {
      name: 'razorpayOrderId',
      type: 'text',
      index: true,
    },
    {
      name: 'paymentAttempt',
      type: 'relationship',
      relationTo: 'payment-attempts',
      index: true,
    },
    {
      name: 'processedAt',
      type: 'date',
      required: true,
    },
  ],
  timestamps: true,
}
