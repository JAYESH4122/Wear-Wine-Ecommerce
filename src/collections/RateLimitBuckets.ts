import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/ownerOrAdmin'

export const RateLimitBuckets: CollectionConfig = {
  slug: 'rate-limit-buckets',
  admin: {
    hidden: true,
    useAsTitle: 'key',
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: adminOnly,
    update: adminOnly,
  },
  fields: [
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'count',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'resetAt',
      type: 'date',
      required: true,
      index: true,
    },
  ],
  timestamps: false,
}
