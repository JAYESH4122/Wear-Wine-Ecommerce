import { Payload } from 'payload'

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
      data: { alt: altText },
      file: {
        data: buffer,
        name: filename,
        mimetype: 'image/jpeg',
        size: buffer.length,
      },
    })
  }

  // 3. SEED ATTRIBUTES
  const [white, charcoal, navy, sand] = await Promise.all([
    payload.create({ collection: 'colors', data: { name: 'Off White', hex: '#FAF9F6' } }),
    payload.create({ collection: 'colors', data: { name: 'Charcoal', hex: '#36454F' } }),
    payload.create({ collection: 'colors', data: { name: 'Navy', hex: '#000080' } }),
    payload.create({ collection: 'colors', data: { name: 'Sand', hex: '#C2B280' } }),
  ])

  const [s, m, l, xl] = await Promise.all([
    payload.create({ collection: 'sizes', data: { label: 'Small', value: 's' } }),
    payload.create({ collection: 'sizes', data: { label: 'Medium', value: 'm' } }),
    payload.create({ collection: 'sizes', data: { label: 'Large', value: 'l' } }),
    payload.create({ collection: 'sizes', data: { label: 'Extra Large', value: 'xl' } }),
  ])

  // 4. CATEGORIES
  const categories = await Promise.all([
    payload.create({ collection: 'categories', data: { name: 'T-Shirts', slug: 't-shirts' } }),
    payload.create({ collection: 'categories', data: { name: 'Hoodies', slug: 'hoodies' } }),
    payload.create({ collection: 'categories', data: { name: 'Outerwear', slug: 'outerwear' } }),
    payload.create({ collection: 'categories', data: { name: 'Dresses', slug: 'dresses' } }),
  ])

  // 5. THE 10 PRODUCTS (Matching your "Minimalist Fashion Catalog" aesthetic)
  // These Unsplash links are specifically chosen for: 
  // - Professional model pose, Centered, Full body, Light grey/Studio background.
  const products = [
    { name: 'Heavyweight Boxy Tee', price: 45, cat: categories[0].id, img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a' },
    { name: 'Core French Terry Hoodie', price: 85, cat: categories[1].id, img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7' },
    { name: 'Minimalist Nylon Bomber', price: 140, cat: categories[2].id, img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea' },
    { name: 'Structured Midi Dress', price: 115, cat: categories[3].id, img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c' },
    { name: 'Essential Sand Hoodie', price: 85, cat: categories[1].id, img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2' },
    { name: 'Oversized Street Jacket', price: 160, cat: categories[2].id, img: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a' },
    { name: 'Vintage Raw Denim Jacket', price: 125, cat: categories[2].id, img: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531' },
    { name: 'Graphic Studio Tee', price: 50, cat: categories[0].id, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab' },
    { name: 'Urban Shift Dress', price: 110, cat: categories[3].id, img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b' },
    { name: 'Monochrome Lounge Set', price: 95, cat: categories[0].id, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f' },
  ]

  for (const p of products) {
    // A. Fetch image and create Media item
    // We append &q=80&w=1200 to ensure high-quality studio texture
    const media = await uploadImage(`${p.img}?auto=format&fit=crop&q=80&w=1200`, p.name)

    // B. Create Product and link to the Media entry
    await payload.create({
      collection: 'products',
      data: {
        name: p.name,
        price: p.price,
        category: p.cat,
        description: `Professional studio photography of a model in ${p.name}. Minimalist urban aesthetic with soft lighting.`,
        // Note: Ensure your Categories collection has an 'image' field if you want to link it there too
        variants: [
          { color: white.id, size: m.id, sku: `${p.name.slice(0,3)}-WHT-M`, stock: 10 },
          { color: charcoal.id, size: l.id, sku: `${p.name.slice(0,3)}-CHR-L`, stock: 5 },
        ]
      },
    })
  }

  payload.logger.info('Seeding completed successfully.')
}