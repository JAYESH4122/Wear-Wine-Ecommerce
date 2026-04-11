'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { cn, formatPriceINR } from '@/lib/utils'
import { useWishlist } from '@/providers/wishlist'
import type { Product, Media } from './types'
import type { Category } from '@/payload-types'

interface Props {
  products: Product[]
}

export const RelatedProducts = ({ products }: Props) => {
  const { isInWishlist, toggleWishlist } = useWishlist()

  if (!products.length) return null

  return (
    <section className="py-16 md:py-24 border-t border-neutral-100" aria-label="Related Products">
      {/* Header */}
      <div className="mb-8 md:mb-12 flex items-end justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1.5">
            Explore More
          </p>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-900">
            Related Products
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden sm:block text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-400 hover:text-neutral-900 transition-colors duration-200 underline underline-offset-4"
        >
          View All
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((rp) => {
          const img = rp.images?.[0]?.image as Media | undefined
          const wishlisted = isInWishlist(String(rp.id))
          const hasSale = !!rp.salePrice && rp.salePrice < rp.price

          const totalStock = (rp.variants ?? []).reduce((acc, v) => acc + (v.stock ?? 0), 0)
          const isOutOfStock = totalStock === 0

          return (
            <div key={rp.id} className="group flex flex-col">
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50 mb-3">
                {img?.url ? (
                  <Image
                    src={img.url}
                    alt={img.alt ?? rp.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-100" />
                )}

                {hasSale && !isOutOfStock && (
                  <span className="absolute top-3 left-3 bg-neutral-900 text-white px-2 py-0.5 text-[8px] font-bold tracking-wider uppercase z-20">
                    Sale
                  </span>
                )}

                {isOutOfStock && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center pointer-events-none z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 border border-neutral-400 px-4 py-2 bg-white/80">
                      Sold Out
                    </span>
                  </div>
                )}

                {/* Wishlist button — visible on hover (desktop) / always (mobile) */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    toggleWishlist(rp)
                  }}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={cn(
                    'absolute top-3 right-3 w-8 h-8 bg-white flex items-center justify-center shadow-sm transition-all duration-200',
                    'opacity-100 sm:opacity-0 sm:group-hover:opacity-100',
                  )}
                >
                  <Heart
                    className={cn(
                      'w-3.5 h-3.5 transition-colors duration-200',
                      wishlisted ? 'fill-neutral-900 text-neutral-900' : 'text-neutral-400',
                    )}
                  />
                </button>

                {/* Quick view overlay — desktop only */}
                <Link
                  href={`/product/${rp.slug}`}
                  className="absolute inset-x-0 bottom-0 h-10 bg-neutral-900/90 text-white flex items-center justify-center text-[9px] font-bold uppercase tracking-[0.15em] opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex"
                >
                  Quick View
                </Link>
              </div>

              {/* Info */}
              <Link href={`/product/${rp.slug}`} className="flex flex-col flex-1 gap-1">
                {rp.category && typeof rp.category === 'object' && (rp.category as Category).name && (
                  <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                    {(rp.category as Category).name}
                  </span>
                )}
                <h3 className="text-sm font-medium text-neutral-900 leading-snug group-hover:text-neutral-600 transition-colors duration-200 line-clamp-2">
                  {rp.name}
                </h3>
                <div className="flex items-baseline gap-2 mt-auto pt-1.5">
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      hasSale ? 'text-neutral-900' : 'text-neutral-900',
                    )}
                  >
                    {formatPriceINR(hasSale ? rp.salePrice! : rp.price)}
                  </span>
                  {hasSale && (
                    <span className="text-xs text-neutral-400 line-through">
                      {formatPriceINR(rp.price)}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          )
        })}
      </div>

      {/* Mobile View All */}
      <div className="mt-8 sm:hidden">
        <Link
          href="/shop"
          className="block w-full h-11 border border-neutral-200 text-center text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-600 hover:bg-neutral-50 transition-colors duration-200 flex items-center justify-center"
        >
          View All Products
        </Link>
      </div>
    </section>
  )
}
