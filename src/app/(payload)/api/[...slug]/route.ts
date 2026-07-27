/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import { REST_GET, REST_OPTIONS } from '@payloadcms/next/routes'

const writeFrozen = () =>
  Response.json(
    {
      errors: [
        {
          message: 'CMS changes are temporarily paused for scheduled database maintenance.',
        },
      ],
    },
    {
      status: 503,
      headers: {
        'Cache-Control': 'no-store',
        'Retry-After': '900',
      },
    },
  )

export const GET = REST_GET(config)
export const POST = writeFrozen
export const DELETE = writeFrozen
export const PATCH = writeFrozen
export const PUT = writeFrozen
export const OPTIONS = REST_OPTIONS(config)
