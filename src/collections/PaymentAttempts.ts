import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/ownerOrAdmin'

export const PaymentAttempts: CollectionConfig = {
  slug: 'payment-attempts',
  admin: {
    hidden: true,
    useAsTitle: 'attemptId',
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: adminOnly,
    update: adminOnly,
  },
  fields: [
    {
      name: 'attemptId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      index: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'fullName', type: 'text', required: true },
        { name: 'addressLine1', type: 'text', required: true },
        { name: 'addressLine2', type: 'text' },
        { name: 'city', type: 'text', required: true },
        { name: 'state', type: 'text', required: true },
        { name: 'country', type: 'text', required: true, defaultValue: 'India' },
        { name: 'postalCode', type: 'text', required: true },
        { name: 'landmark', type: 'text' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'size',
          type: 'relationship',
          relationTo: 'sizes',
        },
        {
          name: 'color',
          type: 'relationship',
          relationTo: 'colors',
        },
        {
          name: 'variantKey',
          type: 'text',
          required: true,
        },
        {
          name: 'variantId',
          type: 'text',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'unitPricePaise',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'lineTotalPaise',
          type: 'number',
          required: true,
          min: 0,
        },
      ],
    },
    {
      name: 'amountPaise',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'currency',
      type: 'select',
      required: true,
      defaultValue: 'INR',
      options: [{ label: 'Indian Rupee', value: 'INR' }],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'creating',
      index: true,
      options: [
        { label: 'Creating', value: 'creating' },
        { label: 'Pending', value: 'pending' },
        { label: 'Authorized', value: 'authorized' },
        { label: 'Captured', value: 'captured' },
        { label: 'Failed', value: 'failed' },
        { label: 'Expired', value: 'expired' },
        { label: 'Refund required', value: 'refund_required' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'razorpayOrderId',
      type: 'text',
      unique: true,
      index: true,
    },
    {
      name: 'razorpayPaymentId',
      type: 'text',
      unique: true,
      index: true,
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      unique: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      index: true,
    },
    {
      name: 'processedAt',
      type: 'date',
    },
    {
      name: 'failureReason',
      type: 'text',
    },
    {
      name: 'refundId',
      type: 'text',
      index: true,
    },
  ],
  timestamps: true,
}
