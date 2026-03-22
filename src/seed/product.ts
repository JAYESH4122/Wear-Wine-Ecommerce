import { Payload } from 'payload'
import {
  seedCategories,
  seedColors,
  seedProducts,
  seedProductDescription,
  seedSizes,
} from './data'

export const seed = async (payload: Payload) => {
  payload.logger.info('Starting Seed...')

  // 1. CLEAR EXISTING DATA
  await Promise.all([
    payload.delete({ collection: 'products', where: {} }),
    payload.delete({ collection: 'categories', where: {} }),
    payload.delete({ collection: 'colors', where: {} }),
    payload.delete({ collection: 'sizes', where: {} }),
    payload.delete({ collection: 'tags', where: {} }),
    payload.delete({ collection: 'media', where: {} }),
  ])

  // 2. HELPER: FETCH & UPLOAD TO YOUR MEDIA COLLECTION
  const uploadImage = async (url: string, altText: string) => {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to fetch ${url}`)

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const filename = `${altText.toLowerCase().replace(/ /g, '-')}.jpg`

    return await payload.create({
      collection: 'media',
      data: {
        alt: altText,
        type: 'product',
      },
      file: {
        data: buffer,
        name: filename,
        mimetype: 'image/jpeg',
        size: buffer.length,
      },
    })
  }

  // 3. SEED ATTRIBUTES
  const createdColors = await Promise.all(
    seedColors.map((c) => payload.create({ collection: 'colors', data: { name: c.name, hex: c.hex } })),
  )
  const createdSizes = await Promise.all(
    seedSizes.map((s) =>
      payload.create({ collection: 'sizes', data: { label: s.label, value: s.value } }),
    ),
  )

  const colorIdBySeedId = new Map(seedColors.map((c, i) => [c.id, createdColors[i].id] as const))
  const sizeIdBySeedId = new Map(seedSizes.map((s, i) => [s.id, createdSizes[i].id] as const))

  // 4. CATEGORIES
  const createdCategories = await Promise.all(
    seedCategories.map((c) =>
      payload.create({ collection: 'categories', data: { name: c.name, slug: c.slug } }),
    ),
  )
  const categoryIdBySeedId = new Map(
    seedCategories.map((c, i) => [c.id, createdCategories[i].id] as const),
  )

  // 5. PRODUCTS
  for (const p of seedProducts) {
    const media = await uploadImage(p.imageUrl, p.name)
    const categoryId = categoryIdBySeedId.get(p.categoryId)
    if (!categoryId) continue

    await payload.create({
      collection: 'products',
      data: {
        name: p.name,
        price: p.price,
        category: categoryId,
        description: seedProductDescription(p.name),
        images: [
          {
            image: media.id,
          },
        ],
        variants: p.variants.flatMap((v) => {
          const color = colorIdBySeedId.get(v.colorId)
          const size = sizeIdBySeedId.get(v.sizeId)
          if (!color || !size) return []

          return [
            {
              color,
              size,
              sku: v.sku,
              stock: v.stock,
            },
          ]
        }),
      },
    })
  }

  payload.logger.info('Seeding completed successfully.')
}
