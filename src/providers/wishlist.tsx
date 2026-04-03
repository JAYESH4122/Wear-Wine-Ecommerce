'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Category, Media, Product } from '@/payload-types'

type WishlistImage = number | Media | string | { url?: string | null } | null | undefined

export type WishlistItem = {
  id: number | string
  name: string
  slug?: string | null
  category?: number | Category | null
  price: number
  salePrice?: number | null
  images: {
    image: WishlistImage
    id?: string | null
  }[]
}

const toWishlistItem = (product: Product | WishlistItem): WishlistItem => ({
  id: product.id,
  name: product.name,
  slug: product.slug ?? null,
  category: 'category' in product ? (product.category ?? null) : null,
  price: product.price,
  salePrice: product.salePrice ?? null,
  images: Array.isArray(product.images)
    ? product.images.map((img) => ({ image: img?.image ?? null, id: img?.id ?? null }))
    : [],
})

interface WishlistContextType {
  wishlist: WishlistItem[]
  wishlistCount: number
  isHydrated: boolean
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (product: Product | WishlistItem) => void
  removeFromWishlist: (productId: string) => void
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load items from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wishlist-items')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setWishlist(parsed)
      }
    } catch (e) {
      console.error('Failed to load wishlist:', e)
    }
    setIsHydrated(true)
  }, [])

  // Persist items to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('wishlist-items', JSON.stringify(wishlist))
    }
  }, [wishlist, isHydrated])

  const isInWishlist = (productId: string) =>
    wishlist.some((item) => String(item.id) === String(productId))

  const toggleWishlist = (product: Product | WishlistItem) => {
    const nextItem = toWishlistItem(product)
    setWishlist((prev) => {
      const exists = prev.some((i) => String(i.id) === String(nextItem.id))
      return exists ? prev.filter((i) => String(i.id) !== String(nextItem.id)) : [...prev, nextItem]
    })
  }

  const removeFromWishlist = (productId: string) =>
    setWishlist((prev) => prev.filter((i) => String(i.id) !== String(productId)))

  const clearWishlist = () => setWishlist([])

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isHydrated,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider')
  return context
}
