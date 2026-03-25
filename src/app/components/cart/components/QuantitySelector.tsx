'use client'

import React from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { btnBase } from './styles'

export const QuantitySelector = React.memo(function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
}: {
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
}) {
  return (
    <div className="inline-flex items-center border border-neutral-200 rounded-sm">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        className={cn(
          btnBase,
          'w-9 h-9 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors',
        )}
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-10 text-center text-sm font-medium text-neutral-900 tabular-nums select-none">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        className={cn(
          btnBase,
          'w-9 h-9 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors',
        )}
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  )
})
