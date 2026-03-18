'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Truck, ShieldCheck, Tag } from 'lucide-react'

interface CartSummaryProps {
  subtotal: number
  itemCount: number
}

export function CartSummary({ subtotal, itemCount }: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  const shipping = 0 // Free shipping
  const taxRate = 0.08 // 8% tax
  const discount = promoApplied ? subtotal * 0.1 : 0 // 10% discount when promo applied
  const taxableAmount = subtotal - discount
  const tax = taxableAmount * taxRate
  const total = taxableAmount + tax + shipping

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setPromoApplied(true)
    }
  }

  return (
    <div className="bg-background/30 rounded-sm p-6 md:p-8">
      <h2 className="text-lg font-medium text-foreground mb-6">Order Summary</h2>

      {/* Summary Lines */}
      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="font-medium text-foreground">
            ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {promoApplied && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center gap-1.5">
              <Tag className="w-4 h-4" />
              Discount (10%)
            </span>
            <span className="font-medium">
              -${discount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium text-green-600">Free</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated Tax</span>
          <span className="font-medium text-foreground">
            ${tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="pt-4 mt-4 border-t border-border">
          <div className="flex justify-between">
            <span className="text-base font-medium text-foreground">Total</span>
            <span className="text-xl font-semibold text-foreground">
              ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Promo Code */}
      <div className="mt-6 pt-6 border-t border-border">
        <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
          Promo Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter code"
            disabled={promoApplied}
            className="flex-1 bg-background border border-border rounded-sm px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleApplyPromo}
            disabled={!promoCode.trim() || promoApplied}
            className="px-4 py-2.5 bg-foreground text-background text-sm font-medium rounded-sm hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {promoApplied ? 'Applied' : 'Apply'}
          </button>
        </div>
      </div>

      {/* Checkout Button */}
      <button className="w-full mt-6 bg-foreground text-background py-4 text-sm font-medium uppercase tracking-wider rounded-sm hover:bg-foreground/90 transition-colors">
        Proceed to Checkout
      </button>

      {/* Continue Shopping */}
      <Link
        href="/"
        className="block w-full text-center mt-3 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Continue Shopping
      </Link>

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Truck className="w-4 h-4" />
          <span>Free Shipping</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4" />
          <span>Secure Checkout</span>
        </div>
      </div>
    </div>
  )
}
