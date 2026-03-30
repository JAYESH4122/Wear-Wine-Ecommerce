import React from 'react'
import './global.css'
import { Anton, Bricolage_Grotesque, DM_Sans } from 'next/font/google'
import { WishlistProvider } from '@/providers/wishlist'
import { CartProvider } from '@/providers/cart'
import { AuthProvider } from '@/providers/auth'
import { Header } from '@/app/components/Header'
import type { CategoryItem } from '@/app/components/Header/data'
import { Footer } from '@/app/components/footer'
import { getHeaderCategories } from '@/lib/data/categories'
import { getGlobal } from '@/lib/api/cms'
import { Header as HeaderType, Footer as FooterType, SiteSetting as SiteSettingsType } from '@/payload-types'


const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const sans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const anton = Anton({
  subsets: ['latin'],
  variable: '--font-anton',
  weight: ['400'],
})

export async function generateMetadata() {
  const siteSettings = await getGlobal<SiteSettingsType>('site-settings')

  return {
    title: siteSettings?.seo?.title || siteSettings?.siteName || 'Wear Wine',
    description: siteSettings?.seo?.description || 'Premium E-commerce experience',
    icons: {
      icon: (siteSettings?.logo as any)?.url || '/favicon.ico',
    },
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  const categoryItems = await getHeaderCategories()
  
  const headerData = await getGlobal<HeaderType>('header')
  const footerData = await getGlobal<FooterType>('footer')
  const siteSettings = await getGlobal<SiteSettingsType>('site-settings')

  return (
    <html lang="en" className={`${bricolage.variable} ${sans.variable} ${anton.variable}`} suppressHydrationWarning>
      <body className="antialiased font-bricolage overflow-x-hidden" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Header categories={categoryItems} cmsData={headerData} siteSettings={siteSettings} />
              <main id="main-content" tabIndex={-1}>
                {children}
              </main>
              <Footer cmsData={footerData} siteSettings={siteSettings} />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
