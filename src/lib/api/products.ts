import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getProducts({ limit = 20 }: { limit?: number } = {}) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    limit,
    depth: 1,
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