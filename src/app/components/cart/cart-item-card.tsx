'use client'

import Image from 'next/image'
import { X } from 'lucide-react'
import { QuantitySelector } from './quantity-selector'
import type { Media } from '@/payload-types'
import type { CartItem } from '@/providers/cart'

interface CartItemCardProps {
  item: CartItem
  onUpdateQuantity: (cartItemId: string, quantity: number) => void
  onRemove: (cartItemId: string) => void
}

export function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const { product, quantity, selectedColor, selectedSize, cartItemId } = item
  
  const firstImage = product.images?.[0]?.image
  const imageUrl =
    typeof firstImage === 'string'
      ? firstImage
      : typeof firstImage === 'object' && firstImage !== null
        ? (firstImage as Media).url ?? null
        : null
    
  const price = product.salePrice || product.price
  const subtotal = price * quantity
  
  return (
    <div className="group py-6 border-b border-border last:border-b-0">
      <div className="flex gap-4 md:gap-6">
        {/* Product Image */}
        <div className="relative w-24 h-32 md:w-32 md:h-40 bg-secondary rounded-sm overflow-hidden flex-shrink-0">
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
        </div>
        
        {/* Product Details */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-base md:text-lg font-medium text-foreground truncate">
                {product.name}
              </h3>
              
              {/* Variant Info */}
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {selectedColor && (
                  <span className="flex items-center gap-1.5">
                    <span 
                      className="w-3 h-3 rounded-full border border-border"
                      style={{ backgroundColor: selectedColor.hex || '#ccc' }}
                    />
                    {selectedColor.name}
                  </span>
                )}
                {selectedSize && (
                  <span>Size: {selectedSize.label}</span>
                )}
              </div>
              
              {/* Price - Mobile */}
              <div className="mt-2 md:hidden">
                <span className="text-base font-medium text-foreground">
                  ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                {product.salePrice && (
                  <span className="ml-2 text-sm text-muted-foreground line-through">
                    ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>
            </div>
            
            {/* Remove Button */}
            <button
              onClick={() => onRemove(cartItemId)}
              className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`Remove ${product.name} from cart`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Bottom Row: Quantity and Price */}
          <div className="mt-auto pt-4 flex items-center justify-between gap-4">
            <QuantitySelector
              quantity={quantity}
              onIncrease={() => onUpdateQuantity(cartItemId, quantity + 1)}
              onDecrease={() => onUpdateQuantity(cartItemId, quantity - 1)}
            />
            
            {/* Price - Desktop */}
            <div className="hidden md:block text-right">
              <p className="text-lg font-medium text-foreground">
                ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              {quantity > 1 && (
                <p className="text-sm text-muted-foreground">
                  ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })} each
                </p>
              )}
            </div>
            
            {/* Subtotal - Mobile */}
            <div className="md:hidden text-right">
              <p className="text-base font-medium text-foreground">
                ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
