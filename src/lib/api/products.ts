import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getProducts({ limit = 20, query = '' }: { limit?: number; query?: string } = {}) {
  const payload = await getPayload({ config: configPromise })

  const where: any = {}
  if (query) {
    where.or = [
      { name: { contains: query } },
      { description: { contains: query } },
    ]
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