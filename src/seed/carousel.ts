import { Payload } from 'payload'

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
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Failed to fetch ${url}`)

      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const filename = `${alt.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`

      return await payload.create({
        collection: 'media',
        data: {
          alt,
          type: 'carousel',
        },
        file: {
          data: buffer,
          name: filename,
          mimetype: 'image/jpeg',
          size: buffer.length,
        },
      })
    } catch (err) {
      payload.logger.error(`Error uploading image ${alt}: ${err}`)
    }
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
