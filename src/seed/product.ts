import { Payload } from 'payload'
import { safeUploadImage } from './utils'

export const seed = async (payload: Payload) => {
  payload.logger.info('Starting Seed...')

  const uploadImage = async (url: string, altText: string) => {
    return await safeUploadImage({ payload, url, alt: altText, type: 'product' })
  }

  const [white, charcoal] = await Promise.all([
    payload.create({ collection: 'colors', data: { name: 'Off White', hex: '#FAF9F6' } }),
    payload.create({ collection: 'colors', data: { name: 'Charcoal', hex: '#36454F' } }),
  ])

  const [m, l] = await Promise.all([
    payload.create({ collection: 'sizes', data: { label: 'Medium', value: 'm' } }),
    payload.create({ collection: 'sizes', data: { label: 'Large', value: 'l' } }),
  ])

  const [jackets] = await Promise.all([
    payload.create({ collection: 'categories', data: { name: 'Jackets', slug: 'jackets' } }),
  ])

  const products = [
    {
      name: 'Waxed Utility Jacket',
      price: 140,
      cat: jackets.id,
      img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=70&fm=webp',
    },
    {
      name: 'Coach Jacket',
      price: 120,
      cat: jackets.id,
      img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=70&fm=webp',
    },
  ]

  for (const p of products) {
    const media = await uploadImage(`${p.img}?auto=format&fit=crop&q=80&w=1200`, p.name)

    if (!media) {
      payload.logger.warn(`Skipping product "${p.name}" due to missing media.`)
      continue
    }

    await payload.create({
      collection: 'products',
      data: {
        name: p.name,
        price: p.price,
        category: p.cat,
        description: `Professional studio photography of a model in ${p.name}. Minimalist urban aesthetic with soft lighting.`,
        images: [{ image: media.id }],
        variants: [
          { color: white.id, size: m.id, sku: `${p.name.slice(0, 3)}-WHT-M`, stock: 10 },
          { color: charcoal.id, size: l.id, sku: `${p.name.slice(0, 3)}-CHR-L`, stock: 5 },
        ],
      },
    })
  }

  payload.logger.info('Seeding completed successfully.')
}
