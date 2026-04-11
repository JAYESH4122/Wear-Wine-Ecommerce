import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/ownerOrAdmin'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'total', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => {
      if (!user) return false

      const isAdmin = Array.isArray((user as { roles?: unknown }).roles)
        && ((user as { roles?: string[] }).roles?.includes('admin') ?? false)

      if (isAdmin) {
        return true
      }

      return {
        user: {
          equals: user.id,
        },
      }
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
          label: 'Delivered',
          value: 'delivered',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
    },
  ],
  timestamps: true,
}
