'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Category, Media, Product } from '@/payload-types'
import { productsData } from '@/data/products'

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

// Resolve IDs → full WishlistItem from productsData
const resolveIds = (ids: (number | string)[]): WishlistItem[] =>
  ids
    .map((id) => productsData.find((p) => String(p.id) === String(id)))
    .filter(Boolean)
    .map((p) => toWishlistItem(p as Product))

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
  const [ids, setIds] = useState<(number | string)[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load IDs from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wishlist-ids')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setIds(parsed)
      }
    } catch (e) {
      console.error('Failed to load wishlist:', e)
    }
    setIsHydrated(true)
  }, [])

  // Persist IDs to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('wishlist-ids', JSON.stringify(ids))
    }
  }, [ids, isHydrated])

  // Derive full wishlist items from IDs + productsData
  const wishlist = resolveIds(ids)

  const isInWishlist = (productId: string) => ids.some((id) => String(id) === productId)

  const toggleWishlist = (product: Product | WishlistItem) => {
    const id = product.id
    setIds((prev) => {
      const exists = prev.some((i) => String(i) === String(id))
      return exists ? prev.filter((i) => String(i) !== String(id)) : [...prev, id]
    })
  }

  const removeFromWishlist = (productId: string) =>
    setIds((prev) => prev.filter((i) => String(i) !== productId))

  const clearWishlist = () => setIds([])

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
