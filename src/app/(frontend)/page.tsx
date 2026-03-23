import './styles.css'
import { ProductListSection } from '@/app/components/product-list-section'
import { HeroSlider } from '@/app/components/hero-slider'
import { DepthDeckCarousel } from '../components/depth-card-carousel'
import { CollectionGallery } from '../components/collection-gallery'
// import { HomeClient } from './home-client'
import { homeData } from '@/data/home'

export default async function HomePage() {
  const { heroSlides, carouselCards } = homeData

  return (
    <>
      {heroSlides.length > 0 && <HeroSlider slides={heroSlides} />}
      <CollectionGallery />
      <ProductListSection />
      <DepthDeckCarousel cards={carouselCards} />
    </>
  )
}
