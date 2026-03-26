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
            sliderDirection="left"
          />
          <Button
            type="button"
            onClick={() => scroll('right')}
            variant="slider"
            size="icon"
            aria-label="Scroll right"
            sliderDirection="right"
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
