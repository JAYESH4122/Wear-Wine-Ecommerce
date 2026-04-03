import type { Media } from '@/payload-types'
import { getApiUrl } from '@/lib/api/getApiUrl'

export const getHeroData = async (): Promise<Media[]> => {
  const API_URL = getApiUrl()
  const params = new URLSearchParams({ limit: '30', depth: '0' })
  params.set('where[type][equals]', 'hero')

  const res = await fetch(`${API_URL}/api/media?${params.toString()}`, {
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch hero media: ${res.status}`)
  }
  const data = (await res.json()) as { docs?: Media[] }
  return data?.docs ?? []
}
