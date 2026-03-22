'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Media, Product } from '@/payload-types'

type WishlistImage = number | Media | string | { url?: string | null } | null | undefined

export type WishlistItem = {
  id: number | string
  name: string
  slug?: string | null
  price: number
  salePrice?: number | null
  images: {
    image: WishlistImage
    id?: string | null
  }[]
}

const toWishlistItem = (product: WishlistItem): WishlistItem => ({
  id: product.id,
  name: product.name,
  slug: product.slug ?? null,
  price: product.price,
  salePrice: product.salePrice ?? null,
  images: Array.isArray(product.images)
    ? product.images.map((img) => ({
        image: img?.image,
        id: img?.id ?? null,
      }))
    : [],
})

const isWishlistItem = (value: unknown): value is WishlistItem => {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<WishlistItem>
  if (typeof item.id !== 'number' && typeof item.id !== 'string') return false
  if (typeof item.name !== 'string') return false
  if (typeof item.price !== 'number') return false
  if (!Array.isArray(item.images)) return false
  return true
}

interface WishlistContextType {
  wishlist: WishlistItem[]
  wishlistCount: number
  isHydrated: boolean
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (product: WishlistItem) => void
  removeFromWishlist: (productId: string) => void
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist) as unknown
        if (Array.isArray(parsed)) {
          setWishlist(parsed.filter(isWishlistItem).map(toWishlistItem))
        }
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage:', error)
      }
    }
    setIsHydrated(true)
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist))
    }
  }, [wishlist, isHydrated])

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => String(item.id) === productId)
  }

  const toggleWishlist = (product: Product | WishlistItem) => {
    const normalized = toWishlistItem(product)
    setWishlist((prev) => {
      const exists = prev.some((item) => String(item.id) === String(normalized.id))
      if (exists) {
        return prev.filter((item) => String(item.id) !== String(normalized.id))
      } else {
        return [...prev, normalized]
      }
    })
  }

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => String(item.id) !== productId))
  }

  const clearWishlist = () => {
    setWishlist([])
  }

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
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
