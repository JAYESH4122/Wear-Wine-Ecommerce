import prompts from 'prompts'
import dotenv from 'dotenv'

import type { PayloadMigration } from '../src/payload-types'

dotenv.config()

prompts.override({ confirm: true })

const [{ getPayload }, { default: config }] = await Promise.all([import('payload'), import('@payload-config')])

const payload = await getPayload({ config })

if (!payload.db) {
  throw new Error('Payload database adapter is not initialized')
}

try {
  const { docs } = (await payload.find({
    collection: 'payload-migrations',
    depth: 0,
    limit: 0,
    where: {
      batch: { equals: -1 },
    },
  })) as { docs: PayloadMigration[] }

  if (docs?.length) {
    await Promise.all(docs.map((doc) => payload.delete({ collection: 'payload-migrations', id: doc.id })))
  }
} catch {
}

await payload.db.migrate?.()
