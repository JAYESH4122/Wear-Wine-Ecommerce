import { getApiUrl } from '@/lib/api/getApiUrl'
import type { Page } from '@/payload-types'

export async function getGlobal<T>(slug: string): Promise<T | null> {
  try {
    const API_URL = getApiUrl()
    const res = await fetch(`${API_URL}/api/globals/${slug}?depth=2`, {
      credentials: 'include',
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch (error) {
    console.error(`Error fetching global ${slug}:`, error)
    return null
  }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const API_URL = getApiUrl()
    const params = new URLSearchParams({
      depth: '2',
      limit: '1',
    })
    params.set('where[slug][equals]', slug)

    const res = await fetch(`${API_URL}/api/pages?${params.toString()}`, {
      credentials: 'include',
    })
    if (!res.ok) return null
    const data = (await res.json()) as { docs?: Page[] }
    return data?.docs?.[0] ?? null
  } catch (error) {
    console.error(`Error fetching page ${slug}:`, error)
    return null
  }
}

export async function getPolicyBySlug(slug: string) {
  try {
    const API_URL = getApiUrl()
    const params = new URLSearchParams({
      depth: '2',
      limit: '1',
    })
    params.set('where[slug][equals]', slug)

    const res = await fetch(`${API_URL}/api/policies?${params.toString()}`, {
      credentials: 'include',
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.docs?.[0] ?? null
  } catch (error) {
    console.error(`Error fetching policy ${slug}:`, error)
    return null
  }
}

export async function getPolicies() {
  try {
    const API_URL = getApiUrl()
    const params = new URLSearchParams({
      depth: '0',
      limit: '100',
    })

    const res = await fetch(`${API_URL}/api/policies?${params.toString()}`, {
      credentials: 'include',
    })
    if (!res.ok) return []
    const data = await res.json()
    return data?.docs ?? []
  } catch (error) {
    console.error(`Error fetching policies:`, error)
    return []
  }
}
