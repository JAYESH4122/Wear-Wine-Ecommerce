import { getPayload } from 'payload'
import config from '@/payload.config'
import './styles.css'
import { ProductListSection } from '@/app/components/product-list-section'
import { HeroSlider } from '@/app/components/hero-slider'
import { DepthDeckCarousel } from '../components/depth-card-carousel'
import { CollectionGallery } from '../components/collection-gallery'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: heroImages } = await payload.find({
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

  const carouselCards = carouselDocs.map((doc) => ({
    src: doc.url || '',
    title: doc.alt,
    description: 'Editorial Selection',
  }))

  return (
    <>
      {heroImages.length > 0 && <HeroSlider slides={heroImages} />}
      <CollectionGallery />
      <ProductListSection />
      <DepthDeckCarousel cards={carouselCards} />
    </>
  )
}
