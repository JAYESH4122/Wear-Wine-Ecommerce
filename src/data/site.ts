import type { Metadata } from 'next'

// Toggle point for future CMS re-integration.
export const USE_DUMMY_DATA = true as const

export const rootLayoutMetadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
} satisfies Metadata

export const cartPageMetadata = {
  title: 'Your Cart | Wear Wine',
  description: 'View and manage items in your shopping cart.',
} satisfies Metadata
