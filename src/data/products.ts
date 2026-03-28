import type { Product } from '@/payload-types'
import { categoriesData } from './categories'
import { makeMedia, makeVariants, now } from './product-utils'

export const productsData: Product[] = [
  {
    id: 1,
    name: 'Architectural Scuba Hoodie',
    slug: 'architectural-scuba-hoodie',
    description:
      'Constructed from a dense, double-knit bonded jersey for a structural, sculptural fit. Featuring drop shoulders and a seamless kangaroo pocket.',
    price: 245,
    salePrice: 195,
    category: categoriesData[1],
    images: [
      {
        id: 'img-1-1',
        image: makeMedia(
          101,
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800&h=1000',
          'Full Silhouette',
        ) as any,
      },
      {
        id: 'img-1-2',
        image: makeMedia(
          102,
          'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800&h=1000',
          'Fabric Texture Detail',
        ) as any,
      },
      {
        id: 'img-1-3',
        image: makeMedia(
          103,
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800&h=1000',
          'Back Profile',
        ) as any,
      },
      {
        id: 'img-1-4',
        image: makeMedia(
          104,
          'https://images.unsplash.com/photo-1509942704409-4bcc3391ef7a?auto=format&fit=crop&q=80&w=800&h=1000',
          'Urban Lifestyle View',
        ) as any,
      },
    ],
    variants: makeVariants(['white', 'charcoal', 'navy'], ['s', 'm', 'l', 'xl']) as any,
    updatedAt: now,
    createdAt: now,
  },
  {
    id: 2,
    name: 'Supima Silk-Cotton Tee',
    slug: 'supima-silk-cotton-tee',
    description:
      'An elevated essential crafted from a rare blend of long-staple Supima cotton and mulberry silk. Unrivaled softness with a subtle lustrous finish.',
    price: 95,
    category: categoriesData[2],
    images: [
      {
        id: 'img-2-1',
        image: makeMedia(
          201,
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800&h=1000',
          'Studio Editorial Front',
        ) as any,
      },
      {
        id: 'img-2-2',
        image: makeMedia(
          202,
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800&h=1000',
          'Side Drape View',
        ) as any,
      },
      {
        id: 'img-2-3',
        image: makeMedia(
          203,
          'https://images.unsplash.com/photo-1434389677669-e08b493b11ec?auto=format&fit=crop&q=80&w=800&h=1000',
          'Material Flatlay',
        ) as any,
      },
    ],
    variants: makeVariants(['white', 'charcoal', 'sand'], ['s', 'm', 'l']) as any,
    updatedAt: now,
    createdAt: now,
  },
  {
    id: 3,
    name: 'Japanese Selvedge Denim Chore',
    slug: 'japanese-selvedge-denim-chore',
    description:
      'Raw 14oz indigo selvedge denim sourced from Okayama. Tailored with a modern boxy cut and reinforced with antique brass hardware.',
    price: 380,
    salePrice: 295,
    category: categoriesData[0],
    images: [
      {
        id: 'img-3-1',
        image: makeMedia(
          301,
          'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=800&h=1000',
          'Chore Coat Front',
        ) as any,
      },
      {
        id: 'img-3-2',
        image: makeMedia(
          302,
          'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?auto=format&fit=crop&q=80&w=800&h=1000',
          'Selvedge Cuff Detail',
        ) as any,
      },
      {
        id: 'img-3-3',
        image: makeMedia(
          303,
          'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800&h=1000',
          'Side Silhouette',
        ) as any,
      },
      {
        id: 'img-3-4',
        image: makeMedia(
          304,
          'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800&h=1000',
          'Hardware Detail',
        ) as any,
      },
    ],
    variants: makeVariants(['navy', 'charcoal'], ['s', 'm', 'l', 'xl']) as any,
    updatedAt: now,
    createdAt: now,
  },
  {
    id: 4,
    name: 'Italian Linen Resort Shirt',
    slug: 'italian-linen-resort-shirt',
    description:
      'Woven in Northern Italy, this high-breathability linen blend features a relaxed camp collar and mother-of-pearl buttons.',
    price: 185,
    category: categoriesData[2],
    images: [
      {
        id: 'img-4-1',
        image: makeMedia(
          401,
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800&h=1000',
          'Full Front View',
        ) as any,
      },
      {
        id: 'img-4-2',
        image: makeMedia(
          402,
          'https://images.unsplash.com/photo-1626497741445-04805caa2974?auto=format&fit=crop&q=80&w=800&h=1000',
          'Collar & Button Detail',
        ) as any,
      },
      {
        id: 'img-4-3',
        image: makeMedia(
          403,
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800&h=1000',
          'Lifestyle Resort Shot',
        ) as any,
      },
    ],
    variants: makeVariants(['white', 'sand'], ['s', 'm', 'l']) as any,
    updatedAt: now,
    createdAt: now,
  },
  {
    id: 5,
    name: 'Lustre Tech Satin Bomber',
    slug: 'lustre-tech-satin-bomber',
    description:
      'A contemporary take on the flight jacket. Water-repellent technical satin with a deep sheen, lined in premium Bemberg silk.',
    price: 420,
    salePrice: 315,
    category: categoriesData[0],
    images: [
      {
        id: 'img-5-1',
        image: makeMedia(
          501,
          'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800&h=1000',
          'Front Bomber Silhouette',
        ) as any,
      },
      {
        id: 'img-5-2',
        image: makeMedia(
          502,
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800&h=1000',
          'Zipper Detail',
        ) as any,
      },
      {
        id: 'img-5-3',
        image: makeMedia(
          503,
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800&h=1000',
          'Profile View',
        ) as any,
      },
      {
        id: 'img-5-4',
        image: makeMedia(
          504,
          'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800&h=1000',
          'Fabric Lustre Close-up',
        ) as any,
      },
      {
        id: 'img-5-5',
        image: makeMedia(
          505,
          'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=800&h=1000',
          'Back Panel View',
        ) as any,
      },
    ],
    variants: makeVariants(['charcoal', 'navy'], ['s', 'm', 'l', 'xl']) as any,
    updatedAt: now,
    createdAt: now,
  },
  {
    id: 6,
    name: 'Asymmetrical Crepe Column Dress',
    slug: 'asymmetrical-crepe-column-dress',
    description:
      'A study in drape. Heavyweight Italian crepe creates a fluid silhouette with a sharp, asymmetrical neckline and hidden side zip.',
    price: 550,
    category: categoriesData[3] ?? categoriesData[0],
    images: [
      {
        id: 'img-6-1',
        image: makeMedia(
          601,
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800&h=1000',
          'Editorial Long Shot',
        ) as any,
      },
      {
        id: 'img-6-2',
        image: makeMedia(
          602,
          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800&h=1000',
          'Neckline & Silhouette',
        ) as any,
      },
      {
        id: 'img-6-3',
        image: makeMedia(
          603,
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800&h=1000',
          'Back Drape View',
        ) as any,
      },
      {
        id: 'img-6-4',
        image: makeMedia(
          604,
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800&h=1000',
          'Fabric Movement Detail',
        ) as any,
      },
    ],
    variants: makeVariants(['white', 'sand', 'navy'], ['s', 'm', 'l']) as any,
    updatedAt: now,
    createdAt: now,
  },
  {
    id: 7,
    name: 'Atelier Series Graphic Tee',
    slug: 'atelier-series-graphic-tee',
    description:
      'Heavy 300gsm cotton jersey featuring a minimalist embossed studio graphic. Oversized proportions with high-ribbed neckline.',
    price: 125,
    salePrice: 85,
    category: categoriesData[2],
    images: [
      {
        id: 'img-7-1',
        image: makeMedia(
          701,
          'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800&h=1000',
          'Front Graphic Shot',
        ) as any,
      },
      {
        id: 'img-7-2',
        image: makeMedia(
          702,
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800&h=1000',
          'Studio Fit Shot',
        ) as any,
      },
      {
        id: 'img-7-3',
        image: makeMedia(
          703,
          'https://images.unsplash.com/photo-1467043237213-65f2da53396f?auto=format&fit=crop&q=80&w=800&h=1000',
          'Texture Close-up',
        ) as any,
      },
    ],
    variants: makeVariants(['white', 'charcoal'], ['s', 'm', 'l', 'xl']) as any,
    updatedAt: now,
    createdAt: now,
  },
  {
    id: 8,
    name: 'Double-Faced Wool Car Coat',
    slug: 'double-faced-wool-car-coat',
    description:
      'An unlined, double-faced wool and cashmere blend overcoat. Meticulously hand-finished seams for a light yet exceptionally warm drape.',
    price: 850,
    category: categoriesData[0],
    images: [
      {
        id: 'img-8-1',
        image: makeMedia(
          801,
          'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&q=80&w=800&h=1000',
          'Full Editorial Silhouette',
        ) as any,
      },
      {
        id: 'img-8-2',
        image: makeMedia(
          802,
          'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800&h=1000',
          'Walking Action Shot',
        ) as any,
      },
      {
        id: 'img-8-3',
        image: makeMedia(
          803,
          'https://images.unsplash.com/photo-1544923246-77307dd654ca?auto=format&fit=crop&q=80&w=800&h=1000',
          'Lapel & Material Detail',
        ) as any,
      },
      {
        id: 'img-8-4',
        image: makeMedia(
          804,
          'https://images.unsplash.com/photo-1534033345473-049842426315?auto=format&fit=crop&q=80&w=800&h=1000',
          'Back Profile',
        ) as any,
      },
      {
        id: 'img-8-5',
        image: makeMedia(
          805,
          'https://images.unsplash.com/photo-1479064566235-aa2745733280?auto=format&fit=crop&q=80&w=800&h=1000',
          'Hanger / Product Presentation',
        ) as any,
      },
    ],
    variants: makeVariants(['charcoal', 'sand'], ['s', 'm', 'l']) as any,
    updatedAt: now,
    createdAt: now,
  },
]

export const getRelatedProducts = (currentId: number, limit = 4): Product[] =>
  productsData.filter((p) => p.id !== currentId).slice(0, limit)
