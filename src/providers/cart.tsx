'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Category, Color, Media, Product, Size } from '@/payload-types'

type CartImage = number | Media | string | { url?: string | null } | null | undefined

export type CartProduct = {
  id: number | string
  name: string
  slug?: string | null
  category?: number | Category | null
  price: number
  salePrice?: number | null
  variants?: Product['variants'] | null
  images: {
    image: CartImage
    id?: string | null
  }[]
}

const toCartProduct = (product: Product | CartProduct): CartProduct => ({
  id: product.id,
  name: product.name,
  slug: product.slug ?? null,
  category: 'category' in product ? product.category ?? null : null,
  price: product.price,
  salePrice: product.salePrice ?? null,
  variants: 'variants' in product ? product.variants ?? null : null,
  images: Array.isArray(product.images)
    ? product.images.map((img) => ({
        image: img?.image,
        id: img?.id ?? null,
      }))
    : [],
})

const isCartProduct = (value: unknown): value is CartProduct => {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<CartProduct>
  if (typeof item.id !== 'number' && typeof item.id !== 'string') return false
  if (typeof item.name !== 'string') return false
  if (typeof item.price !== 'number') return false
  if (!Array.isArray(item.images)) return false
  return true
}

export interface CartItem {
  cartItemId: string // Unique ID for this specific combination (productId-colorId-sizeId)
  product: CartProduct
  quantity: number
  selectedColor?: Color
  selectedSize?: Size
}

interface CartContextType {
  cart: CartItem[]
  cartCount: number
  isHydrated: boolean
  addItem: (product: Product | CartProduct, quantity?: number, color?: Color, size?: Size) => void
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart) as unknown
        if (Array.isArray(parsed)) {
          const normalized = parsed
            .map((raw): CartItem | null => {
              if (!raw || typeof raw !== 'object') return null
              const candidate = raw as Partial<CartItem> & { product?: unknown }

              const cartItemId = typeof candidate.cartItemId === 'string' ? candidate.cartItemId : null
              const quantity = typeof candidate.quantity === 'number' ? candidate.quantity : null
              const product = isCartProduct(candidate.product) ? toCartProduct(candidate.product) : null

              if (!cartItemId || !quantity || quantity <= 0 || !product) return null

              return {
                cartItemId,
                quantity,
                product,
                selectedColor: candidate.selectedColor,
                selectedSize: candidate.selectedSize,
              }
            })
            .filter(Boolean) as CartItem[]

          setCart(normalized)
        }
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
      }
    }
    setIsHydrated(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, isHydrated])

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  const subtotal = cart.reduce((acc, item) => {
    const price = item.product.salePrice || item.product.price
    return acc + price * item.quantity
  }, 0)

  const addItem = (product: Product | CartProduct, quantity = 1, color?: Color, size?: Size) => {
    const normalizedProduct = toCartProduct(product)
    const cartItemId = `${normalizedProduct.id}-${color?.id || 'no-color'}-${size?.id || 'no-size'}`

    setCart((prev) => {
      const existingItem = prev.find((item) => item.cartItemId === cartItemId)

      if (existingItem) {
        return prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }

      return [
        ...prev,
        {
          cartItemId,
          product: normalizedProduct,
          quantity,
          selectedColor: color,
          selectedSize: size,
        },
      ]
    })
  }

  const removeItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId))
  }

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId)
      return
    }

    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item)),
    )
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isHydrated,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
