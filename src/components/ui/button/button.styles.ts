import { cn } from '@/lib/utils'
import type { ButtonSize, ButtonVariant } from './button.types'

const base =
  'relative inline-flex items-center justify-center gap-2 select-none font-medium transition-[transform,opacity] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50'

const interactive = 'enabled:hover:opacity-95'

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-7 text-sm',
  icon: 'h-10 w-10 p-0 rounded-full',
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-button-primary text-button-alt overflow-hidden cursor-pointer   hover:border-neutral-600 border',
  secondary: 'bg-background-secondary text-content-primary overflow-hidden',
  outlined: 'border border-border-primary text-content-primary hover:bg-background-secondary',
  ghost: 'bg-transparent text-content-primary hover:bg-background-secondary',
  icon: 'bg-background-secondary text-content-primary hover:bg-background',
  link: 'bg-transparent text-content-primary underline underline-offset-4 hover:text-secondary',
  cta: 'bg-button-primary text-button-alt hover:bg-button-hover shadow-sm',
  back: 'bg-transparent text-content-primary hover:text-secondary',
  close: 'bg-background-secondary text-content-primary hover:bg-background',
  slider:
    'bg-background-primary text-content-primary hover:bg-button-primary border border-button-primary cursor-pointer',
  text: 'bg-transparent text-content-primary hover:text-secondary',
}

const iconBase =
  'inline-flex items-center justify-center transition-transform duration-200 cursor-pointer'

const iconMotion: Partial<Record<ButtonVariant, { left?: string; right?: string }>> = {
  back: { left: 'group-hover:-translate-x-0.5' },
  link: { right: 'group-hover:translate-x-0.5' },
  cta: { right: 'group-hover:translate-x-0.5' },
  text: { right: 'group-hover:translate-x-0.5' },
}

export const getButtonClasses = ({
  variant,
  size,
  fullWidth,
  hasOnlyIcon,
  className,
}: {
  variant: ButtonVariant
  size: ButtonSize
  fullWidth?: boolean
  hasOnlyIcon?: boolean
  className?: string
}) =>
  cn(
    base,
    interactive,
    'group',
    sizes[size],
    variants[variant],
    fullWidth && 'w-full',
    hasOnlyIcon && 'p-0',
    className,
  )

export const getIconClasses = ({
  variant,
  position,
  className,
}: {
  variant: ButtonVariant
  position: 'left' | 'right'
  className?: string
}) => {
  const motion = iconMotion[variant]?.[position]
  return cn(iconBase, motion, className)
}
