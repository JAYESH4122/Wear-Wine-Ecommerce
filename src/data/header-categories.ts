import type { CategoryNavItem } from '@/types'
import { categories } from '@/data/categories'
import { products } from '@/data/products'

export const headerCategoryItems: CategoryNavItem[] = categories.map((category) => ({
  name: category.name,
  href: `/category/${category.slug}`,
  count: products.filter((p) => p.category.slug === category.slug).length,
}))

