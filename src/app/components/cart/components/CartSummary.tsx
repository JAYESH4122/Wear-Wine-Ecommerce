'use client'

import React, { useState } from 'react'
import { Check, Package, RotateCcw, ShieldCheck, Tag, Truck, X } from 'lucide-react'
import { Button } from '@/components/ui/button/Button'

export const CartSummary = React.memo(function CartSummary({
  subtotal,
  itemCount,
}: {
  subtotal: number
  itemCount: number
}) {
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState('')

  const discount = promoApplied ? subtotal * 0.1 : 0
  const taxable = subtotal - discount
  const tax = taxable * 0.08
  const total = taxable + tax

  const handleApply = () => {
    const code = promoCode.trim().toUpperCase()
    if (!code) return
    if (code === 'SAVE10' || code === 'WELCOME') {
      setPromoApplied(true)
      setPromoError('')
    } else {
      setPromoError('Invalid promo code')
    }
  }

  const handleRemovePromo = () => {
    setPromoApplied(false)
    setPromoCode('')
    setPromoError('')
  }

  return (
    <div className="bg-white/80 p-6 md:p-8 rounded-sm">
      <h2 className="text-lg font-medium text-neutral-900 mb-6">Order Summary</h2>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="font-medium text-neutral-900">${subtotal.toFixed(2)}</span>
        </div>

        {promoApplied && (
          <div className="flex justify-between items-center text-emerald-600">
            <span className="flex items-center gap-1.5">
              <Tag className="w-4 h-4" />
              Discount (10%)
              <Button
                type="button"
                onClick={handleRemovePromo}
                variant="icon"
                size="icon"
                leftIcon={<X className="w-3.5 h-3.5" />}
                aria-label="Remove promo"
                className="ml-1 h-5 w-5 bg-transparent text-neutral-400 hover:text-red-500"
              />
            </span>
            <span className="font-medium">-${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-neutral-500">Shipping</span>
          <span className="font-medium text-emerald-600">Free</span>
        </div>

        <div className="flex justify-between">
          <span className="text-neutral-500">Estimated Tax (8%)</span>
          <span className="font-medium text-neutral-900">${tax.toFixed(2)}</span>
        </div>

        <div className="pt-4 mt-4 border-t border-neutral-200">
          <div className="flex justify-between items-baseline">
            <span className="text-base font-medium text-neutral-900">Total</span>
            <span className="text-xl font-semibold text-neutral-900">${total.toFixed(2)}</span>
          </div>
          {promoApplied && (
            <p className="text-xs text-emerald-600 text-right mt-1">
              You&apos;re saving ${discount.toFixed(2)}!
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-200">
        <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">
          Promo Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => {
              setPromoCode(e.target.value)
              setPromoError('')
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            placeholder="Enter code"
            disabled={promoApplied}
            className="flex-1 bg-white border border-neutral-200 px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm transition-all"
          />
          <Button
            type="button"
            onClick={handleApply}
            disabled={!promoCode.trim() || promoApplied}
            variant={promoApplied ? 'secondary' : 'primary'}
            size="sm"
            leftIcon={promoApplied ? <Check className="w-4 h-4" /> : undefined}
            className={
              promoApplied
                ? 'bg-emerald-600 text-white hover:bg-emerald-600 cursor-default'
                : 'bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed'
            }
          >
            {promoApplied ? null : 'Apply'}
          </Button>
        </div>
        {promoError && <p className="mt-2 text-xs text-red-500">{promoError}</p>}
        {!promoApplied && <p className="mt-2 text-xs text-neutral-400">Try: SAVE10 or WELCOME</p>}
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-200 space-y-3">
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <Truck className="w-4 h-4 flex-shrink-0" />
          <span>Free shipping on orders over $50</span>
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
