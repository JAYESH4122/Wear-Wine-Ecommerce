import { getPayload } from 'payload'
import config from '@/payload.config'
import './styles.css'
import { ProductListSection } from '@/app/components/product-list-section'
import { Header } from '@/app/components/Header'
import { HeroSlider } from '@/app/components/hero-slider'
import { Footer } from '@/app/components/footer'
import { DepthDeckCarousel } from '../components/depth-card-carousel'
import { ContactSection } from '../components/contact-section'
import { AboutSection } from '../components/about-section'

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

  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 100,
  })

  const categoryItems = await Promise.all(
    categories.map(async (category) => {
      const { totalDocs } = await payload.find({
        collection: 'products',
        where: { category: { equals: category.id } },
        limit: 0,
      })

      return {
        name: category.name,
        href: `/category/${category.slug}`,
        count: totalDocs,
      }
    }),
  )

  return (
    <>
      <Header categories={categoryItems} />
      {heroImages.length > 0 && <HeroSlider slides={heroImages} />}
      <ProductListSection />
      <DepthDeckCarousel cards={carouselCards} />
      <AboutSection />
      <ContactSection />
      <Footer />
    </>
  )
}
