import { Payload } from 'payload'
import { safeUploadImage } from './utils'

export const seedHero = async (payload: Payload) => {
  payload.logger.info('Starting Hero Images Seed...')

  const images = [
    {
      alt: 'Premium Urban Streetwear Blue Hoodie',
      img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1920&h=1080',
    },
    {
      alt: 'High Fashion Editorial Street Style',
      img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1920&h=1080', // Replaced broken link
    },
    {
      alt: 'Minimalist Black Oversized Hoodie',
      img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=1920&h=1080',
    },
    {
      alt: 'Modern Denim and Premium Jacket Look',
      img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=1920&h=1080',
    },
    {
      alt: 'Luxury Autumn Streetwear Fashion',
      img: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=1920&h=1080',
    },
  ]

  const uploadHeroImage = async (url: string, alt: string) => {
    return await safeUploadImage({
      payload,
      url,
      alt,
      type: 'hero',
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
      await uploadHeroImage(img.img, img.alt)
    }
  }

  payload.logger.info('Hero Images Seeding completed successfully.')
}
