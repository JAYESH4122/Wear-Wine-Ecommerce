import { DATA_SOURCE } from '@/config/data-source'
import { collectionImages } from '@/data/collection'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { GalleryImage } from '@/app/components/collection-gallery'
import type { Page, CollectionGallery, Media } from '@/payload-types'

export const getCollectionImages = async (): Promise<GalleryImage[]> => {
  if (DATA_SOURCE === 'local') {
    return collectionImages
  }

  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Find the home page
    const { docs: pages } = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: 'home' },
      },
      limit: 1,
    })

    if (pages.length > 0) {
      const homePage = pages[0] as Page
      // Find the collectionGallery block
      const galleryBlock = homePage.layout?.find(
        (block): block is CollectionGallery => block.blockType === 'collectionGallery'
      )

      if (galleryBlock && galleryBlock.images) {
        return galleryBlock.images
          .filter(item => typeof item.image !== 'number') // Ensure it's populated Media
          .map((item) => ({
            id: item.id || `gallery-item-${Math.random()}`,
            image: item.image as Media,
            title: item.title,
            label: item.label,
          }))
      }
    }

    // Fallback if no block found
    return collectionImages
  } catch (error) {
    console.error('Failed to fetch collection gallery data from CMS:', error)
    return collectionImages
  }
}
