import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/ownerOrAdmin'
import { generateSlug } from './lib'

export const Tags: CollectionConfig = {
  slug: 'tags',

  admin: {
    useAsTitle: 'name',
  },

  access: {
    create: adminOnly,
    delete: adminOnly,
    read: () => true,
    update: adminOnly,
  },

  hooks: {
    beforeValidate: [generateSlug('name')],
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}
