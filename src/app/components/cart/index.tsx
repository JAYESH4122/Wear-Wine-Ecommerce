'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  X,
  Truck,
  ShieldCheck,
  Tag,
  ShoppingBag,
  Minus,
  Plus,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Media, Product } from '@/payload-types'
import { useCart, type CartItem, type CartProduct } from '@/providers/cart'

// --- Shared Button Styles ---
const btnBase =
  'flex items-center justify-center transition-all duration-200 cursor-pointer'
const btnIcon = cn(
  btnBase,
  'w-10 h-10 text-neutral-500 border border-neutral-200 bg-white hover:border-neutral-400 hover:text-neutral-900',
)
const btnPrimary = cn(
  btnBase,
  'bg-neutral-900 text-white text-sm font-medium tracking-wide uppercase hover:bg-neutral-800',
)
const btnSecondary = cn(
  btnBase,
  'border border-neutral-200 text-neutral-700 text-sm font-medium hover:border-neutral-400',
)

// --- Quantity Selector ---
function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
}: {
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
}) {
  return (
    <div className="inline-flex items-center border border-neutral-200">
      <button
        onClick={onDecrease}
        disabled={quantity <= 1}
        className={cn(btnBase, 'w-9 h-9 text-neutral-500 hover:text-neutral-900 disabled:opacity-30')}
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-10 text-center text-sm font-medium tabular-nums">{quantity}</span>
      <button
        onClick={onIncrease}
        className={cn(btnBase, 'w-9 h-9 text-neutral-500 hover:text-neutral-900')}
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

// --- Cart Item Card ---
function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem
  onUpdateQuantity: (id: string, qty: number) => void
  onRemove: (id: string) => void
}) {
  const { product, quantity, selectedColor, selectedSize, cartItemId } = item
  const firstImage = product.images?.[0]?.image
  const imageUrl =
    typeof firstImage === 'string'
      ? firstImage
      : (firstImage as Media | null)?.url ?? null
  const price = product.salePrice || product.price
  const subtotal = price * quantity

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="group py-6 border-b border-neutral-100 last:border-b-0"
    >
      <div className="flex gap-5">
        {/* Image */}
        <div className="relative w-24 h-32 md:w-28 md:h-36 bg-neutral-50 overflow-hidden flex-shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-300">
              <ShoppingBag className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-neutral-900 truncate">{product.name}</h3>
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500">
                {selectedColor && (
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full border border-neutral-200"
                      style={{ backgroundColor: selectedColor.hex || '#ddd' }}
                    />
                    {selectedColor.name}
                  </span>
                )}
                {selectedSize && <span>Size: {selectedSize.label}</span>}
              </div>
              {/* Mobile price */}
              <div className="mt-2 md:hidden">
                <span className="text-base font-medium">${price.toFixed(2)}</span>
                {product.salePrice && (
                  <span className="ml-2 text-sm text-neutral-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => onRemove(cartItemId)}
              className="p-2 -m-2 text-neutral-400 hover:text-neutral-900 transition-colors"
              aria-label="Remove item"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom row */}
          <div className="mt-auto pt-4 flex items-center justify-between gap-4">
            <QuantitySelector
              quantity={quantity}
              onIncrease={() => onUpdateQuantity(cartItemId, quantity + 1)}
              onDecrease={() => onUpdateQuantity(cartItemId, quantity - 1)}
            />
            <div className="hidden md:block text-right">
              <p className="text-lg font-medium">${subtotal.toFixed(2)}</p>
              {quantity > 1 && <p className="text-sm text-neutral-500">${price.toFixed(2)} each</p>}
            </div>
            <p className="md:hidden text-base font-medium">${subtotal.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// --- Cart Items List ---
function CartItemsList({
  items,
  onUpdateQuantity,
  onRemove,
}: {
  items: CartItem[]
  onUpdateQuantity: (id: string, qty: number) => void
  onRemove: (id: string) => void
}) {
  return (
    <div>
      {/* Desktop header */}
      <div className="hidden md:grid grid-cols-12 pb-4 border-b border-neutral-200 text-xs font-medium uppercase tracking-wider text-neutral-500">
        <div className="col-span-7">Product</div>
        <div className="col-span-3 text-center">Quantity</div>
        <div className="col-span-2 text-right">Subtotal</div>
      </div>
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <CartItemCard
            key={item.cartItemId}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// --- Empty Cart ---
function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-20 h-20 bg-neutral-100 flex items-center justify-center mb-6">
        <ShoppingBag className="w-8 h-8 text-neutral-400" />
      </div>
      <h2 className="text-2xl font-light text-neutral-900 mb-3">Your cart is empty</h2>
      <p className="text-neutral-500 max-w-sm mb-8">
        Explore our collection and find something you&apos;ll love.
      </p>
      <Link href="/" className={cn(btnPrimary, 'px-10 py-4')}>
        Start Shopping
      </Link>
    </motion.div>
  )
}

// --- Recommendation Card ---
function RecommendationCard({
  product,
  onQuickAdd,
}: {
  product: CartProduct
  onQuickAdd: (p: CartProduct) => void
}) {
  const firstImage = product.images?.[0]?.image
  const imageUrl =
    typeof firstImage === 'string' ? firstImage : (firstImage as Media | null)?.url ?? null
  const price = product.salePrice || product.price

  return (
    <div className="group flex-shrink-0 w-44 md:w-52">
      <div className="relative aspect-[3/4] bg-neutral-50 overflow-hidden mb-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">
            <ShoppingBag className="w-6 h-6" />
          </div>
        )}
        <button
          onClick={() => onQuickAdd(product)}
          className="absolute bottom-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm flex items-center justify-center text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Quick add ${product.name}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <h4 className="text-sm font-medium text-neutral-900 truncate">{product.name}</h4>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-sm font-medium">${price.toFixed(2)}</span>
        {product.salePrice && (
          <span className="text-xs text-neutral-400 line-through">${product.price.toFixed(2)}</span>
        )}
      </div>
    </div>
  )
}

// --- Recommendations Slider ---
function CartRecommendations({
  products,
  onQuickAdd,
}: {
  products: CartProduct[]
  onQuickAdd: (p: CartProduct) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = useCallback((dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' })
  }, [])

  if (!products.length) return null

  return (
    <section className="mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-light tracking-tight">You May Also Like</h2>
        <div className="hidden md:flex items-center gap-1">
          <button onClick={() => scroll('left')} className={btnIcon} aria-label="Scroll left">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 2L4 6L8 10" />
            </svg>
          </button>
          <button onClick={() => scroll('right')} className={btnIcon} aria-label="Scroll right">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 2L8 6L4 10" />
            </svg>
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0"
        style={{ scrollbarWidth: 'none' }}
      >
        {products.map((p) => (
          <RecommendationCard key={p.id} product={p} onQuickAdd={onQuickAdd} />
        ))}
      </div>
    </section>
  )
}

// --- Cart Summary ---
function CartSummary({ subtotal, itemCount }: { subtotal: number; itemCount: number }) {
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  const discount = promoApplied ? subtotal * 0.1 : 0
  const taxable = subtotal - discount
  const tax = taxable * 0.08
  const total = taxable + tax

  const handleApply = () => {
    if (promoCode.trim()) setPromoApplied(true)
  }

  return (
    <div className="bg-neutral-50 p-6 md:p-8">
      <h2 className="text-lg font-medium mb-6">Order Summary</h2>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500">Subtotal ({itemCount} items)</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        <AnimatePresence>
          {promoApplied && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-between text-emerald-600"
            >
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                Discount (10%)
              </span>
              <span className="font-medium">-${discount.toFixed(2)}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between">
          <span className="text-neutral-500">Shipping</span>
          <span className="font-medium text-emerald-600">Free</span>
        </div>

        <div className="flex justify-between">
          <span className="text-neutral-500">Tax (8%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>

        <div className="pt-4 mt-4 border-t border-neutral-200">
          <div className="flex justify-between items-baseline">
            <span className="text-base font-medium">Total</span>
            <span className="text-xl font-semibold">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Promo */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">
          Promo Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter code"
            disabled={promoApplied}
            className="flex-1 bg-white border border-neutral-200 px-4 py-2.5 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 disabled:opacity-50"
          />
          <button
            onClick={handleApply}
            disabled={!promoCode.trim() || promoApplied}
            className={cn(
              btnBase,
              'px-4 py-2.5 text-sm font-medium',
              promoApplied
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50',
            )}
          >
            {promoApplied ? <Check className="w-4 h-4" /> : 'Apply'}
          </button>
        </div>
      </div>

      {/* Checkout */}
      <button className={cn(btnPrimary, 'w-full mt-6 py-4')}>Proceed to Checkout</button>

      <Link
        href="/"
        className="block w-full text-center mt-3 py-3 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        Continue Shopping
      </Link>

      {/* Trust badges */}
      <div className="mt-6 pt-6 border-t border-neutral-200 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Truck className="w-4 h-4" />
          Free Shipping
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <ShieldCheck className="w-4 h-4" />
          Secure Checkout
        </div>
      </div>
    </div>
  )
}

// --- Main Cart Page ---
export function CartPage() {
  const { cart, cartCount, removeItem, updateQuantity, subtotal, addItem } = useCart()
  const [recommendations, setRecommendations] = useState<CartProduct[]>([])

  const handleQuickAdd = useCallback(
    (product: CartProduct) => addItem(product, 1),
    [addItem],
  )

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      try {
        const res = await fetch('/api/products?limit=12', { signal: controller.signal })
        if (!res.ok) return
        const data = (await res.json()) as { docs?: Product[] }
        const docs = data?.docs ?? []

        const mapped: CartProduct[] = docs
          .filter((p) => p?.id && p?.name && typeof p?.price === 'number')
          .slice(0, 8)
          .map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug ?? null,
            price: p.price,
            salePrice: p.salePrice ?? null,
            images: p.images?.map((img) => ({ image: img?.image, id: img?.id ?? null })) ?? [],
          }))

        setRecommendations(mapped)
      } catch {
        // ignore
      }
    }
    load()
    return () => controller.abort()
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Continue Shopping</span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-light tracking-tight">
            Your Cart
            {cartCount > 0 && (
              <span className="ml-4 text-2xl md:text-3xl text-neutral-400">
                ({cartCount} {cartCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </h1>
        </div>

        {cartCount === 0 ? (
          <>
            <EmptyCart />
            <CartRecommendations products={recommendations} onQuickAdd={handleQuickAdd} />
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-7 xl:col-span-8">
                <CartItemsList items={cart} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
              </div>
              <div className="lg:col-span-5 xl:col-span-4">
                <div className="lg:sticky lg:top-8">
                  <CartSummary subtotal={subtotal} itemCount={cartCount} />
                </div>
              </div>
            </div>
            <CartRecommendations products={recommendations} onQuickAdd={handleQuickAdd} />
          </>
        )}
      </div>
    </main>
  )
}