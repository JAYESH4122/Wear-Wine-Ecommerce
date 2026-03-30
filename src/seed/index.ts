// src/scripts/seed.ts
import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config' // Adjust path to your payload.config
import { seed } from './product'
import { seedHero } from './hero'
import { seedCarousel } from './carousel'
import { seedGlobals } from './globals'
import { seedPages } from './pages'

const run = async () => {
  // 1. Load your .env variables (Database URL, etc.)

  // 2. Initialize Payload
  const payload = await getPayload({ config: configPromise })

  payload.logger.info('Starting seed script...')

  try {
    // 3. Clear existing data to avoid conflicts
    payload.logger.info('Clearing existing data...')

    // Delete in order to avoid foreign key constraint violations
    await payload.delete({ collection: 'products', where: {} })
    await payload.delete({ collection: 'pages', where: {} })
    await payload.delete({ collection: 'categories', where: {} })
    await payload.delete({ collection: 'media', where: {} })
    await payload.delete({ collection: 'colors', where: {} })
    await payload.delete({ collection: 'sizes', where: {} })
    await payload.delete({ collection: 'tags', where: {} })

    // 4. Run the seed function
    await seed(payload)

    // 5. Run the hero slider seed function
    await seedHero(payload)

    await seedCarousel(payload)

    // 6. Seed Globals and Pages
    await seedGlobals(payload)
    await seedPages(payload)

    payload.logger.info('Seed completed successfully!')
    process.exit(0)
  } catch (error) {
    payload.logger.error('Seed failed!')
    payload.logger.error(error)
    process.exit(1)
  }
}

run()
