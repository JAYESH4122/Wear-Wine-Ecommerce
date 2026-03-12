import type { CollectionConfig } from 'payload'

export const Sizes: CollectionConfig = {
  slug: 'sizes',

  admin: {
    useAsTitle: 'label',
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