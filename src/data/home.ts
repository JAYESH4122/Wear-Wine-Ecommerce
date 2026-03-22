import { HeroSlide, CarouselCard } from '../types'
import { seedCarouselImages, seedHeroImages } from '@/seed/data'

export const heroSlides: HeroSlide[] = seedHeroImages

export const carouselCards: CarouselCard[] = seedCarouselImages.map((img) => ({
  src: img.url,
  title: img.alt,
  description: 'Editorial Selection',
}))

export const homeData = {
  heroSlides,
  carouselCards,
}
