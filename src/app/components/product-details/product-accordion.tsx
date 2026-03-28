'use client'

import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionItem {
  id: string
  title: string
  content: string
}

interface Props {
  items: AccordionItem[]
  open: string | null
  onToggle: (id: string) => void
}

export const ProductAccordion = ({ items, open, onToggle }: Props) => (
  <div className="border-t border-neutral-200">
    {items.map((item) => {
      const isOpen = open === item.id
      return (
        <div key={item.id} className="border-b border-neutral-100">
          <button
            onClick={() => onToggle(item.id)}
            aria-expanded={isOpen}
            className="w-full flex items-center justify-between py-4 text-sm font-sans tracking-[0.18em] text-neutral-900 hover:text-neutral-600 transition-colors duration-200 focus-visible:outline-none"
          >
            {item.title}
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-neutral-400 transition-transform duration-300 shrink-0',
                isOpen && 'rotate-180',
              )}
            />
          </button>
          <div
            className={cn(
              'overflow-hidden transition-all duration-300',
              isOpen ? 'max-h-48 opacity-100 pb-4' : 'max-h-0 opacity-0',
            )}
          >
            <p className="text-sm text-neutral-500 leading-relaxed">{item.content}</p>
          </div>
        </div>
      )
    })}
  </div>
)