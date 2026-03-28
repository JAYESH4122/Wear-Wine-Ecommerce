'use client'

import { cn } from '@/lib/utils'
import { Truck, ShieldCheck, RefreshCcw } from 'lucide-react'
import { pdpStaticData } from '@/data/pdp-static'

const BADGE_ICONS = [
  {
    icon: Truck,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    ring: 'ring-sky-100',
  },
  {
    icon: ShieldCheck,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    ring: 'ring-emerald-100',
  },
  {
    icon: RefreshCcw,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    ring: 'ring-violet-100',
  },
]

export const TrustBadges = () => (
  <div className="grid grid-cols-3 gap-3 pt-6 border-t border-neutral-100">
    {pdpStaticData.trustBadges.map((badge, i) => {
      const style = BADGE_ICONS[i] || BADGE_ICONS[0]
      return (
        <div key={i + badge.label} className="flex flex-col items-center text-center gap-1.5">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center border ring-2',
              style.bg,
              style.border,
              style.ring,
            )}
          >
            <style.icon className={cn('w-3.5 h-3.5', style.color)} aria-hidden />
          </div>
          <span
            className={cn(
              'text-[9px] font-bold uppercase tracking-[0.12em] leading-tight',
              style.color,
            )}
          >
            {badge.label}
          </span>
          <span className="text-[9px] text-neutral-400 leading-tight hidden sm:block">
            {badge.description}
          </span>
        </div>
      )
    })}
  </div>
)
