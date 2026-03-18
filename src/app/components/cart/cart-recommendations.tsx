'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { RecommendationCard } from './recommendation-card'
import type { CartProduct } from '@/providers/cart'

interface CartRecommendationsProps {
  products: CartProduct[]
  onQuickAdd: (product: CartProduct) => void
}

export function CartRecommendations({ products, onQuickAdd }: CartRecommendationsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 240
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }
  
  if (products.length === 0) return null
  
  return (
    <section className="mt-16 md:mt-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-light text-foreground tracking-tight">
          You May Also Like
        </h2>
        
        {/* Navigation Arrows */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Horizontal Slider */}
      <div 
        ref={scrollRef}
        className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <RecommendationCard 
            key={product.id} 
            product={product} 
            onQuickAdd={onQuickAdd}
          />
        ))}
      </div>
    </section>
  )
}
