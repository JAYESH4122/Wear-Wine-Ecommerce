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
  isInWishlist: (productId: string | number, sizeId?: string | number, colorId?: string | number) => boolean
  toggleWishlist: (product: Product | WishlistItem, size?: Size | null, color?: Color | null) => void
  removeFromWishlist: (productId: string) => void
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const LOCAL_STORAGE_KEY = 'wishlist-items'

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
  const skipNextRemoteSync = useRef(false)
  const hasLoadedRemoteWishlist = useRef(false)

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      try {
        setWishlist(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse wishlist from local storage', e)
      }
    }
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

      const data = (await response.json()) as { items?: any[] }
      if (data.items) {
        const normalizedItems = data.items.map((item) => toWishlistItem(item))
        skipNextRemoteSync.current = true
        setWishlist(normalizedItems)
      }
    } finally {
      hasLoadedRemoteWishlist.current = true
    }
  }, [])

  useEffect(() => {
    if (!isHydrated || !isAuthHydrated) return

    if (!user) {
      hasLoadedRemoteWishlist.current = false
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (saved) {
        try {
          setWishlist(JSON.parse(saved))
        } catch {}
      }
      return
    }

    void loadRemoteWishlist()
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
