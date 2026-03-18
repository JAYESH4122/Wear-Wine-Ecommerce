'use client'

import { CartItemCard } from './cart-item-card'
import type { CartItem } from '@/providers/cart'

interface CartItemsListProps {
  items: CartItem[]
  onUpdateQuantity: (cartItemId: string, quantity: number) => void
  onRemove: (cartItemId: string) => void
}

export function CartItemsList({ items, onUpdateQuantity, onRemove }: CartItemsListProps) {
  return (
    <div className="bg-background">
      {/* Desktop Header */}
      <div className="hidden md:grid grid-cols-12 pb-4 border-b border-border text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <div className="col-span-7">Product</div>
        <div className="col-span-3 text-center">Quantity</div>
        <div className="col-span-2 text-right">Subtotal</div>
      </div>
      <div>
        {items.map((item) => (
          <CartItemCard
            key={item.cartItemId}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  )
}
