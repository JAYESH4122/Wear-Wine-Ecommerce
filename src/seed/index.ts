// src/scripts/seed.ts
import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config' // Adjust path to your payload.config
import { seed } from './product'
import { seedHero } from './hero'
import { seedCarousel } from './carousel'

const run = async () => {
  // 1. Load your .env variables (Database URL, etc.)

  // 2. Initialize Payload
  const payload = await getPayload({ config: configPromise })

  payload.logger.info('Starting seed script...')

  try {
    // 3. Run the seed function
    await seed(payload)

    // 4. Run the hero slider seed function
    await seedHero(payload)

    await seedCarousel(payload)

    payload.logger.info('Seed completed successfully!')
    process.exit(0)
  } catch (error) {
    payload.logger.error('Seed failed!')
    payload.logger.error(error)
    process.exit(1)
  }
}

run()
