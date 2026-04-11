import type { CollectionConfig } from 'payload'

import { ownerOrAdminByUserField } from '@/access/ownerOrAdmin'

export const Carts: CollectionConfig = {
  slug: 'carts',
  admin: {
    useAsTitle: 'user',
    defaultColumns: ['user', 'updatedAt'],
  },
  access: {
    create: ownerOrAdminByUserField,
    read: ownerOrAdminByUserField,
    update: ownerOrAdminByUserField,
    delete: ownerOrAdminByUserField,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'productId',
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
      defaultValue: [],
    },
    {
      name: 'lastMergedGuestHash',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
  ],
  timestamps: true,
}
