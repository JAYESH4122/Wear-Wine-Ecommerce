import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/ownerOrAdmin'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: () => true,
    update: adminOnly,
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
  upload: {
    // Product cards and PDPs only need a few predictable image widths. Generating
    // them at upload time avoids making the browser resize the original asset for
    // every new viewport and device pixel ratio.
    imageSizes: [
      {
        name: 'card',
        width: 720,
        height: 960,
        fit: 'cover',
      },
      {
        name: 'pdp',
        width: 1600,
        height: 2134,
        fit: 'inside',
        withoutEnlargement: true,
      },
    ],
    adminThumbnail: 'card',
    modifyResponseHeaders: ({ headers }) => {
      // Images are content assets, so they can be safely reused by the browser
      // and CDN between PDP visits. A short browser TTL still lets merchandising
      // changes reach customers without requiring a hard refresh.
      headers.set('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400')
      return headers
    },
  },
}
