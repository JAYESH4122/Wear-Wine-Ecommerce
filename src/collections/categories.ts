import type { CollectionConfig } from 'payload'
import { generateSlug } from './lib'

export const Categories: CollectionConfig = {
  slug: 'categories',

  admin: {
    useAsTitle: 'name',
  },

  access: {
    read: () => true,
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