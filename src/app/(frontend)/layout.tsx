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
import { getHeaderCategories } from '@/lib/data/categories'

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

  const categoryItems = await getHeaderCategories()

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
