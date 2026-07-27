import 'dotenv/config'

import { getPayload } from 'payload'

import { assertLiveBusinessReadiness } from '../src/lib/server/live-readiness'
import config from '../src/payload.config'

const payload = await getPayload({ config })

try {
  await assertLiveBusinessReadiness(payload)
  console.info('Live business content is ready for payment enablement.')
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Live business readiness failed')
  process.exitCode = 1
} finally {
  await payload.destroy()
}

process.exit(process.exitCode ?? 0)
