'use client'

import { motion, LayoutGroup } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { NormalizedSize } from './types'

interface Props {
  sizes: NormalizedSize[]
  selected: string | null
  onSelect: (id: string) => void
  onViewChart: () => void
}

export const SizeSelector = ({ sizes, selected, onSelect, onViewChart }: Props) => {
  if (!sizes.length) return null

  return (
    <div className="mb-7">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-900">Size</p>
        <button
          onClick={onViewChart}
          className="text-[9px] uppercase tracking-[0.12em] text-neutral-400 hover:text-neutral-900 transition-colors duration-200 underline underline-offset-2"
        >
          Size Guide
        </button>
      </div>
      <LayoutGroup>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Select size">
          {sizes.map((size) => {
            const isSelected = selected === size.id
            return (
              <button
                key={size.id}
                onClick={() => onSelect(size.id)}
                aria-pressed={isSelected}
                className={cn(
                  'relative h-10 min-w-[2.75rem] px-3 text-[11px] font-bold border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1',
                  isSelected
                    ? 'text-white border-neutral-900'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-900 hover:text-neutral-900',
                )}
              >
                {isSelected && (
                  <motion.div
                    layoutId="active-size"
                    className="absolute inset-0 bg-neutral-900"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{size.label}</span>
              </button>
            )
          })}
        </div>
      </LayoutGroup>
    </div>
  )
}
