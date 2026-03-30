import { Payload } from 'payload'

interface UploadOptions {
  payload: Payload
  url: string
  alt: string
  type: 'hero' | 'product' | 'carousel'
  filename?: string
  mimetype?: string
}

export const safeUploadImage = async ({
  payload,
  url,
  alt,
  type,
  filename,
  mimetype = 'image/jpeg',
}: UploadOptions) => {
  try {
    payload.logger.info(`Fetching image: ${url}`)
    const response = await fetch(url)
    if (!response.ok) {
      payload.logger.warn(`Failed to fetch ${url}: ${response.status} ${response.statusText}. Skipping upload for "${alt}".`)
      return null
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Check if buffer is valid for image-size (too small or empty)
    if (buffer.length === 0) {
      payload.logger.warn(`Fetched empty buffer from ${url}. Skipping upload for "${alt}".`)
      return null
    }

    // Basic check if it's actually an image (minimal check)
    // Payload uses sharp/image-size under the hood. 
    // If it's HTML (404 page), it will fail during payload.create.
    // We can at least check if it looks like HTML.
    if (buffer.toString('utf8', 0, 10).toLowerCase().includes('<!doctype') || 
        buffer.toString('utf8', 0, 10).toLowerCase().includes('<html')) {
      payload.logger.warn(`Fetched HTML instead of image from ${url}. This is likely a 404/error page. Skipping upload for "${alt}".`)
      return null
    }

    const safeFilename = filename || `${alt.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${mimetype.split('/')[1]}`

    return await payload.create({
      collection: 'media',
      data: {
        alt,
        type,
      },
      file: {
        data: buffer,
        name: safeFilename,
        mimetype: mimetype,
        size: buffer.length,
      },
    })
  } catch (err) {
    payload.logger.error(`Error uploading image "${alt}" from ${url}: ${err instanceof Error ? err.message : String(err)}`)
    return null
  }
}
  