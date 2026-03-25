import { cn } from '@/lib/utils'

export const btnBase =
  'flex items-center justify-center transition-all duration-200 cursor-pointer select-none'

export const btnPrimary = cn(
  btnBase,
  'bg-neutral-900 text-white text-sm font-medium tracking-wide uppercase hover:bg-neutral-800',
)
