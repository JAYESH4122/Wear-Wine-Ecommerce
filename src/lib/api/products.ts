import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { DATA_SOURCE } from '@/config/data-source'
import { productsData } from '@/data/products'

const emptyProductsResult = (limit: number) => ({
  docs: [],
  totalDocs: 0,
  limit,
  totalPages: 1,
  page: 1,
  pagingCounter: 1,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: null,
  nextPage: null,
})

export async function getProducts({ limit = 20, query = '' }: { limit?: number; query?: string } = {}) {
  if (DATA_SOURCE === 'local') {
    return {
      docs: productsData,
      totalDocs: productsData.length,
      limit,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    }
  }

  if (!process.env.PAYLOAD_SECRET) {
    return emptyProductsResult(limit)
  }
  const payload = await getPayload({ config: configPromise })

  const where: any = {}
  if (query) {
    where.or = [{ name: { contains: query } }, { description: { contains: query } }]
  }

  const result = await payload.find({
    collection: 'products',
    limit,
    depth: 1,
    where: Object.keys(where).length > 0 ? where : undefined,
  })

  return result
}

export async function getProductBySlug(slug: string) {
  if (DATA_SOURCE === 'local') {
    return productsData.find(p => p.slug === slug) ?? null
  }

  if (!process.env.PAYLOAD_SECRET) {
    return null
  }
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    limit: 1,
    depth: 1,
    where: {
      slug: { equals: slug },
    },
  })

  return result.docs?.[0] ?? null
}

export async function getRelatedProducts({
  categoryId,
  slug,
  limit = 4,
}: {
  categoryId: number | string
  slug: string
  limit?: number
}) {
  if (DATA_SOURCE === 'local') {
    return productsData
      .filter((p) => {
        const pCatId = typeof p.category === 'object' ? p.category.id : p.category
        return pCatId === categoryId && p.slug !== slug
      })
      .slice(0, limit)
  }

  if (!process.env.PAYLOAD_SECRET) {
    return []
  }

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    where: {
      and: [{ category: { equals: categoryId } }, { slug: { not_equals: slug } }],
    },
    depth: 1,
    limit,
  })

  return result.docs
}
