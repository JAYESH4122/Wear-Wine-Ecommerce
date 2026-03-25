import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outlined'
  | 'ghost'
  | 'icon'
  | 'link'
  | 'cta'
  | 'back'
  | 'close'
  | 'slider'
  | 'text'

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

export type ButtonType = 'button' | 'submit' | 'reset'

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  type?: ButtonType
  loading?: boolean
  disabled?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
  asChild?: boolean
}
