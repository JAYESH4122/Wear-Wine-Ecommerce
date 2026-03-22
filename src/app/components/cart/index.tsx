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
  Package,
  RotateCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Media, Product } from '@/payload-types'
import { useCart, type CartItem, type CartProduct } from '@/providers/cart'

const btnBase = 'flex items-center justify-center transition-all duration-200 cursor-pointer'
const btnPrimary = cn(
  btnBase,
  'bg-neutral-900 text-white text-sm font-medium tracking-wide uppercase hover:bg-neutral-800',
)

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
    <div className="inline-flex items-center border border-neutral-200 rounded-sm">
      <button
        onClick={onDecrease}
        disabled={quantity <= 1}
        className={cn(
          btnBase,
          'w-9 h-9 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors',
        )}
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-10 text-center text-sm font-medium text-neutral-900 tabular-nums select-none">
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        className={cn(
          btnBase,
          'w-9 h-9 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors',
        )}
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

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
    typeof firstImage === 'string' ? firstImage : ((firstImage as Media | null)?.url ?? null)

  const hasDiscount = product.salePrice != null && product.salePrice < product.price
  const currentPrice = hasDiscount ? product.salePrice! : product.price
  const subtotal = currentPrice * quantity
  const savings = hasDiscount ? (product.price - product.salePrice!) * quantity : 0

  const categoryName =
    typeof product.category === 'object' && (product as any).category?.name
      ? (product as any).category.name
      : null

  const variantStock = (product as any).variants?.find((v: any) => {
    const colorMatch = selectedColor
      ? typeof v.color === 'object'
        ? v.color?.id === selectedColor.id
        : v.color === selectedColor.id
      : true
    const sizeMatch = selectedSize
      ? typeof v.size === 'object'
        ? v.size?.id === selectedSize.id
        : v.size === selectedSize.id
      : true
    return colorMatch && sizeMatch
  })
  const stock = variantStock?.stock ?? null
  const sku = variantStock?.sku ?? product.id.toString().slice(-8).toUpperCase()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      className="group py-6 border-b border-neutral-100 last:border-b-0"
    >
      {/* Mobile layout */}
      <div className="flex gap-4 md:hidden">
        <Link
          href={product.slug ? `/products/${product.slug}` : '#'}
          className="relative w-28 h-36 bg-neutral-50 overflow-hidden flex-shrink-0 rounded-sm"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="112px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-300">
              <ShoppingBag className="w-6 h-6" />
            </div>
          )}
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
              Sale
            </div>
          )}
        </Link>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              {categoryName && (
                <p className="text-[11px] text-neutral-400 uppercase tracking-wide mb-0.5">
                  {categoryName}
                </p>
              )}
              <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                <h3 className="text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors leading-snug">
                  {product.name}
                </h3>
              </Link>
              <p className="mt-0.5 text-[11px] text-neutral-400 font-mono">SKU: {sku}</p>
            </div>
            <button
              onClick={() => onRemove(cartItemId)}
              className="p-1.5 -m-1.5 text-neutral-400 hover:text-red-500 transition-colors flex-shrink-0"
              aria-label="Remove item"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2 space-y-1">
            {selectedColor && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-neutral-400">Color:</span>
                <span
                  className="w-3 h-3 rounded-full border border-neutral-200 shadow-sm"
                  style={{ backgroundColor: selectedColor.hex || '#ddd' }}
                />
                <span className="text-neutral-700">{selectedColor.name}</span>
              </div>
            )}
            {selectedSize && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-neutral-400">Size:</span>
                <span className="text-neutral-700 font-medium">{selectedSize.label}</span>
              </div>
            )}
            {stock !== null && (
              <div className="flex items-center gap-1.5 text-xs">
                <span
                  className={cn(
                    'font-medium',
                    stock > 10 ? 'text-emerald-600' : stock > 0 ? 'text-amber-600' : 'text-red-600',
                  )}
                >
                  {stock > 10 ? 'In Stock' : stock > 0 ? `Only ${stock} left` : 'Out of Stock'}
                </span>
              </div>
            )}
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span className="text-neutral-400">Price:</span>
            <span className="text-neutral-900 font-medium text-sm">${currentPrice.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-neutral-400 line-through">${product.price.toFixed(2)}</span>
            )}
          </div>

          <div className="mt-3 flex items-end justify-between gap-2">
            <div>
              <p className="text-[11px] text-neutral-400 uppercase tracking-wide mb-1.5">
                Quantity
              </p>
              <QuantitySelector
                quantity={quantity}
                onIncrease={() => onUpdateQuantity(cartItemId, quantity + 1)}
                onDecrease={() => onUpdateQuantity(cartItemId, Math.max(1, quantity - 1))}
              />
            </div>
            <div className="text-right">
              <p className="text-[11px] text-neutral-400 uppercase tracking-wide mb-1">Subtotal</p>
              <p className="text-base font-semibold text-neutral-900">${subtotal.toFixed(2)}</p>
              {hasDiscount && savings > 0 && (
                <p className="text-[11px] text-emerald-600 mt-0.5">Save ${savings.toFixed(2)}</p>
              )}
              {quantity > 1 && (
                <p className="text-[11px] text-neutral-400">
                  ${currentPrice.toFixed(2)} × {quantity}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:grid grid-cols-12 gap-4 items-start">
        <div className="col-span-6 flex gap-5">
          <Link
            href={product.slug ? `/products/${product.slug}` : '#'}
            className="relative w-36 h-44 bg-neutral-50 overflow-hidden flex-shrink-0 rounded-sm"
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="144px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-300">
                <ShoppingBag className="w-6 h-6" />
              </div>
            )}
            {hasDiscount && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                Sale
              </div>
            )}
          </Link>

          <div className="flex flex-col justify-center min-w-0 py-1">
            {categoryName && (
              <p className="text-xs text-neutral-400 uppercase tracking-wide mb-0.5">
                {categoryName}
              </p>
            )}
            <Link href={product.slug ? `/products/${product.slug}` : '#'}>
              <h3 className="text-base font-medium text-neutral-900 hover:text-neutral-600 transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="mt-1 text-xs text-neutral-400 font-mono">SKU: {sku}</p>

            <div className="mt-2.5 space-y-1.5">
              {selectedColor && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-500 w-10 shrink-0">Color</span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-neutral-200 shadow-sm"
                      style={{ backgroundColor: selectedColor.hex || '#ddd' }}
                    />
                    <span className="text-neutral-800">{selectedColor.name}</span>
                  </span>
                </div>
              )}
              {selectedSize && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-500 w-10 shrink-0">Size</span>
                  <span className="text-neutral-800 font-medium">{selectedSize.label}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-neutral-500 w-10 shrink-0">Price</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-neutral-900 font-medium">${currentPrice.toFixed(2)}</span>
                  {hasDiscount && (
                    <span className="text-xs text-neutral-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </span>
              </div>
              {stock !== null && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-500 w-10 shrink-0">Stock</span>
                  <span
                    className={cn(
                      'font-medium text-xs',
                      stock > 10
                        ? 'text-emerald-600'
                        : stock > 0
                          ? 'text-amber-600'
                          : 'text-red-600',
                    )}
                  >
                    {stock > 10 ? 'In Stock' : stock > 0 ? `Only ${stock} left` : 'Out of Stock'}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => onRemove(cartItemId)}
              className="mt-3 self-start flex items-center gap-1.5 text-xs text-neutral-400 hover:text-red-500 transition-colors"
              aria-label="Remove item"
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        </div>

        <div className="col-span-3 flex flex-col items-center pt-10">
          <QuantitySelector
            quantity={quantity}
            onIncrease={() => onUpdateQuantity(cartItemId, quantity + 1)}
            onDecrease={() => onUpdateQuantity(cartItemId, Math.max(1, quantity - 1))}
          />
        </div>

        <div className="col-span-3 flex flex-col items-end pt-10">
          <p className="text-lg font-semibold text-neutral-900">${subtotal.toFixed(2)}</p>
          {hasDiscount && savings > 0 && (
            <p className="text-xs text-emerald-600 mt-0.5">Save ${savings.toFixed(2)}</p>
          )}
          {quantity > 1 && (
            <p className="text-xs text-neutral-400 mt-0.5">
              ${currentPrice.toFixed(2)} × {quantity}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

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
      <div className="hidden md:grid grid-cols-12 pb-4 border-b border-neutral-200 text-xs font-medium uppercase tracking-wider text-neutral-500">
        <div className="col-span-6">Product</div>
        <div className="col-span-3 text-center">Quantity</div>
        <div className="col-span-3 text-right">Subtotal</div>
      </div>
      <AnimatePresence mode="popLayout" initial={false}>
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

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
        <ShoppingBag className="w-8 h-8 text-neutral-400" />
      </div>
      <h2 className="text-2xl font-light text-neutral-900 mb-3">Your cart is empty</h2>
      <p className="text-neutral-500 max-w-sm mb-8">
        Explore our collection and find something you&apos;ll love.
      </p>
      <Link href="/" className={cn(btnPrimary, 'px-10 py-4 rounded-sm')}>
        Start Shopping
      </Link>
    </motion.div>
  )
}

function RecommendationCard({
  product,
  onQuickAdd,
}: {
  product: CartProduct
  onQuickAdd: (p: CartProduct) => void
}) {
  const firstImage = product.images?.[0]?.image
  const imageUrl =
    typeof firstImage === 'string' ? firstImage : ((firstImage as Media | null)?.url ?? null)
  const hasDiscount = product.salePrice != null && product.salePrice < product.price
  const price = hasDiscount ? product.salePrice! : product.price

  return (
    <div className="group flex-shrink-0 w-44 md:w-52">
      <div className="relative aspect-[3/4] bg-neutral-50 overflow-hidden mb-3 rounded-sm">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 176px, 208px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">
            <ShoppingBag className="w-6 h-6" />
          </div>
        )}
        <button
          onClick={() => onQuickAdd(product)}
          className="absolute bottom-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-900 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
          aria-label={`Quick add ${product.name}`}
        >
          <Plus className="w-4 h-4" />
        </button>
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
            Sale
          </div>
        )}
      </div>
      <h4 className="text-sm font-medium text-neutral-900 truncate">{product.name}</h4>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-sm font-medium text-neutral-900">${price.toFixed(2)}</span>
        {hasDiscount && (
          <span className="text-xs text-neutral-400 line-through">${product.price.toFixed(2)}</span>
        )}
      </div>
    </div>
  )
}

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
        <h2 className="text-xl font-light tracking-tight text-neutral-900">You May Also Like</h2>
        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={() => scroll('left')}
            className={cn(
              btnBase,
              'w-10 h-10 text-neutral-500 border border-neutral-200 bg-white hover:border-neutral-400 hover:text-neutral-900 rounded-full',
            )}
            aria-label="Scroll left"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M8 2L4 6L8 10" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className={cn(
              btnBase,
              'w-10 h-10 text-neutral-500 border border-neutral-200 bg-white hover:border-neutral-400 hover:text-neutral-900 rounded-full',
            )}
            aria-label="Scroll right"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M4 2L8 6L4 10" />
            </svg>
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((p) => (
          <RecommendationCard key={p.id} product={p} onQuickAdd={onQuickAdd} />
        ))}
      </div>
    </section>
  )
}

function CartSummary({ subtotal, itemCount }: { subtotal: number; itemCount: number }) {
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState('')

  const discount = promoApplied ? subtotal * 0.1 : 0
  const taxable = subtotal - discount
  const tax = taxable * 0.08
  const total = taxable + tax

  const handleApply = () => {
    const code = promoCode.trim().toUpperCase()
    if (!code) return

    if (code === 'SAVE10' || code === 'WELCOME') {
      setPromoApplied(true)
      setPromoError('')
    } else {
      setPromoError('Invalid promo code')
    }
  }

  const handleRemovePromo = () => {
    setPromoApplied(false)
    setPromoCode('')
    setPromoError('')
  }

  return (
    <div className="bg-white/80 p-6 md:p-8 rounded-sm">
      <h2 className="text-lg font-medium text-neutral-900 mb-6">Order Summary</h2>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="font-medium text-neutral-900">${subtotal.toFixed(2)}</span>
        </div>

        <AnimatePresence>
          {promoApplied && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-between items-center text-emerald-600"
            >
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                Discount (10%)
                <button
                  onClick={handleRemovePromo}
                  className="ml-1 text-neutral-400 hover:text-red-500"
                  aria-label="Remove promo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
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
          <span className="text-neutral-500">Estimated Tax (8%)</span>
          <span className="font-medium text-neutral-900">${tax.toFixed(2)}</span>
        </div>

        <div className="pt-4 mt-4 border-t border-neutral-200">
          <div className="flex justify-between items-baseline">
            <span className="text-base font-medium text-neutral-900">Total</span>
            <span className="text-xl font-semibold text-neutral-900">${total.toFixed(2)}</span>
          </div>
          {promoApplied && (
            <p className="text-xs text-emerald-600 text-right mt-1">
              You&apos;re saving ${discount.toFixed(2)}!
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-200">
        <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">
          Promo Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => {
              setPromoCode(e.target.value)
              setPromoError('')
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            placeholder="Enter code"
            disabled={promoApplied}
            className="flex-1 bg-white border border-neutral-200 px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm transition-all"
          />
          <button
            onClick={handleApply}
            disabled={!promoCode.trim() || promoApplied}
            className={cn(
              btnBase,
              'px-4 py-2.5 text-sm font-medium rounded-sm',
              promoApplied
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            {promoApplied ? <Check className="w-4 h-4" /> : 'Apply'}
          </button>
        </div>
        {promoError && <p className="mt-2 text-xs text-red-500">{promoError}</p>}
        {!promoApplied && <p className="mt-2 text-xs text-neutral-400">Try: SAVE10 or WELCOME</p>}
      </div>

      <button className={cn(btnPrimary, 'w-full mt-6 py-4 rounded-sm')}>Proceed to Checkout</button>

      <Link
        href="/"
        className="block w-full text-center mt-3 py-3 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        Continue Shopping
      </Link>

      <div className="mt-6 pt-6 border-t border-neutral-200 space-y-3">
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <Truck className="w-4 h-4 flex-shrink-0" />
          <span>Free shipping on orders over $50</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span>Secure checkout with SSL encryption</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <RotateCcw className="w-4 h-4 flex-shrink-0" />
          <span>30-day hassle-free returns</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <Package className="w-4 h-4 flex-shrink-0" />
          <span>Ships within 1-2 business days</span>
        </div>
      </div>
    </div>
  )
}

export function CartPage() {
  const { cart, cartCount, isHydrated, removeItem, updateQuantity, subtotal, addItem } = useCart()
  const [recommendations, setRecommendations] = useState<CartProduct[]>([])

  const handleQuickAdd = useCallback((product: CartProduct) => addItem(product, 1), [addItem])

  const handleUpdateQuantity = useCallback(
    (id: string, qty: number) => {
      if (qty >= 1) {
        updateQuantity(id, qty)
      }
    },
    [updateQuantity],
  )

  useEffect(() => {
    if (!isHydrated) return

    const controller = new AbortController()
    const load = async () => {
      try {
        const res = await fetch('/api/products?limit=12', { signal: controller.signal })
        if (!res.ok) return
        const data = (await res.json()) as { docs?: Product[] }
        const docs = data?.docs ?? []

        const cartProductIds = new Set(cart.map((item) => item.product.id))

        const mapped: CartProduct[] = docs
          .filter(
            (p) => p?.id && p?.name && typeof p?.price === 'number' && !cartProductIds.has(p.id),
          )
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
        // ignore aborted requests
      }
    }
    load()
    return () => controller.abort()
  }, [cart, isHydrated])

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-7xl">
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Continue Shopping</span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900">
            Your Cart
            {isHydrated && cartCount > 0 && (
              <span className="ml-4 text-2xl md:text-3xl text-neutral-400">
                ({cartCount} {cartCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </h1>
        </div>

        {!isHydrated ? (
          <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-7 xl:col-span-8">
                <div className="h-[400px] bg-neutral-100 rounded-sm" />
              </div>
              <div className="lg:col-span-5 xl:col-span-4">
                <div className="h-[300px] bg-neutral-100 rounded-sm" />
              </div>
            </div>
          </div>
        ) : cartCount === 0 ? (
          <>
            <EmptyCart />
            <CartRecommendations products={recommendations} onQuickAdd={handleQuickAdd} />
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-7 xl:col-span-8">
                <CartItemsList
                  items={cart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={removeItem}
                />
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
