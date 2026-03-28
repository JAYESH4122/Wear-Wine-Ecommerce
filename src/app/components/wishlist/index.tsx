'use client'

import React, { useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Heart, ShoppingBag, Trash2, X } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

import { cn } from '@/lib/utils'
import type { Media } from '@/payload-types'
import { useWishlist, type WishlistItem } from '@/providers/wishlist'
import { useCart } from '@/providers/cart'
import { Button } from '@/components/ui/button/Button'

/**
 * Helper to extract image URL from WishlistItem
 */
const getImageUrl = (item: WishlistItem): string | null => {
  const img = item.images?.[0]?.image as any
  if (!img) return null
  if (typeof img === 'string') return img
  return img?.url ?? null
}

/**
 * Individual Wishlist Item Row with GSAP animations
 */
export const WishlistItemRow = ({
  item,
  onRemove,
  onAddToCart,
}: {
  item: WishlistItem
  onRemove: (id: string) => void
  onAddToCart: (item: WishlistItem) => void
}) => {
  const rowRef = useRef<HTMLDivElement>(null)
  const imageUrl = getImageUrl(item)
  const hasDiscount = item.salePrice && item.salePrice < item.price
  const currentPrice = hasDiscount ? item.salePrice! : item.price

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(pointer: fine)', () => {
        // Desktop Hover Animation
        gsap.set(rowRef.current, { opacity: 0.9, y: 0 })

        const onMouseEnter = () => {
          gsap.to(rowRef.current, {
            opacity: 1,
            x: 4,
            duration: 0.3,
            ease: 'power2.out',
          })
        }

        const onMouseLeave = () => {
          gsap.to(rowRef.current, {
            opacity: 0.9,
            x: 0,
            duration: 0.3,
            ease: 'power2.inOut',
          })
        }

        rowRef.current?.addEventListener('mouseenter', onMouseEnter)
        rowRef.current?.addEventListener('mouseleave', onMouseLeave)

        return () => {
          rowRef.current?.removeEventListener('mouseenter', onMouseEnter)
          rowRef.current?.removeEventListener('mouseleave', onMouseLeave)
        }
      })

      mm.add('(pointer: coarse)', () => {
        // Mobile Interaction System
        const onPointerDown = () => {
          gsap.to(rowRef.current, {
            scale: 1.03,
            duration: 0.2,
            ease: 'back.out(1.7)',
          })
        }

        const onPointerUp = () => {
          gsap.to(rowRef.current, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.inOut',
          })
        }

        rowRef.current?.addEventListener('pointerdown', onPointerDown)
        window.addEventListener('pointerup', onPointerUp)

        return () => {
          rowRef.current?.removeEventListener('pointerdown', onPointerDown)
          window.removeEventListener('pointerup', onPointerUp)
        }
      })

      return () => mm.revert()
    },
    { scope: rowRef },
  )

  return (
    <div ref={rowRef} className="py-6 border-b border-neutral-200 will-change-transform">
      {/* ── MOBILE LAYOUT ── */}
      <div className="flex gap-4 md:hidden">
        {/* Image */}
        <Link
          href={`/products/${item.slug}`}
          className="relative w-24 h-28 bg-neutral-50 rounded shrink-0 overflow-hidden"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={item.name}
              fill
              className="object-cover hover:scale-110 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-300">
              <Heart className="w-5 h-5" />
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col min-w-0">
              {item.category && (
                <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-widest mb-1">
                  {typeof item.category === 'object' ? item.category.name : item.category}
                </span>
              )}
              <Link
                href={`/products/${item.slug}`}
                className="font-medium text-sm text-neutral-900 hover:text-neutral-600 transition-colors leading-snug"
              >
                {item.name}
              </Link>
            </div>
            {/* Remove icon — top right */}
            <button
              onClick={() => onRemove(String(item.id))}
              aria-label="Remove from wishlist"
              className="shrink-0 p-1 -mt-0.5 -mr-1 text-neutral-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-2">
            <span
              className={cn(
                'text-sm font-semibold'
              )}
            >
              ${currentPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-icon-red line-through">
                ${item.price.toFixed(2)}
              </span>
            )}
          </div>

          <div className="mt-1">
            <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-1.5 py-0.5">
              In Stock
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Add to Cart - Full Width below card */}
      <div className="mt-4 md:hidden">
        <Button
          onClick={() => onAddToCart(item)}
          variant="primary"
          size="sm"
          fullWidth
          leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
          className="py-3.5 text-[10px] font-bold uppercase tracking-[0.1em]"
        >
          Add To Cart
        </Button>
      </div>

      {/* ── DESKTOP LAYOUT (original) ── */}
      <div className="hidden md:grid grid-cols-12 items-center gap-4">
        {/* Product Column */}
        <div className="col-span-6 flex items-center gap-4">
          <Button
            onClick={() => onRemove(String(item.id))}
            variant="icon"
            size="icon"
            leftIcon={<X className="w-5 h-5" />}
            aria-label="Remove"
            className="h-9 w-9 bg-transparent text-neutral-400 hover:text-red-500 transition-colors"
          />

          <Link
            href={`/products/${item.slug}`}
            className="relative w-20 h-24 bg-neutral-50 rounded flex-shrink-0 overflow-hidden group"
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-300">
                <Heart className="w-5 h-5" />
              </div>
            )}
          </Link>

          <div className="flex flex-col min-w-0">
            {item.category && (
              <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-widest mb-1">
                {typeof item.category === 'object' ? item.category.name : item.category}
              </span>
            )}
            <Link
              href={`/products/${item.slug}`}
              className="font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
            >
              {item.name}
            </Link>
          </div>
        </div>

        {/* Unit Price Column */}
        <div className="col-span-2 flex justify-center items-baseline gap-2">
          <span className='font-medium'>
            ${currentPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-icon-red line-through">${item.price.toFixed(2)}</span>
          )}
        </div>  

        {/* Stock Status Column */}
        <div className="col-span-2 flex justify-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1">
            In Stock
          </span>
        </div>

        {/* Actions Column */}
        <div className="col-span-2 flex justify-end">
          <Button
            onClick={() => onAddToCart(item)}
            variant="primary"
            size="sm"
            fullWidth
            leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
            className="md:w-auto px-6 py-3 text-[10px] font-bold uppercase tracking-widest shadow-sm hover:shadow-md transition-shadow"
          >
            Add To Cart
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Empty Wishlist state
 */
export const EmptyWishlist = () => (
  <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center">
    <div className="mb-8 p-8 bg-neutral-50 rounded-full border border-neutral-100">
      <Heart className="w-12 h-12 text-neutral-200 stroke-[1.5px]" />
    </div>
    <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-3 tracking-tight">
      Your wishlist is empty
    </h2>
    <p className="text-neutral-500 mb-10 max-w-sm text-sm md:text-base leading-relaxed">
      Save your favorite items here to keep track of what you love and find them easily later.
    </p>
    <Button
      asChild
      variant="primary"
      size="lg"
      className="px-12 py-4 text-xs font-bold uppercase tracking-[0.2em]"
    >
      <Link href="/shop">Explore Collection</Link>
    </Button>
  </div>
)

/**
 * Main Wishlist Page Component
 */
export const WishlistPage = () => {
  const { wishlist, wishlistCount, isHydrated, removeFromWishlist, clearWishlist } = useWishlist()
  const { addItem } = useCart()
  const containerRef = useRef<HTMLDivElement>(null)

  const handleAddToCart = useCallback(
    (item: WishlistItem) => {
      addItem(item)
    },
    [addItem],
  )

  useGSAP(
    () => {
      gsap.from('.wishlist-header', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
      })
      gsap.from('.wishlist-item', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2,
      })
    },
    { scope: containerRef },
  )

  return (
    <main className="min-h-screen bg-background" ref={containerRef}>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-16 max-w-7xl">
        {/* Navigation */}
        <Button
          asChild
          variant="back"
          size="sm"
          leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          className="mb-8 text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          <Link href="/">Back to Home</Link>
        </Button>

        {/* Header Section */}
        <div className="wishlist-header mb-8 md:mb-12">
          <div className="flex items-baseline justify-between border-b border-neutral-200 pb-6">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 tracking-tight">
                My Wishlist
              </h1>
              <p className="text-xs text-neutral-400 font-medium tracking-widest uppercase">
                {isHydrated ? (
                  <>
                    {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved
                  </>
                ) : (
                  <span className="inline-block w-24 h-3 bg-neutral-100 animate-pulse" />
                )}
              </p>
            </div>

            {isHydrated && wishlistCount > 0 && (
              <Button
                onClick={() => window.confirm('Clear all items?') && clearWishlist()}
                variant="text"
                size="sm"
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-red-500 transition-colors"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Wishlist Content */}
        {!isHydrated ? (
          <div className="space-y-6 pt-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-neutral-50 border-b border-neutral-100" />
            ))}
          </div>
        ) : wishlistCount === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="mt-4">
            {/* Table Headers (Desktop Only) */}
            <div className="hidden md:grid grid-cols-12 pb-4 border-b border-neutral-900 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-900/40">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-right">Action</div>
            </div>

            <div className="flex flex-col">
              {wishlist.map((item) => (
                <div key={item.id} className="wishlist-item">
                  <WishlistItemRow
                    item={item}
                    onRemove={removeFromWishlist}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
