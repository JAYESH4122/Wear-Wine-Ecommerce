export interface CarouselCard {
  src: string
  title?: string
  description?: string
}
import { getApiUrl } from '@/lib/api/getApiUrl'

export const getCarouselData = async (): Promise<CarouselCard[]> => {
  const API_URL = getApiUrl()
  const params = new URLSearchParams({ limit: '30', depth: '0' })
  params.set('where[type][equals]', 'carousel')

  const res = await fetch(`${API_URL}/api/media?${params.toString()}`, {
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch carousel media: ${res.status}`)
  }
  const data = (await res.json()) as { docs?: { url?: string | null; alt?: string | null }[] }
  const docs = data?.docs ?? []

  return docs.map((doc) => ({
    src: doc.url || '',
    title: doc.alt ?? undefined,
    description: 'Editorial Selection',
  }))
}
