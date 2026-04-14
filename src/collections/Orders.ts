import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/ownerOrAdmin'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'phone', 'total', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => {
      // Admin can read all
      if (user) {
        const isAdmin = Array.isArray((user as { roles?: unknown }).roles)
          && ((user as { roles?: string[] }).roles?.includes('admin') ?? false)

        if (isAdmin) return true

        // User can read their own orders
        return {
          user: {
            equals: user.id,
          },
        }
      }

      // Guest access control:
      // We do NOT allow public read access to the orders collection via REST API.
      // The tracking page will use the Local API with overrideAccess: true
      // ONLY after verifying both email and orderId.
      return false
    },
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'orderId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      index: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      index: true,
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
        {
          name: 'fullName',
          type: 'text',
          required: true,
        },
        {
          name: 'addressLine1',
          type: 'text',
          required: true,
        },
        {
          name: 'addressLine2',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'state',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
          defaultValue: 'India',
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
        },
        {
          name: 'landmark',
          type: 'text',
        },
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
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
      ],
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'placed',
      options: [
        { label: 'Placed', value: 'placed' },
        { label: 'Packed', value: 'packed' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Out for Delivery', value: 'out_for_delivery' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'courier',
      type: 'select',
      defaultValue: 'dtdc',
      options: [
        { label: 'DTDC', value: 'dtdc' },
      ],
    },
    {
      name: 'awbNumber',
      type: 'text',
    },
    {
      name: 'trackingUrl',
      type: 'text',
    },
    {
      name: 'razorpayOrderId',
      type: 'text',
      admin: {
        readOnly: true,
      },
      index: true,
    },
    {
      name: 'razorpayPaymentId',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'razorpaySignature',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
