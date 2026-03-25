'use client'

import React from 'react'
import type { CartItem } from '@/providers/cart'
import { CartItemCard } from './CartItemCard'

export const CartItemsList = React.memo(function CartItemsList({
  items,
  onUpdateQuantity,
  onRemove,
}: {
  items: CartItem[]
  onUpdateQuantity: (id: string, qty: number) => void
  onRemove: (id: string) => void
}) {
  return (
    <div>
      <div className="hidden md:grid grid-cols-12 pb-4 border-b border-neutral-200 text-xs font-medium uppercase tracking-wider text-neutral-500">
        <div className="col-span-6">Product</div>
        <div className="col-span-3 text-center">Quantity</div>
        <div className="col-span-3 text-right">Subtotal</div>
      </div>
      {items.map((item) => (
        <CartItemCard
          key={item.cartItemId}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
})
