import { Payload } from 'payload'

export const fetchFileByURL = async (url: string) => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch file from ${url}: ${response.status} ${response.statusText}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  if (buffer.length === 0) {
    throw new Error(`Fetched empty buffer from ${url}`)
  }

  // Basic check for HTML error pages (e.g. 404s rendered as HTML)
  const preview = buffer.toString('utf8', 0, 50).toLowerCase()
  if (preview.includes('<!doctype') || preview.includes('<html')) {
    throw new Error(`URL returned HTML instead of an image: ${url}`)
  }

  const contentType = response.headers.get('content-type')
  const mimetype = contentType?.split(';')[0] || 'image/jpeg'

  let filename = url.split('/').pop()?.split('?')[0] || 'uploaded-image'
  if (!filename.includes('.')) {
    const ext = mimetype.split('/')[1] || 'jpg'
    filename = `${filename}.${ext}`
  }

  // Clean filename for production storage support
  filename = filename.replace(/[^a-zA-Z0-9.-]/g, '-')

  return {
    data: buffer,
    name: filename,
    mimetype,
    size: buffer.length,
  }
}

interface UploadOptions {
  payload: Payload
  url: string
  alt: string
  type: 'hero' | 'product' | 'carousel'
  filename?: string
  mimetype?: string
}

export const safeUploadImage = async ({ payload, url, alt, type }: UploadOptions) => {
  try {
    payload.logger.info(`Fetching image: ${url}`)

    const file = await fetchFileByURL(url).catch(() => null)

    if (!file) {
      payload.logger.warn(`Skipping image (failed fetch): ${url}`)
      return null
    }

    const created = await payload.create({
      collection: 'media',
      data: {
        alt,
        type,
      },
      file,
    })

    payload.logger.info(`Uploaded image: ${alt}`)

    return created
  } catch (err) {
    payload.logger.error(
      `Error uploading image "${alt}": ${err instanceof Error ? err.message : String(err)}`,
    )
    return null
  }
}
