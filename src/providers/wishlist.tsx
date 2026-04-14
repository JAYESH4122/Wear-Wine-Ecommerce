'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

import { getApiUrl } from '@/lib/api/getApiUrl'
import type { Category, Color, Media, Product, Size } from '@/payload-types'
import { useAuth } from '@/providers/auth'
import { toCartProduct, type CartProduct } from './cart'

export interface WishlistItem extends CartProduct {
  selectedSize?: Size | null
  selectedColor?: Color | null
}

interface WishlistContextType {
  wishlist: WishlistItem[]
  wishlistCount: number
  isHydrated: boolean
  isLoading: boolean
  isInWishlist: (productId: string | number, sizeId?: string | number, colorId?: string | number) => boolean
  toggleWishlist: (product: Product | WishlistItem, size?: Size | null, color?: Color | null) => void
  removeFromWishlist: (productId: string) => void
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const LOCAL_STORAGE_KEY = 'wishlist-items-v2' // Versioned key to avoid conflicts with old data format

interface GuestWishlistItem {
  productId: string | number
  slug?: string | null
  sizeId?: string | number | null
  colorId?: string | number | null
}

const toWishlistItem = (
  obj: Product | CartProduct | { product: Product; selectedSize?: any; selectedColor?: any },
  size?: Size | null,
  color?: Color | null,
): WishlistItem => {
  if ('product' in obj && obj.product) {
    const product = obj.product
    const base = toCartProduct(product)

    // Attempt to find full size/color objects in variants if only IDs are provided
    let finalSize = size || null
    let finalColor = color || null

    if (!finalSize && obj.selectedSize) {
      const sizeId = typeof obj.selectedSize === 'object' ? obj.selectedSize.id : obj.selectedSize
      const found = product.variants?.find((v) => {
        const vSizeId = typeof v.size === 'object' && v.size ? v.size.id : v.size
        return String(vSizeId) === String(sizeId)
      })
      if (found && typeof found.size === 'object') finalSize = found.size as Size
    }

    if (!finalColor && obj.selectedColor) {
      const colorId = typeof obj.selectedColor === 'object' ? obj.selectedColor.id : obj.selectedColor
      const found = product.variants?.find((v) => {
        const vColorId = typeof v.color === 'object' && v.color ? v.color.id : v.color
        return String(vColorId) === String(colorId)
      })
      if (found && typeof found.color === 'object') finalColor = found.color as Color
    }

    return {
      ...base,
      selectedSize: finalSize,
      selectedColor: finalColor,
    }
  }

  const base = toCartProduct(obj as Product | CartProduct)
  return {
    ...base,
    selectedSize: size || (obj as WishlistItem).selectedSize || null,
    selectedColor: color || (obj as WishlistItem).selectedColor || null,
  }
}

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isHydrated: isAuthHydrated } = useAuth()
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const skipNextRemoteSync = useRef(false)
  const hasLoadedRemoteWishlist = useRef(false)
  const isInitialLoad = useRef(true)
  const isFetchingRemote = useRef(false)

  const hydrateGuestWishlist = React.useCallback(async (items: GuestWishlistItem[]) => {
    if (items.length === 0) return []
    const API_URL = getApiUrl()
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/api/wishlist/hydrate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            size: item.sizeId,
            color: item.colorId
          }))
        }),
      })

      if (!response.ok) return []

      const data = await response.json()
      return (data.items || []).map((item: any) => toWishlistItem(item))
    } catch (e) {
      console.error('Failed to hydrate guest wishlist', e)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial load from local storage
  useEffect(() => {
    const init = async () => {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Check if it's old format (full objects) or new format (minimal)
            const isMinimal = parsed[0] && 'productId' in parsed[0]
            if (isMinimal) {
              const hydrated = await hydrateGuestWishlist(parsed)
              setWishlist(hydrated)
            } else {
              // Backward compatibility for a short time or just clear it
              setWishlist(parsed.map((item: any) => toWishlistItem(item)))
            }
          }
        } catch (e) {
          console.error('Failed to parse wishlist from local storage', e)
        }
      }
      setIsHydrated(true)
      isInitialLoad.current = false
    }

    void init()
  }, [hydrateGuestWishlist])

  const loadRemoteWishlist = React.useCallback(async () => {
    const API_URL = getApiUrl()
    isFetchingRemote.current = true
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/api/wishlist`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) return

      const data = (await response.json()) as { items?: any[] }
      if (data.items) {
        const normalizedItems = data.items.map((item) => toWishlistItem(item))
        skipNextRemoteSync.current = true
        setWishlist(normalizedItems)
      }
    } finally {
      isFetchingRemote.current = false
      hasLoadedRemoteWishlist.current = true
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isHydrated || !isAuthHydrated) return

    if (!user) {
      // Guest mode - already loaded in initial useEffect
      hasLoadedRemoteWishlist.current = false
      return
    }

    // Logged in mode - fetch from server
    void loadRemoteWishlist()
  }, [isHydrated, isAuthHydrated, user, loadRemoteWishlist])

  useEffect(() => {
    if (!isHydrated || isInitialLoad.current) return

    if (!user) {
      const minimalItems: GuestWishlistItem[] = wishlist.map(item => ({
        productId: item.id,
        slug: item.slug,
        sizeId: item.selectedSize?.id || null,
        colorId: item.selectedColor?.id || null
      }))
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(minimalItems))
      return
    }

    // Don't sync while initial remote load is in-flight
    if (isFetchingRemote.current) return

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
          items: wishlist.map((item) => ({
            productId: item.id,
            size: item.selectedSize?.id || null,
            color: item.selectedColor?.id || null,
          })),
        }),
        credentials: 'include',
        signal: controller.signal,
      }).catch(() => undefined)
    }, 500)

    return () => {
      controller.abort()
      clearTimeout(timeout)
    }
  }, [wishlist, isHydrated, user])

  const toggleWishlist = (product: Product | WishlistItem, size?: Size | null, color?: Color | null) => {
    setWishlist((prev) => {
      const productId = 'id' in product ? product.id : (product as any).productId
      const sizeId = size ? size.id : (product as WishlistItem).selectedSize?.id || null
      const colorId = color ? color.id : (product as WishlistItem).selectedColor?.id || null

      const exists = prev.find(
        (item) =>
          String(item.id) === String(productId) &&
          String(item.selectedSize?.id || null) === String(sizeId) &&
          String(item.selectedColor?.id || null) === String(colorId),
      )

      if (exists) {
        return prev.filter((item) => item !== exists)
      }

      return [...prev, toWishlistItem(product as any, size, color)]
    })
  }

  const isInWishlist = (productId: string | number, sizeId?: string | number, colorId?: string | number) => {
    return wishlist.some(
      (item) =>
        String(item.id) === String(productId) &&
        (!sizeId || String(item.selectedSize?.id) === String(sizeId)) &&
        (!colorId || String(item.selectedColor?.id) === String(colorId)),
    )
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
        isLoading,
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
