import React from 'react'
import './global.css'
import { Bricolage_Grotesque } from 'next/font/google'
import { WishlistProvider } from '@/providers/wishlist'
import { CartProvider } from '@/providers/cart'
import { AuthProvider } from '@/providers/auth'
import { Header } from '@/app/components/Header'
import { Footer } from '@/app/components/footer'
import { headerCategoryItems } from '@/data/header-categories'
import { rootLayoutMetadata } from '@/data/site'

export const metadata = rootLayoutMetadata

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={bricolage.variable} suppressHydrationWarning>
      <body className="antialiased font-bricolage overflow-x-hidden" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Header categories={headerCategoryItems} />
              <main>{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
