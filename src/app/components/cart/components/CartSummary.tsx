'use client'

import React from 'react'
import { Package, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { formatPriceINR } from '@/lib/utils'

export const CartSummary = React.memo(function CartSummary({
  subtotal,
  itemCount,
}: {
  subtotal: number
  itemCount: number
}) {
  const total = subtotal

  return (
    <div className="bg-white/80 p-6 md:p-8 rounded-sm">
      <h2 className="text-lg font-medium text-neutral-900 mb-6">Order Summary</h2>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="font-medium text-neutral-900">{formatPriceINR(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-neutral-500">Shipping</span>
          <span className="font-medium text-emerald-600">Free</span>
        </div>

        <div className="pt-4 mt-4 border-t border-neutral-200">
          <div className="flex justify-between items-baseline">
            <span className="text-base font-medium text-neutral-900">Total</span>
            <span className="text-xl font-semibold text-neutral-900">{formatPriceINR(total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-200 space-y-3">
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <Truck className="w-4 h-4 flex-shrink-0" />
          <span>Free shipping on orders over ₹50</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span>Secure checkout with SSL encryption</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <RotateCcw className="w-4 h-4 flex-shrink-0" />
          <span>30-day hassle-free returns</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <Package className="w-4 h-4 flex-shrink-0" />
          <span>Ships within 1-2 business days</span>
        </div>
      </div>
    </div>
  )
})
