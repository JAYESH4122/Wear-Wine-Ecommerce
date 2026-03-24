import type { Media } from '@/payload-types'

const now = new Date().toISOString()
export const heroData: Media[] = [
  {
    id: -1,
    alt: 'Premium Urban Streetwear Blue Hoodie',
    type: 'hero',
    createdAt: now,
    updatedAt: now,
    url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1920&h=1080',
  },
  {
    id: -2,
    alt: 'High Fashion Editorial Street Style',
    type: 'hero',
    createdAt: now,
    updatedAt: now,
    url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c',
  },
  {
    id: -3,
    alt: 'Minimalist Black Oversized Hoodie',
    type: 'hero',
    createdAt: now,
    updatedAt: now,
    url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=1920&h=1080',
  },
  {
    id: -4,
    alt: 'Modern Denim and Premium Jacket Look',
    type: 'hero',
    createdAt: now,
    updatedAt: now,
    url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=1920&h=1080',
  },
  {
    id: -5,
    alt: 'Luxury Autumn Streetwear Fashion',
    type: 'hero',
    createdAt: now,
    updatedAt: now,
    url: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=1920&h=1080',
  },
]
