import { getPayloadClient } from '@/lib/payload-client'
import type { Product } from '@/payload-types'

const productDetailSelect = {
  name: true,
  slug: true,
  description: true,
  category: true,
  images: true,
  price: true,
  salePrice: true,
  variants: true,
} as const

const relatedProductSelect = {
  name: true,
  slug: true,
  category: true,
  images: true,
  price: true,
  salePrice: true,
  variants: true,
} as const

const productPopulate = {
  categories: {
    name: true,
    slug: true,
  },
  colors: {
    name: true,
    hex: true,
  },
  media: {
    alt: true,
    url: true,
    sizes: true,
  },
  sizes: {
    label: true,
  },
} as const

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const payload = await getPayloadClient()
    const data = await payload.find({
      collection: 'products',
      where: {
        slug: {
          equals: slug,
        },
      },
      // All PDP relationships are direct. A depth of one prevents Payload from
      // loading unrelated nested records for every product visit.
      depth: 1,
      limit: 1,
      pagination: false,
      select: productDetailSelect,
      populate: productPopulate,
    })
    return (data?.docs?.[0] as Product | undefined) ?? null
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error)
    return null
  }
}

export async function getRelatedProducts({
  categoryId,
  slug,
  limit = 4,
}: {
  categoryId: number | string
  slug: string
  limit?: number
}): Promise<Product[]> {
  try {
    const payload = await getPayloadClient()
    const data = await payload.find({
      collection: 'products',
      where: {
        and: [
          {
            category: {
              equals: categoryId,
            },
          },
          {
            slug: {
              not_equals: slug,
            },
          },
        ],
      },
      depth: 1,
      limit,
      pagination: false,
      select: relatedProductSelect,
      populate: productPopulate,
    })
    return (data?.docs as Product[]) ?? []
  } catch (error) {
    console.error('Error fetching related products:', error)
    return []
  }
}
