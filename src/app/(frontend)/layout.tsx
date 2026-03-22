import React from 'react'
import './global.css'
import { Bricolage_Grotesque } from 'next/font/google'
import { WishlistProvider } from '@/providers/wishlist'
import { CartProvider } from '@/providers/cart'
import { AuthProvider } from '@/providers/auth'
import { Header } from '@/app/components/Header'
import type { CategoryItem } from '@/app/components/Header/data'
import { Footer } from '@/app/components/footer'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  // Fetch categories for the Header navigation when Payload is configured.
  const categoryItems: CategoryItem[] = []

  if (process.env.PAYLOAD_SECRET) {
    try {
      const payloadConfig = await config
      const payload = await getPayload({ config: payloadConfig })

      const { docs: categories } = await payload.find({
        collection: 'categories',
        limit: 100,
      })

      const items = await Promise.all(
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

      categoryItems.push(...items)
    } catch (error) {
      console.error('Failed to load categories for header:', error)
    }
  }

  return (
    <html lang="en" className={bricolage.variable} suppressHydrationWarning>
      <body className="antialiased font-bricolage overflow-x-hidden" suppressHydrationWarning>
 
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Header categories={categoryItems} />
              <main>{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
