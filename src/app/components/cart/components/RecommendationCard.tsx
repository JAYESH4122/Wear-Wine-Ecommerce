'use client'

import React from 'react'
import Image from 'next/image'
import { Plus, ShoppingBag } from 'lucide-react'
import type { Media } from '@/payload-types'
import type { CartProduct } from '@/providers/cart'
import { Button } from '@/components/ui/button/Button'

export const RecommendationCard = React.memo(function RecommendationCard({
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
        <Button
          type="button"
          onClick={() => onQuickAdd(product)}
          variant="icon"
          size="icon"
          leftIcon={<Plus className="w-4 h-4" />}
          aria-label={`Quick add ${product.name}`}
          className="absolute bottom-3 right-3 w-9 h-9 bg-white/90 text-neutral-900 opacity-0 group-hover:opacity-100 hover:bg-white"
        />
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-icon-primary text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
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
})
