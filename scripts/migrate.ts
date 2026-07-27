import prompts from 'prompts'
import dotenv from 'dotenv'

import type { PayloadMigration } from '../src/payload-types'

dotenv.config()

prompts.override({ confirm: true })
process.env.DISABLE_PAYLOAD_HMR = 'true'

const [{ getPayload }, { default: config }] = await Promise.all([
  import('payload'),
  import('@payload-config'),
])

const payload = await getPayload({ config })

if (!payload.db) {
  throw new Error('Payload database adapter is not initialized')
}

try {
  await payload.db.migrate?.()

  const { docs } = (await payload.find({
    collection: 'payload-migrations',
    depth: 0,
    limit: 0,
    where: {
      and: [{ batch: { equals: -1 } }, { name: { equals: 'dev' } }],
    },
  })) as { docs: PayloadMigration[] }

  for (const doc of docs) {
    await payload.delete({ collection: 'payload-migrations', id: doc.id })
  }
} finally {
  await payload.destroy()
}

process.exit(0)
