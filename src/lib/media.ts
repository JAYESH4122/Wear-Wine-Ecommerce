import type { Media } from '@/payload-types'

type MediaSize = {
  url?: string | null
}

type MediaWithSizes = Media & {
  sizes?: Record<string, MediaSize | null> | null
}

/**
 * Selects a purpose-built Payload image variant when it exists, while keeping
 * already-uploaded media working until its responsive variants are regenerated.
 */
export const getMediaUrl = (
  media: Media | null | undefined,
  preferredSize?: 'card' | 'pdp',
): string | null => {
  if (!media) return null

  const sizes = (media as MediaWithSizes).sizes
  const sizedUrl = preferredSize ? sizes?.[preferredSize]?.url : null

  return sizedUrl ?? media.url ?? null
}
