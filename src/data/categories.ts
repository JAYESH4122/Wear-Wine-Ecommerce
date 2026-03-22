import { Category } from '../types'

import { seedCategories } from '@/seed/data'

export const categories: Category[] = seedCategories

export const getCategoryBySlug = (slug: string) => categories.find((c) => c.slug === slug)
export const getCategoryById = (id: string) => categories.find((c) => c.id === id)
