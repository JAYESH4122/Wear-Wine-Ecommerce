import { getApiUrl } from '@/lib/api/getApiUrl'
import type { Product } from '@/payload-types'

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const API_URL = getApiUrl()
    const params = new URLSearchParams({
      depth: '2',
      limit: '1',
    })
    params.set('where[slug][equals]', slug)

    const res = await fetch(`${API_URL}/api/products?${params.toString()}`, {
      credentials: 'include',
    })
    if (!res.ok) return null
    const data = (await res.json()) as { docs?: Product[] }
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
    const API_URL = getApiUrl()
    const params = new URLSearchParams({
      depth: '1',
      limit: String(limit),
    })
    params.set('where[and][0][category][equals]', String(categoryId))
    params.set('where[and][1][slug][not_equals]', slug)

    const res = await fetch(`${API_URL}/api/products?${params.toString()}`, {
      credentials: 'include',
    })
    if (!res.ok) return []
    const data = (await res.json()) as { docs?: Product[] }
    return data?.docs ?? []
  } catch (error) {
    console.error('Error fetching related products:', error)
    return []
  }
}
