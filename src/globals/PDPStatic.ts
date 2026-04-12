import { GlobalConfig } from 'payload'

export const PDPStatic: GlobalConfig = {
  slug: 'pdp-static',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'shipping',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
      ],
    },
    {
      name: 'returns',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
      ],
    },
    {
      name: 'trustBadges',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'description', type: 'text' },
      ],
    },
    {
      name: 'sizeGuide',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'sizeChart',
      type: 'group',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'addToCart', type: 'text', required: true },
        { name: 'buyNow', type: 'text', required: true },
        { name: 'addedToCart', type: 'text', required: true },
        { name: 'alreadyInCart', type: 'text', required: true },
        { name: 'outOfStock', type: 'text', required: true },
      ],
    },
    {
      name: 'accordions',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'content', type: 'textarea', required: true },
      ],
    },
  ],
}
