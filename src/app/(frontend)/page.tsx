import { getPayload } from 'payload'
import config from '@/payload.config'
import './styles.css'
import { ProductListSection } from '@/app/components/product-list-section'
import { HeroSlider } from '@/app/components/hero-slider'
import { DepthDeckCarousel, type CarouselCard } from '../components/depth-card-carousel'
import { CollectionGallery } from '../components/collection-gallery'
import type { Media } from '@/payload-types'

export default async function HomePage() {
  const now = new Date().toISOString()
  const fallbackHeroImages: Media[] = [
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
      url: 'https://images.unsplash.com/photo-1529139513364-c05315530182?auto=format&fit=crop&q=80&w=1920&h=1080',
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

  const fallbackCarouselCards: CarouselCard[] = [
    {
      src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=480&h=650&fit=crop',
      title: 'Alpine Mystique',
      description: 'Editorial Selection',
    },
    {
      src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=480&h=650&fit=crop',
      title: 'Golden Solitude',
      description: 'Editorial Selection',
    },
    {
      src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=480&h=650&fit=crop',
      title: 'Ethereal Dawn',
      description: 'Editorial Selection',
    },
    {
      src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=480&h=650&fit=crop',
      title: 'Verdant Echoes',
      description: 'Editorial Selection',
    },
    {
      src: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=480&h=650&fit=crop',
      title: 'Midnight Harmony',
      description: 'Editorial Selection',
    },
    {
      src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=480&h=650&fit=crop',
      title: 'Urban Minimalism',
      description: 'Editorial Selection',
    },
  ]

  let heroImages: Media[] = []
  let carouselCards: CarouselCard[] = []

  if (process.env.PAYLOAD_SECRET) {
    try {
      const payloadConfig = await config
      const payload = await getPayload({ config: payloadConfig })

      const { docs: heroDocs } = await payload.find({
        collection: 'media',
        where: {
          type: { equals: 'hero' },
        },
        limit: 30,
      })

      const { docs: carouselDocs } = await payload.find({
        collection: 'media',
        where: {
          type: { equals: 'carousel' },
        },
        limit: 30,
      })

      heroImages = heroDocs
      carouselCards = carouselDocs.map((doc) => ({
        src: doc.url || '',
        title: doc.alt ?? undefined,
        description: 'Editorial Selection',
      }))
    } catch (error) {
      console.error('Failed to load homepage media:', error)
      heroImages = fallbackHeroImages
      carouselCards = fallbackCarouselCards
    }
  } else {
    heroImages = fallbackHeroImages
    carouselCards = fallbackCarouselCards
  }

  return (
    <>
      {heroImages.length > 0 && <HeroSlider slides={heroImages} />}
      <CollectionGallery />
      <ProductListSection />
      {carouselCards.length > 0 && <DepthDeckCarousel cards={carouselCards} />}
    </>
  )
}
