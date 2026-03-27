// quantity-selector.tsx
'use client'

import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button/Button'

interface Props {
  value: number
  onDecrease: () => void
  onIncrease: () => void
}

export const QuantitySelector = ({ value, onDecrease, onIncrease }: Props) => (
  <div className="flex items-center border border-neutral-200 bg-neutral-50 h-12 w-full sm:w-32">
    <Button
      variant="ghost"
      size="icon"
      onClick={onDecrease}
      aria-label="Decrease quantity"
      className="flex-1 h-full rounded-none focus-visible:ring-inset"
    >
      <Minus className="w-3 h-3" />
    </Button>
    <span
      className="w-10 text-center text-sm font-semibold text-neutral-900 select-none"
      aria-live="polite"
    >
      {value}
    </span>
    <Button
      variant="ghost"
      size="icon"
      onClick={onIncrease}
      aria-label="Increase quantity"
      className="flex-1 h-full rounded-none focus-visible:ring-inset"
    >
      <Plus className="w-3 h-3" />
    </Button>
  </div>
)
