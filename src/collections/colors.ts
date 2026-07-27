import type { CollectionConfig } from 'payload'

export const Colors: CollectionConfig = {
  slug: 'colors',

  admin: {
    useAsTitle: 'name',
  },

  access: {
    read: () => true,
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