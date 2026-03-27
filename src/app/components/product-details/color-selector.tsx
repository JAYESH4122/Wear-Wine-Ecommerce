'use client'

import { cn } from '@/lib/utils'
import type { NormalizedColor } from './types'

interface Props {
  colors: NormalizedColor[]
  selected: string | null
  onSelect: (id: string) => void
}

export const ColorSelector = ({ colors, selected, onSelect }: Props) => {
  if (!colors.length) return null

  return (
    <div className="mb-7">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-900">
          Colour
        </p>
        {selected && (
          <span className="text-[9px] uppercase tracking-[0.12em] text-neutral-500">
            {colors.find((c) => c.id === selected)?.name}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2.5" role="group" aria-label="Select colour">
        {colors.map((color) => {
          const isSelected = selected === color.id
          return (
            <button
              key={color.id}
              onClick={() => onSelect(color.id)}
              aria-label={color.name ?? 'Select colour'}
              aria-pressed={isSelected}
              title={color.name ?? ''}
              className={cn(
                'relative w-8 h-8 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2',
                isSelected
                  ? 'ring-2 ring-neutral-900 ring-offset-2'
                  : 'ring-1 ring-neutral-200 hover:ring-neutral-400',
              )}
              style={{ backgroundColor: color.hex }}
            />
          )
        })}
      </div>
    </div>
  )
}