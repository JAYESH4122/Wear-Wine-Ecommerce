'use client'

import React, { useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Heart, ShoppingBag, Trash2, X, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Media } from '@/payload-types'
import { useWishlist, type WishlistItem } from '@/providers/wishlist'
import { useCart } from '@/providers/cart'
import { Button } from '@/components/ui/button/Button'

// --- Helper ---
function getImageUrl(item: WishlistItem): string | null {
  const image = item.images?.[0]?.image
  if (!image) return null
  if (typeof image === 'string') return image
  if (typeof image === 'object' && 'url' in image) return (image as Media).url ?? null
  return null
}

// --- Wishlist Row ---
function WishlistItemRow({
  item,
  onRemove,
  onAddToCart,
}: {
  item: WishlistItem
  onRemove: (id: string) => void
  onAddToCart: (item: WishlistItem) => void
}) {
  const imageUrl = getImageUrl(item)
  const hasDiscount = item.salePrice && item.salePrice < item.price
  const currentPrice = hasDiscount ? item.salePrice! : item.price

  return (
    <motion.div
      // layout
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1 }}
      // exit={{ opacity: 0, x: -10 }}
      className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 py-6 border-b border-neutral-200 group"
    >
      {/* Product Column */}
      <div className="md:col-span-6 flex items-center gap-4">
        <Button
          onClick={() => onRemove(String(item.id))}
          variant="icon"
          size="icon"
          leftIcon={<X className="w-5 h-5" />}
          aria-label="Remove"
          className="hidden md:block h-9 w-9 bg-transparent text-neutral-400 hover:text-red-500"
        />

        <Link
          href={`/products/${item.slug}`}
          className="relative w-20 h-24 bg-neutral-50 rounded flex-shrink-0 overflow-hidden"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-300">
              <Heart className="w-5 h-5" />
            </div>
          )}
        </Link>

        <div className="flex flex-col">
          <Link
            href={`/products/${item.slug}`}
            className="font-medium text-neutral-900 hover:underline decoration-neutral-300 underline-offset-4"
          >
            {item.name}
          </Link>
          <Button
            onClick={() => onRemove(String(item.id))}
            variant="text"
            size="sm"
            leftIcon={<Trash2 className="w-3 h-3" />}
            className="md:hidden text-xs text-red-500 mt-2"
          >
            Remove
          </Button>
        </div>
      </div>

      {/* Unit Price Column */}
      <div className="md:col-span-2 flex md:justify-center items-baseline gap-2">
        <span className="md:hidden text-xs text-neutral-400 mr-2 uppercase">Price:</span>
        <span className={cn('font-medium', hasDiscount ? 'text-red-600' : 'text-neutral-900')}>
          ${currentPrice.toFixed(2)}
        </span>
        {hasDiscount && (
          <span className="text-xs text-neutral-400 line-through">${item.price.toFixed(2)}</span>
        )}
      </div>

      {/* Stock Status Column */}
      <div className="md:col-span-2 flex md:justify-center">
        <span className="md:hidden text-xs text-neutral-400 mr-2 uppercase">Status:</span>
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
          In Stock
        </span>
      </div>

      {/* Actions Column */}
      <div className="md:col-span-2 flex justify-end">
        <Button
          onClick={() => onAddToCart(item)}
          variant="primary"
          size="sm"
          leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
          className="w-full md:w-auto px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-neutral-900 text-white hover:bg-neutral-800"
        >
          Add To Cart
        </Button>
      </div>
    </motion.div>
  )
}

// --- Empty State ---
function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="mb-6 p-6 bg-neutral-50 rounded-full">
        <Heart className="w-12 h-12 text-neutral-300 stroke-[1px]" />
      </div>
      <h2 className="text-2xl font-light mb-2">Your wishlist is currently empty.</h2>
      <p className="text-neutral-500 mb-8 max-w-xs">
        Save your favorite items here to keep track of what you love.
      </p>
      <Button
        asChild
        variant="primary"
        size="lg"
        className="px-10 py-4 text-sm font-bold uppercase tracking-widest bg-neutral-900 text-white hover:bg-neutral-800"
      >
        <Link href="/shop">Return To Shop</Link>
      </Button>
    </div>
  )
}

// --- Main Page Component ---
export default function WishlistPage() {
  const { wishlist, wishlistCount, isHydrated, removeFromWishlist, clearWishlist } = useWishlist()
  const { addItem } = useCart()

  const handleAddToCart = useCallback(
    (item: WishlistItem) => {
      addItem({
        id: item.id,
        name: item.name,
        slug: item.slug,
        price: item.price,
        salePrice: item.salePrice,
        images: item.images,
      })
    },
    [addItem],
  )

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Breadcrumb / Top Bar */}
      <div className="border-b border-neutral-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button
            asChild
            variant="back"
            size="sm"
            leftIcon={<ArrowLeft className="w-3 h-3" />}
            className="text-xs uppercase tracking-widest text-neutral-500 hover:text-black"
          >
            <Link href="/">Back to Home</Link>
          </Button>
          <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
            Free Shipping on orders over $150
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-12 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-light tracking-tight text-neutral-900">
              My Wishlist
            </h1>
            <p className="text-neutral-500 text-sm mt-2">
              {isHydrated ? (
                <>You have {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved in your list.</>
              ) : (
                <span className="inline-block w-32 h-4 bg-neutral-100 animate-pulse rounded" />
              )}
            </p>
          </div>

          {isHydrated && wishlistCount > 0 && (
            <Button
              onClick={() => window.confirm('Clear all items?') && clearWishlist()}
              variant="text"
              size="sm"
              leftIcon={<Trash2 className="w-3 h-3" />}
              className="text-xs uppercase tracking-widest text-neutral-400 hover:text-red-500"
            >
              Clear Wishlist
            </Button>
          )}
        </div>

        {!isHydrated ? (
          <div className="mt-8 animate-pulse">
            <div className="hidden md:grid grid-cols-12 pb-4 border-b border-neutral-900">
              <div className="col-span-6 h-4 bg-neutral-100 w-32" />
            </div>
            <div className="flex flex-col gap-6 py-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-neutral-50 rounded" />
              ))}
            </div>
          </div>
        ) : wishlistCount === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="mt-8">
            {/* Table Headers (Desktop Only) */}
            <div className="hidden md:grid grid-cols-12 pb-4 border-b border-neutral-900 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-900">
              <div className="col-span-6">Product Details</div>
              <div className="col-span-2 text-center">Unit Price</div>
              <div className="col-span-2 text-center">Stock Status</div>
              <div className="col-span-2 text-right">Action</div>
            </div>

            {/* List */}
            <div className="flex flex-col">
              {/* <AnimatePresence mode="popLayout"> */}
                {wishlist.map((item) => (
                  <WishlistItemRow
                    key={item.id}
                    item={item}
                    onRemove={removeFromWishlist}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              {/* </AnimatePresence> */}
            </div>

            {/* Footer Actions */}
            <div className="mt-10 flex flex-col md:flex-row items-center justify-between border-t border-neutral-100 pt-10">
              <Button
                asChild
                variant="link"
                size="sm"
                rightIcon={<ChevronRight className="w-4 h-4" />}
                className="text-sm font-medium hover:gap-4"
              >
                <Link href="/shop">Continue Shopping</Link>
              </Button>

              <div className="hidden md:flex items-center gap-8">
                <p className="text-xs text-neutral-400 max-w-[200px] text-right">
                  Items will be saved in your browser until they are removed or purchased.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
