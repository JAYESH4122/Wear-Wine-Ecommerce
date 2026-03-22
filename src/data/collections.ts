export interface GalleryImage {
  id: number
  src: string
  title: string
  label: string
  gridClass: string
}

export const collectionGalleryData: GalleryImage[] = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80',
    title: 'New Arrivals',
    label: 'Spring 2024',
    gridClass: 'col-span-12 md:col-span-8 row-span-2 md:row-span-4',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    title: 'Spring Edit',
    label: 'Editorial',
    gridClass: 'col-span-6 md:col-span-4 row-span-2',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
    title: 'Essentials',
    label: 'Curated',
    gridClass: 'col-span-6 md:col-span-4 row-span-2',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=80',
    title: 'Minimalist Series',
    label: 'Collection',
    gridClass: 'col-span-12 md:col-span-12 row-span-2',
  },
]
