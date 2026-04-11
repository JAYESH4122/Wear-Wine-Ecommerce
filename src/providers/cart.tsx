'use client'

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { getApiUrl } from '@/lib/api/getApiUrl'
import type { Category, Color, Media, Product, Size } from '@/payload-types'
import { useAuth } from '@/providers/auth'

type CartImage = number | Media | string | { url?: string | null } | null | undefined

type RemoteCartItem = {
  cartItemId?: unknown
  product?: unknown
  quantity?: unknown
}

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
  cartItemId: string
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

const LOCAL_STORAGE_KEY = 'cart'

const CartContext = createContext<CartContextType | undefined>(undefined)

const readLocalCart = (): CartItem[] => {
  const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (!savedCart) return []

  try {
    const parsed = JSON.parse(savedCart) as unknown
    if (!Array.isArray(parsed)) return []

    return parsed
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
  } catch {
    return []
  }
}

const normalizeRemoteCartItems = (value: unknown): CartItem[] => {
  if (!Array.isArray(value)) return []

  return value
    .map((raw): CartItem | null => {
      const item = raw as RemoteCartItem
      const product = isCartProduct(item.product) ? toCartProduct(item.product) : null
      const quantity = typeof item.quantity === 'number' ? Math.max(1, Math.floor(item.quantity)) : null

      if (!product || !quantity) return null

      return {
        cartItemId:
          typeof item.cartItemId === 'string'
            ? item.cartItemId
            : `${String(product.id)}-no-color-no-size`,
        product,
        quantity,
      }
    })
    .filter(Boolean) as CartItem[]
}

const toServerCartItems = (items: CartItem[]) => {
  return items.map((item) => ({
    productId: item.product.id,
    quantity: item.quantity,
  }))
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isHydrated: isAuthHydrated } = useAuth()

  const [cart, setCart] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const skipNextRemoteSync = useRef(false)
  const hasLoadedRemoteCart = useRef(false)

  useEffect(() => {
    setCart(readLocalCart())
    setIsHydrated(true)
  }, [])

  const loadRemoteCart = React.useCallback(async () => {
    const API_URL = getApiUrl()

    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) return

      const data = (await response.json()) as { items?: unknown }
      skipNextRemoteSync.current = true
      setCart(normalizeRemoteCartItems(data.items))
    } finally {
      hasLoadedRemoteCart.current = true
    }
  }, [])

  useEffect(() => {
    if (!isHydrated || !isAuthHydrated) return

    if (!user) {
      hasLoadedRemoteCart.current = false
      setCart(readLocalCart())
      return
    }

    hasLoadedRemoteCart.current = false
    void loadRemoteCart()

    const handleMerged = () => {
      void loadRemoteCart()
    }

    window.addEventListener('commerce:merged', handleMerged)
    return () => {
      window.removeEventListener('commerce:merged', handleMerged)
    }
  }, [isHydrated, isAuthHydrated, user, loadRemoteCart])

  useEffect(() => {
    if (!isHydrated) return

    if (!user) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart))
      return
    }

    if (!hasLoadedRemoteCart.current) return

    if (skipNextRemoteSync.current) {
      skipNextRemoteSync.current = false
      return
    }

    const controller = new AbortController()
    const timeout = setTimeout(async () => {
      const API_URL = getApiUrl()

      await fetch(`${API_URL}/api/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: toServerCartItems(cart),
        }),
        credentials: 'include',
        signal: controller.signal,
      }).catch(() => undefined)
    }, 200)

    return () => {
      controller.abort()
      clearTimeout(timeout)
    }
  }, [cart, isHydrated, user])

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart])

  const subtotal = useMemo(
    () =>
      cart.reduce((acc, item) => {
        const price = item.product.salePrice || item.product.price
        return acc + price * item.quantity
      }, 0),
    [cart],
  )

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
