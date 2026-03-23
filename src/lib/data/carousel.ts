import { DATA_SOURCE } from '@/config/data-source'
import { carouselData } from '@/data/carousel'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { CarouselCard } from '@/app/components/depth-card-carousel'

export const getCarouselData = async (): Promise<CarouselCard[]> => {
  if (DATA_SOURCE === 'local') {
    return carouselData
  }

  // EXISTING CMS LOGIC
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const { docs } = await payload.find({
      collection: 'media',
      where: {
        type: { equals: 'carousel' },
      },
      limit: 30,
    })

    return docs.map((doc) => ({
      src: doc.url || '',
      title: doc.alt ?? undefined,
      description: 'Editorial Selection',
    }))
  } catch (error) {
    console.error('Failed to fetch carousel data from CMS:', error)
    return carouselData // Fallback to local
  }
}
