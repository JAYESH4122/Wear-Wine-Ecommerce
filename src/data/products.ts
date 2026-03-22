import { Product } from '../types'
import { categories } from './categories'
import { seedColors, seedProducts, seedProductDescription, seedSizes } from '@/seed/data'

const toSlug = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const colorById = new Map(seedColors.map((c) => [c.id, c] as const))
const sizeById = new Map(seedSizes.map((s) => [s.id, s] as const))
const categoryById = new Map(categories.map((c) => [c.id, c] as const))

export const products: Product[] = seedProducts.map((p) => {
  const category = categoryById.get(p.categoryId) ?? categories[0]
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    description: seedProductDescription(p.name),
    category,
    slug: toSlug(p.name),
    images: [{ url: p.imageUrl, alt: p.name }],
    variants: p.variants.map((v) => ({
      color: colorById.get(v.colorId) ?? seedColors[0],
      size: sizeById.get(v.sizeId) ?? seedSizes[0],
      sku: v.sku,
      stock: v.stock,
    })),
  }
})

export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug)
