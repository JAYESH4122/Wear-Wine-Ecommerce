import dotenv from 'dotenv'
import type { Media } from '../src/payload-types'

dotenv.config()

const [{ getPayload }, { default: config }] = await Promise.all([
  import('payload'),
  import('@payload-config'),
])

const batchSize = 25
const applyChanges = process.argv.includes('--apply')
const serverURL = process.env.NEXT_PUBLIC_API_URL

if (!serverURL) {
  throw new Error('NEXT_PUBLIC_API_URL is required to regenerate media sizes.')
}

const getSourceURL = (media: Media) => {
  if (!media.url) return null
  return new URL(media.url, serverURL).toString()
}

const payload = await getPayload({ config })

let page = 1
let totalPages = 1
let processed = 0
let skipped = 0
let failed = 0

do {
  const result = await payload.find({
    collection: 'media',
    where: {
      type: {
        equals: 'product',
      },
    },
    depth: 0,
    limit: batchSize,
    page,
  })
  totalPages = result.totalPages

  for (const media of result.docs) {
    const sourceURL = getSourceURL(media)

    if (!sourceURL || !media.filename || !media.mimeType) {
      skipped += 1
      console.warn(`Skipping media ${media.id}: original file metadata is incomplete.`)
      continue
    }

    if (!applyChanges) {
      processed += 1
      console.log(`Would regenerate variants for media ${media.id}: ${media.filename}`)
      continue
    }

    try {
      const response = await fetch(sourceURL)
      if (!response.ok) {
        throw new Error(`Source returned ${response.status}`)
      }

      const buffer = Buffer.from(await response.arrayBuffer())
      const mimetype = response.headers.get('content-type')?.split(';')[0] || media.mimeType

      await payload.update({
        collection: 'media',
        id: media.id,
        data: {
          alt: media.alt,
          type: media.type,
        },
        file: {
          data: buffer,
          mimetype,
          name: media.filename,
          size: buffer.length,
        },
        overwriteExistingFiles: true,
      })

      processed += 1
      console.log(`Regenerated variants for media ${media.id}: ${media.filename}`)
    } catch (error) {
      failed += 1
      console.error(`Failed to regenerate media ${media.id}:`, error)
    }
  }

  page += 1
} while (page <= totalPages)

console.log(
  `${applyChanges ? 'Completed' : 'Dry run completed'}: ${processed} candidate(s), ${skipped} skipped, ${failed} failed.`,
)

if (!applyChanges) {
  console.log(
    'Review the candidates, then run `pnpm regenerate:media-sizes -- --apply` after deploying the migration.',
  )
}

if (failed > 0) {
  process.exitCode = 1
}

await payload.destroy()
process.exit(process.exitCode ?? 0)
