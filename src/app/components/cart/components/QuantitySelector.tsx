'use client'

import React from 'react'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button/Button'

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
      <Button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="w-9 h-9 bg-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
        variant="icon"
        size="icon"
        leftIcon={<Minus className="w-3.5 h-3.5" />}
      />
      <span className="w-10 text-center text-sm font-medium text-neutral-900 tabular-nums select-none">
        {quantity}
      </span>
      <Button
        type="button"
        onClick={onIncrease}
        className="w-9 h-9 bg-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
        aria-label="Increase quantity"
        variant="icon"
        size="icon"
        leftIcon={<Plus className="w-3.5 h-3.5" />}
      />
    </div>
  )
})
