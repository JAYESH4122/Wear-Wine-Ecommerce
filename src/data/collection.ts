import { GalleryImage } from '@/app/components/collection-gallery'
import type { Media } from '@/payload-types'

export const collectionImages: GalleryImage[] = [
  {
    id: 1,
    image: {
      url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80',
      alt: 'New Arrivals',
    } as Media,
    title: 'New Arrivals',
    label: 'Spring 2024',
    description: 'Discover the latest trends and timeless pieces',
  },
  {
    id: 2,
    image: {
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
      alt: 'Spring Edit',
    } as Media,
    title: 'Spring Edit',
    label: 'Editorial',
    description: 'Curated looks for the modern aesthetic',
  },
  {
    id: 3,
    image: {
      url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
      alt: 'Essentials',
    } as Media,
    title: 'Essentials',
    label: 'Curated',
    description: 'Building blocks of a sophisticated wardrobe',
  },
  {
    id: 4,
    image: {
      url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=80',
      alt: 'Minimalist Series',
    } as Media,
    title: 'Minimalist Series',
    label: 'Collection',
    description: 'Where simplicity meets elegance',
  },
]
