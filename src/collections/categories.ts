import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/ownerOrAdmin'
import { generateSlug } from './lib'

export const Categories: CollectionConfig = {
  slug: 'categories',

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
      index: true,
    },

    {
      name: 'description',
      type: 'textarea',
    },

    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
