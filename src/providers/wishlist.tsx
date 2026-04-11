'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

import { getApiUrl } from '@/lib/api/getApiUrl'
import type { Category, Media, Product } from '@/payload-types'
import { useAuth } from '@/providers/auth'

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
  category: 'category' in product ? product.category ?? null : null,
  price: product.price,
  salePrice: product.salePrice ?? null,
  images: Array.isArray(product.images)
    ? product.images.map((img) => ({ image: img?.image ?? null, id: img?.id ?? null }))
    : [],
})

const isWishlistItem = (value: unknown): value is WishlistItem => {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Partial<WishlistItem>
  if (typeof candidate.id !== 'number' && typeof candidate.id !== 'string') return false
  if (typeof candidate.name !== 'string') return false
  if (typeof candidate.price !== 'number') return false
  if (!Array.isArray(candidate.images)) return false

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

const LOCAL_STORAGE_KEY = 'wishlist-items'

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const readLocalWishlist = (): WishlistItem[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!saved) return []

    const parsed = JSON.parse(saved) as unknown
    if (!Array.isArray(parsed)) return []

    return parsed
      .map((item) => (isWishlistItem(item) ? toWishlistItem(item) : null))
      .filter(Boolean) as WishlistItem[]
  } catch {
    return []
  }
}

const normalizeRemoteWishlist = (value: unknown): WishlistItem[] => {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => (isWishlistItem(item) ? toWishlistItem(item) : null))
    .filter(Boolean) as WishlistItem[]
}

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isHydrated: isAuthHydrated } = useAuth()

  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const skipNextRemoteSync = useRef(false)
  const hasLoadedRemoteWishlist = useRef(false)

  useEffect(() => {
    setWishlist(readLocalWishlist())
    setIsHydrated(true)
  }, [])

  const loadRemoteWishlist = React.useCallback(async () => {
    const API_URL = getApiUrl()
    try {
      const response = await fetch(`${API_URL}/api/wishlist`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) return

      const data = (await response.json()) as { items?: unknown }
      skipNextRemoteSync.current = true
      setWishlist(normalizeRemoteWishlist(data.items))
    } finally {
      hasLoadedRemoteWishlist.current = true
    }
  }, [])

  useEffect(() => {
    if (!isHydrated || !isAuthHydrated) return

    if (!user) {
      hasLoadedRemoteWishlist.current = false
      setWishlist(readLocalWishlist())
      return
    }

    hasLoadedRemoteWishlist.current = false
    void loadRemoteWishlist()

    const handleMerged = () => {
      void loadRemoteWishlist()
    }

    window.addEventListener('commerce:merged', handleMerged)
    return () => {
      window.removeEventListener('commerce:merged', handleMerged)
    }
  }, [isHydrated, isAuthHydrated, user, loadRemoteWishlist])

  useEffect(() => {
    if (!isHydrated) return

    if (!user) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishlist))
      return
    }

    if (!hasLoadedRemoteWishlist.current) return

    if (skipNextRemoteSync.current) {
      skipNextRemoteSync.current = false
      return
    }

    const controller = new AbortController()
    const timeout = setTimeout(async () => {
      const API_URL = getApiUrl()

      await fetch(`${API_URL}/api/wishlist`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productIds: wishlist.map((item) => item.id),
        }),
        credentials: 'include',
        signal: controller.signal,
      }).catch(() => undefined)
    }, 200)

    return () => {
      controller.abort()
      clearTimeout(timeout)
    }
  }, [wishlist, isHydrated, user])

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
