import type { CollectionConfig } from 'payload'

import { ownerOrAdminByUserField } from '@/access/ownerOrAdmin'

export const Wishlists: CollectionConfig = {
  slug: 'wishlists',
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
      name: 'products',
      type: 'array',
      fields: [
        {
          name: 'productId',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
      ],
      defaultValue: [],
    },
  ],
  timestamps: true,
}
