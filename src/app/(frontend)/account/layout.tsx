import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Header } from '@/app/components/Header'
import { Footer } from '@/app/components/footer'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

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
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header categories={categoryItems} />
      <div className="flex-1 container mx-auto px-4 lg:px-6 py-12 pb-24">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* We handle a dynamic sidebar inside the pages or a client component later, but here is the main content root */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
