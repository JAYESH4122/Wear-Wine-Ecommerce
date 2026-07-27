import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/ownerOrAdmin'

export const Sizes: CollectionConfig = {
  slug: 'sizes',

  admin: {
    useAsTitle: 'label',
  },

  access: {
    create: adminOnly,
    delete: adminOnly,
    read: () => true,
    update: adminOnly,
  },

  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },

    {
      name: 'value',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}
