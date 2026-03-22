import { Payload } from 'payload'
import { seedCarouselImages } from './data'

export const seedCarousel = async (payload: Payload) => {
  payload.logger.info('Starting Carousel Images Seed...')

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

  for (const img of seedCarouselImages) {
    const existing = await payload.find({
      collection: 'media',
      where: {
        alt: { equals: img.alt },
      },
    })

    if (existing.totalDocs === 0) {
      await uploadCarouselImage(img.url, img.alt)
    }
  }

  payload.logger.info('Carousel Images Seeding completed successfully.')
}
