'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Product } from '@/types'

export type WishlistImage = string | { url?: string | null } | null | undefined

export type WishlistItem = {
  id: string
  name: string
  slug?: string | null
  price: number
  salePrice?: number | null
  images: {
    image: WishlistImage
    id?: string | null
  }[]
}

type UrlImage = { url?: string; alt?: string }
type ImageField = { image?: unknown; id?: string | null }

const isUrlImage = (value: unknown): value is UrlImage =>
  Boolean(value) && typeof value === 'object' && 'url' in (value as Record<string, unknown>)

const normalizeImages = (value: unknown): WishlistItem['images'] => {
  if (!Array.isArray(value)) return []

  if (value.length > 0 && isUrlImage(value[0])) {
    return (value as UrlImage[])
      .map((img) => (typeof img.url === 'string' ? { image: img.url } : null))
      .filter(Boolean) as WishlistItem['images']
  }

  return (value as ImageField[]).map((img) => ({
    image: (img as { image?: WishlistImage })?.image,
    id: typeof img?.id === 'string' ? img.id : null,
  }))
}

const toWishlistItem = (input: Product | WishlistItem): WishlistItem => {
  const base = input as Partial<WishlistItem> & Partial<Product>
  return {
    id: String(base.id ?? ''),
    name: String(base.name ?? ''),
    slug: typeof base.slug === 'string' ? base.slug : base.slug ?? null,
    price: typeof base.price === 'number' ? base.price : 0,
    salePrice: typeof base.salePrice === 'number' ? base.salePrice : base.salePrice ?? null,
    images: normalizeImages(base.images),
  }
}

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
  toggleWishlist: (product: Product | WishlistItem) => void
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
      } catch (_error) {
        // ignore corrupt storage
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
