import type { CollectionConfig } from 'payload'
import { generateSlug } from './lib'

export const Tags: CollectionConfig = {
  slug: 'tags',

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
    },
  ],
}