import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'
import { ProductListSection } from '@/app/components/product-list-section'
import { Header } from '@/app/components/Header'
import { HeroSlider } from '@/app/components/hero-slider'
import { Footer } from '@/app/components/footer'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: heroImages } = await payload.find({
    collection: 'media',
    limit: 30,
  })

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
      <Footer />
    </>
  )
}
