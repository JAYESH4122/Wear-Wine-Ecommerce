import { getPayloadClient } from '@/lib/payload-client'
import type { Page, Policy } from '@/payload-types'

export async function getGlobal<T>(slug: string): Promise<T | null> {
  try {
    const payload = await getPayloadClient()
    const res = await payload.findGlobal({
      slug: slug as any,
      depth: 2,
    })
    return res as unknown as T
  } catch (error) {
    console.error(`Error fetching global ${slug}:`, error)
    return null
  }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const payload = await getPayloadClient()
    const data = await payload.find({
      collection: 'pages',
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
    console.error(`Error fetching page ${slug}:`, error)
    return null
  }
}

export async function getPolicyBySlug(slug: string): Promise<Policy | null> {
  try {
    const payload = await getPayloadClient()
    const data = await payload.find({
      collection: 'policies',
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
    console.error(`Error fetching policy ${slug}:`, error)
    return null
  }
}

export async function getPolicies(): Promise<Policy[]> {
  try {
    const payload = await getPayloadClient()
    const data = await payload.find({
      collection: 'policies',
      depth: 0,
      limit: 100,
    })
    return (data?.docs as Policy[]) ?? []
  } catch (error) {
    console.error(`Error fetching policies:`, error)
    return []
  }
}

