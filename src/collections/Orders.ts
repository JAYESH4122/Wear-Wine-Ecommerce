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

      // Guest access control could be handled by a query param or token in a real scenario,
      // but here we might want to restrict guest read access via API if not authenticated.
      // However, for the 'orders' page to show something for guests, they usually need to provide an email.
      // For now, let's keep it restricted to authenticated users or admins for list view.
      // If we need guests to view a specific order, they'll likely use a public 'success' page with order ID.
      return false
    },
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
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
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Processing',
          value: 'processing',
        },
        {
          label: 'Paid',
          value: 'paid',
        },
        {
          label: 'Delivered',
          value: 'delivered',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
      ],
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
