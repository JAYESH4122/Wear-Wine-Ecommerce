'use client'

import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuantitySelectorProps {
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  className?: string
}

export function QuantitySelector({ 
  quantity, 
  onIncrease, 
  onDecrease,
  className 
}: QuantitySelectorProps) {
  return (
    <div className={cn("inline-flex items-center border border-border rounded-sm", className)}>
      <button
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>
      
      <span className="w-12 text-center text-sm font-medium text-foreground tabular-nums">
        {quantity}
      </span>
      
      <button
        onClick={onIncrease}
        className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}
