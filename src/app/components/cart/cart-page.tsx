'use client'

import { useEffect, useState } from 'react'
import { CartHeader } from './cart-header'
import { CartItemsList } from './cart-items-list'
import { CartSummary } from './cart-summary'
import { CartRecommendations } from './cart-recommendations'
import { EmptyCart } from './empty-cart'
import type { CartProduct } from '@/providers/cart'
import { useCart } from '@/providers/cart'
import type { Product } from '@/payload-types'

export function CartPage() {
  const { cart, cartCount, removeItem, updateQuantity, subtotal, addItem } = useCart()
  const [recommendations, setRecommendations] = useState<CartProduct[]>([])

  const handleQuickAdd = (product: CartProduct) => {
    addItem(product, 1)
  }

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch('/api/products?limit=12')
        if (!res.ok) return
        const data = (await res.json()) as { docs?: Product[] }
        const docs = Array.isArray(data?.docs) ? data.docs : []

        const mapped: CartProduct[] = docs
          .filter(
            (p) =>
              typeof p?.id === 'number' &&
              typeof p?.name === 'string' &&
              typeof p?.price === 'number',
          )
          .slice(0, 8)
          .map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug ?? null,
            price: p.price,
            salePrice: p.salePrice ?? null,
            images: Array.isArray(p.images)
              ? p.images.map((img) => ({ image: img?.image, id: img?.id ?? null }))
              : [],
          }))

        if (!cancelled) setRecommendations(mapped)
      } catch {
        // ignore
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <CartHeader itemCount={cartCount} />

        {cartCount === 0 ? (
          <>
            <EmptyCart />
            {recommendations.length > 0 && (
              <CartRecommendations products={recommendations} onQuickAdd={handleQuickAdd} />
            )}
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-7 xl:col-span-8">
                <CartItemsList
                  items={cart}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              </div>
              <div className="lg:col-span-5 xl:col-span-4">
                <div className="lg:sticky lg:top-8">
                  <CartSummary subtotal={subtotal} itemCount={cartCount} />
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <CartRecommendations products={recommendations} onQuickAdd={handleQuickAdd} />
            )}
          </>
        )}
      </div>
    </main>
  )
}
