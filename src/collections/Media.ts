import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Hero', value: 'hero' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'Product', value: 'product' },
      ],
      defaultValue: 'product',
      required: true,
    },
  ],
  upload: true,
}
