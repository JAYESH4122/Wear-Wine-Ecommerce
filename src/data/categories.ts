import type { Category } from '@/payload-types'

const now = new Date().toISOString()

export const categoriesData: Category[] = [
  {
    id: 1,
    name: 'New Arrivals',
    slug: 'new-arrivals',
    updatedAt: now,
    createdAt: now,
  },
  {
    id: 2,
    name: 'Hoodies',
    slug: 'hoodies',
    updatedAt: now,
    createdAt: now,
  },
  {
    id: 3,
    name: 'T-Shirts',
    slug: 't-shirts',
    updatedAt: now,
    createdAt: now,
  },
  {
    id: 4,
    name: 'Accessories',
    slug: 'accessories',
    updatedAt: now,
    createdAt: now,
  },
]
