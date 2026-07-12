import { getPayloadClient } from '@/lib/payload-client'

export interface CarouselCard {
  src: string
  title?: string
  description?: string
}

export const getCarouselData = async (): Promise<CarouselCard[]> => {
  try {
    const payload = await getPayloadClient()
    const data = await payload.find({
      collection: 'media',
      where: {
        type: {
          equals: 'carousel',
        },
      },
      limit: 30,
      depth: 0,
    })
    const docs = data?.docs ?? []

    return docs.map((doc) => ({
      src: doc.url || '',
      title: doc.alt ?? undefined,
      description: 'Editorial Selection',
    }))
  } catch (error) {
    console.error('Error fetching carousel media:', error)
    return []
  }
}

