import { getPayloadClient } from '@/lib/payload-client'
import type { Product } from '@/payload-types'

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
      depth: 2,
      limit: 1,
    })
    return data?.docs?.[0] ?? null
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
    })
    return (data?.docs as Product[]) ?? []
  } catch (error) {
    console.error('Error fetching related products:', error)
    return []
  }
}

