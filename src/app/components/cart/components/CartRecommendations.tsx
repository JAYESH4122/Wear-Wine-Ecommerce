'use client'

import React, { useCallback, useRef } from 'react'
import type { CartProduct } from '@/providers/cart'
import { cn } from '@/lib/utils'
import { btnBase } from './styles'
import { RecommendationCard } from './RecommendationCard'

export const CartRecommendations = React.memo(function CartRecommendations({
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
            type="button"
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
              aria-hidden
            >
              <path d="M8 2L4 6L8 10" />
            </svg>
          </button>
          <button
            type="button"
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
              aria-hidden
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
        {products.map((product) => (
          <RecommendationCard key={product.id} product={product} onQuickAdd={onQuickAdd} />
        ))}
      </div>
    </section>
  )
})
