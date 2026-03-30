import './styles.css'
import { ProductListSection } from '@/app/components/product-list-section'
import { HeroSlider } from '@/app/components/hero-slider'
import { DepthDeckCarousel } from '../components/depth-card-carousel'
import { CollectionGallery } from '../components/collection-gallery'
import { getHeroData } from '@/lib/data/hero'
import { getCarouselData } from '@/lib/data/carousel'
import { getCollectionImages } from '@/lib/data/collection'

export default async function HomePage() {
  const heroImages = await getHeroData()
  const carouselCards = await getCarouselData()
  const galleryImages = await getCollectionImages()

  return (
    <>
      {heroImages.length > 0 && <HeroSlider slides={heroImages} />}
      <CollectionGallery images={galleryImages} />
      <ProductListSection />
      {carouselCards.length > 0 && <DepthDeckCarousel cards={carouselCards} />}
    </>
  )
}

