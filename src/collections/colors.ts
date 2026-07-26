import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/ownerOrAdmin'

export const Colors: CollectionConfig = {
  slug: 'colors',

  admin: {
    useAsTitle: 'name',
  },

  access: {
    create: adminOnly,
    delete: adminOnly,
    read: () => true,
    update: adminOnly,
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'hex',
      type: 'text',
      label: 'Hex Color',
    },
  ],
}
