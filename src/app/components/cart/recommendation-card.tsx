'use client'

import Image from 'next/image'
import { Plus } from 'lucide-react'
import type { Media } from '@/payload-types'
import type { CartProduct } from '@/providers/cart'

interface RecommendationCardProps {
  product: CartProduct
  onQuickAdd: (product: CartProduct) => void
}

export function RecommendationCard({ product, onQuickAdd }: RecommendationCardProps) {
  const firstImage = product.images?.[0]?.image
  const imageUrl =
    typeof firstImage === 'string'
      ? firstImage
      : typeof firstImage === 'object' && firstImage !== null
        ? (firstImage as Media).url ?? null
        : null
    
  const displayPrice = product.salePrice || product.price
  
  return (
    <div className="group flex-shrink-0 w-48 md:w-56">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-secondary rounded-sm overflow-hidden mb-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <span className="text-xs">No image</span>
          </div>
        )}
        
        {/* Quick Add Button */}
        <button
          onClick={() => onQuickAdd(product)}
          className="absolute bottom-3 right-3 w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background shadow-sm"
          aria-label={`Quick add ${product.name}`}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      {/* Product Info */}
      <h4 className="text-sm font-medium text-foreground truncate">{product.name}</h4>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">
          ${displayPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
        {product.salePrice && (
          <span className="text-xs text-muted-foreground line-through">
            ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        )}
      </div>
    </div>
  )
}
