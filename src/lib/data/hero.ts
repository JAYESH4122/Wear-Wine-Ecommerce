import type { Media } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload-client'

export const getHeroData = async (): Promise<Media[]> => {
  try {
    const payload = await getPayloadClient()
    const data = await payload.find({
      collection: 'media',
      where: {
        type: {
          equals: 'hero',
        },
      },
      limit: 30,
      depth: 0,
    })
    return (data?.docs as Media[]) ?? []
  } catch (error) {
    console.error('Failed to fetch hero media:', error)
    return []
  }
}

