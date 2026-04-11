import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'
import { seed } from './product'
import { seedGlobals } from './globals'

const run = async () => {
  const payload = await getPayload({ config: configPromise })

  payload.logger.info('Starting seed script...')

  try {
    payload.logger.info('Clearing existing data...')
    await payload.delete({ collection: 'products', where: {} })
    await payload.delete({ collection: 'categories', where: {} })
    await payload.delete({ collection: 'media', where: {} })
    await payload.delete({ collection: 'colors', where: {} })
    await payload.delete({ collection: 'sizes', where: {} })
    try {
      await payload.delete({ collection: 'policies', where: {} })
    } catch(e) {}

    await seed(payload)
    await seedGlobals(payload)

    payload.logger.info('Seed completed successfully!')
    process.exit(0)
  } catch (error) {
    payload.logger.error('Seed failed!')
    payload.logger.error(error)
    process.exit(1)
  }
}

run()