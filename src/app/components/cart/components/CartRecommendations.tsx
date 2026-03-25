'use client'

import React, { useCallback, useRef } from 'react'
import type { CartProduct } from '@/providers/cart'
import { RecommendationCard } from './RecommendationCard'
import { Button } from '@/components/ui/button/Button'

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
          <Button
            type="button"
            onClick={() => scroll('left')}
            variant="slider"
            size="icon"
            aria-label="Scroll left"
            leftIcon={
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
            }
            className="text-neutral-500 hover:text-neutral-900 border-neutral-200 hover:border-neutral-400"
          />
          <Button
            type="button"
            onClick={() => scroll('right')}
            variant="slider"
            size="icon"
            aria-label="Scroll right"
            leftIcon={
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
            }
            className="text-neutral-500 hover:text-neutral-900 border-neutral-200 hover:border-neutral-400"
          />
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
