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
    try { await payload.delete({ collection: 'products', where: {} }) } catch(_e) {}
    try { await payload.delete({ collection: 'categories', where: {} }) } catch(_e) {}
    try { await payload.delete({ collection: 'media', where: {} }) } catch(_e) {}
    try { await payload.delete({ collection: 'colors', where: {} }) } catch(_e) {}
    try { await payload.delete({ collection: 'sizes', where: {} }) } catch(_e) {}
    try { await payload.delete({ collection: 'policies', where: {} }) } catch(_e) {}

    try { await seed(payload) } catch(_e) {}
    try { await seedGlobals(payload) } catch(_e) {}

    payload.logger.info('Seed completed successfully!')
    process.exit(0)
  } catch (error) {
    payload.logger.error('Seed failed!')
    payload.logger.error(error)
    process.exit(1)
  }
}

run()