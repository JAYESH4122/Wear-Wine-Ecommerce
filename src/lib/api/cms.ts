import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { DATA_SOURCE } from '@/config/data-source'

// Mock fallbacks (will be populated with actual seed data structures if needed)
import { pdpStaticData } from '@/data/pdp-static'
import { navigation } from '@/app/components/Header/data'
import { footerData } from '@/app/components/footer/data'

export async function getGlobal<T>(slug: string): Promise<T | null> {
  if (DATA_SOURCE === 'local') {
    // Basic local fallbacks
    if (slug === 'pdp-static') return pdpStaticData as unknown as T
    if (slug === 'header') return { navItems: navigation.map(item => ({ label: item.name, link: { url: item.href } })) } as unknown as T
    if (slug === 'footer') return { columns: [] } as unknown as T
    if (slug === 'site-settings') return { siteName: 'Wear Wine', logo: null } as unknown as T
    return null
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.findGlobal({
      slug: slug as any,
      depth: 2,
    })
    return result as unknown as T
  } catch (error) {
    console.error(`Error fetching global ${slug}:`, error)
    return null
  }
}

export async function getPageBySlug(slug: string) {
  if (DATA_SOURCE === 'local') {
    // Handle home-page local fallback (will expand as needed)
    return null
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
      },
      depth: 2,
      limit: 1,
    })
    return result.docs?.[0] ?? null
  } catch (error) {
    console.error(`Error fetching page ${slug}:`, error)
    return null
  }
}

export async function getProductBySlug(slug: string) {
  if (DATA_SOURCE === 'local') {
    return null // Local product fetching is handled by separate local API logic if needed
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'products',
      where: {
        slug: { equals: slug },
      },
      depth: 2,
      limit: 1,
    })
    return result.docs?.[0] ?? null
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error)
    return null
  }
}
