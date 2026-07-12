import type { GalleryImage } from '@/app/components/collection-gallery'
import { getPayloadClient } from '@/lib/payload-client'
import type { CollectionGallery, Media, Page } from '@/payload-types'

export const getCollectionImages = async (): Promise<GalleryImage[]> => {
  try {
    const payload = await getPayloadClient()
    const data = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'home',
        },
      },
      limit: 1,
      depth: 2,
    })
    const homePage = data?.docs?.[0] as unknown as Page
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
        product: item.product,
      }))
  } catch (error) {
    console.error('Failed to fetch home page collections:', error)
    return []
  }
}

