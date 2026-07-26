import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import type { GlobalSlug, PopulateType } from 'payload'
import { getGlobalCacheTag } from '@/lib/cache-tags'
import { getPayloadClient } from '@/lib/payload-client'
import type { Page, Policy } from '@/payload-types'

const GLOBAL_CACHE_TTL_SECONDS = 300

const globalPopulate: Record<string, PopulateType> = {
  header: {
    pages: {
      slug: true,
    },
  },
  footer: {
    policies: {
      slug: true,
    },
  },
  'pdp-static': {
    media: {
      alt: true,
      url: true,
      sizes: true,
    },
  },
}

const fetchGlobal = async (slug: string) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: slug as GlobalSlug,
    // Each frontend global only needs its direct relationships. For example,
    // PDP Static needs its size-chart media, not media nested below it.
    depth: 1,
    populate: globalPopulate[slug],
  })
}

const getCachedGlobal = cache(async (slug: string) => {
  try {
    return await unstable_cache(fetchGlobal, ['payload-global', slug], {
      revalidate: GLOBAL_CACHE_TTL_SECONDS,
      tags: [getGlobalCacheTag(slug)],
    })(slug)
  } catch (error) {
    console.error(`Error fetching global ${slug}:`, error)
    return null
  }
})

export async function getGlobal<T>(slug: string): Promise<T | null> {
  const res = await getCachedGlobal(slug)
  return res as T | null
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
