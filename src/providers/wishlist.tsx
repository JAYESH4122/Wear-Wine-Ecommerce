'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Product } from '@/payload-types'

interface WishlistContextType {
  wishlist: Product[]
  wishlistCount: number
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist))
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

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => String(item.id) === String(product.id))
      if (exists) {
        return prev.filter((item) => String(item.id) !== String(product.id))
      } else {
        return [...prev, product]
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
