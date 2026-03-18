import React from 'react'
import './global.css'
import { Bricolage_Grotesque } from 'next/font/google'
import { WishlistProvider } from '@/providers/wishlist'
import { CartProvider } from '@/providers/cart'

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

  return (
    <html lang="en" className={bricolage.variable}>
      <body>
        <CartProvider>
          <WishlistProvider>
            <main>{children}</main>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
}
