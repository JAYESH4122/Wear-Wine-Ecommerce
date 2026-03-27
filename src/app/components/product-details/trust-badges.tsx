'use client'

import { Truck, ShieldCheck, RefreshCcw } from 'lucide-react'

const BADGES = [
  { icon: Truck, label: 'Free Delivery', sub: '3–5 business days' },
  { icon: ShieldCheck, label: 'Secure Payment', sub: 'SSL encrypted' },
  { icon: RefreshCcw, label: 'Easy Returns', sub: 'Within 30 days' },
]

export const TrustBadges = () => (
  <div className="grid grid-cols-3 gap-3 pt-6 border-t border-neutral-100">
    {BADGES.map((badge, i) => (
      <div key={i + badge.label} className="flex flex-col items-center text-center gap-1.5">
        <div className="w-8 h-8 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center">
          <badge.icon className="w-3.5 h-3.5 text-neutral-400" aria-hidden />
        </div>
        <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-neutral-700 leading-tight">
          {badge.label}
        </span>
        <span className="text-[9px] text-neutral-400 leading-tight hidden sm:block">{badge.sub}</span>
      </div>
    ))}
  </div>
)