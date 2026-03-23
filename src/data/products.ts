import type { Product } from '@/payload-types'
import { categoriesData } from './categories'

const now = new Date().toISOString()

export const productsData: Product[] = [
  {
    id: 1,
    name: 'Premium Urban Hoodie',
    slug: 'premium-urban-hoodie',
    description: 'A premium quality hoodie for everyday style.',
    price: 129,
    salePrice: 89,
    category: categoriesData[1],
    images: [
      {
        id: 'img1',
        image: {
          id: 101,
          url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800&h=1000',
          alt: 'Premium Urban Hoodie',
          type: 'product',
          createdAt: now,
          updatedAt: now,
        } as any,
      },
    ],
    updatedAt: now,
    createdAt: now,
  },
  {
    id: 2,
    name: 'Minimalist Cotton Tee',
    slug: 'minimalist-cotton-tee',
    description: 'Soft, breathable cotton tee in essential colors.',
    price: 45,
    category: categoriesData[2],
    images: [
      {
        id: 'img2',
        image: {
          id: 102,
          url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800&h=1000',
          alt: 'Minimalist Cotton Tee',
          type: 'product',
          createdAt: now,
          updatedAt: now,
        } as any,
      },
    ],
    updatedAt: now,
    createdAt: now,
  },
  {
    id: 3,
    name: 'Classic Denim Jacket',
    slug: 'classic-denim-jacket',
    description: 'Timeless denim jacket with a modern fit.',
    price: 159,
    category: categoriesData[0],
    images: [
      {
        id: 'img3',
        image: {
          id: 103,
          url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800&h=1000',
          alt: 'Classic Denim Jacket',
          type: 'product',
          createdAt: now,
          updatedAt: now,
        } as any,
      },
    ],
    updatedAt: now,
    createdAt: now,
  },
  {
    id: 4,
    name: 'Linen Blend Shirt',
    slug: 'linen-blend-shirt',
    description: 'Lightweight linen blend shirt for warm days.',
    price: 79,
    category: categoriesData[2],
    images: [
      {
        id: 'img4',
        image: {
          id: 104,
          url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800&h=1000',
          alt: 'Linen Blend Shirt',
          type: 'product',
          createdAt: now,
          updatedAt: now,
        } as any,
      },
    ],
    updatedAt: now,
    createdAt: now,
  },
]
