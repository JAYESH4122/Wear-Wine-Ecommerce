import type { GalleryImage } from '@/app/components/collection-gallery'
import { getApiUrl } from '@/lib/api/getApiUrl'
import type { CollectionGallery, Media, Page } from '@/payload-types'

export const getCollectionImages = async (): Promise<GalleryImage[]> => {
  const API_URL = getApiUrl()
  const params = new URLSearchParams({ limit: '1', depth: '2' })
  params.set('where[slug][equals]', 'home')

  const res = await fetch(`${API_URL}/api/pages?${params.toString()}`, {
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch home page: ${res.status}`)
  }
  const data = (await res.json()) as { docs?: Page[] }
  const homePage = data?.docs?.[0]
  if (!homePage) return []

  const galleryBlock = homePage.layout?.find(
    (block): block is CollectionGallery => block.blockType === 'collectionGallery',
  )
  if (!galleryBlock?.images?.length) return []

  return galleryBlock.images
    .filter((item) => typeof item.image !== 'number')
    .map((item) => ({
      id:
        item.id ||
        `${String(item.title ?? item.label ?? 'gallery')}-${String(
          typeof item.image === 'object' && item.image ? (item.image as Media).id : 'unknown',
        )}`,
      image: item.image as Media,
      title: item.title,
      label: item.label,
    }))
}
