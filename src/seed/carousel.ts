import { Payload } from 'payload'
import { safeUploadImage } from './utils'

export const seedCarousel = async (payload: Payload) => {
  payload.logger.info('Starting Carousel Images Seed...')

  const images = [
    {
      img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=480&h=650&fit=crop',
      alt: 'Alpine Mystique',
    },
    {
      img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=480&h=650&fit=crop',
      alt: 'Golden Solitude',
    },
    {
      img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=480&h=650&fit=crop',
      alt: 'Ethereal Dawn',
    },
    {
      img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=480&h=650&fit=crop',
      alt: 'Verdant Echoes',
    },
    {
      img: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=480&h=650&fit=crop',
      alt: 'Midnight Harmony',
    },
    {
      img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=480&h=650&fit=crop',
      alt: 'Urban Minimalism',
    },
  ]

  const uploadCarouselImage = async (url: string, alt: string) => {
    return await safeUploadImage({
      payload,
      url,
      alt,
      type: 'carousel',
    })
  }

  for (const img of images) {
    const existing = await payload.find({
      collection: 'media',
      where: {
        alt: { equals: img.alt },
      },
    })

    if (existing.totalDocs === 0) {
      await uploadCarouselImage(img.img, img.alt)
    }
  }

  payload.logger.info('Carousel Images Seeding completed successfully.')
}
