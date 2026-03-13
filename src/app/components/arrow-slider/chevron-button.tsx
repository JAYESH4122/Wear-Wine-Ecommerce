'use client'

import { ArrowRightDark } from 'assets'
import { cva } from 'class-variance-authority'
import clsx from 'clsx'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

const chevronButtonVariants = cva(
  'group relative w-fit overflow-hidden transition-colors shadow-xs rounded-full',
  {
    variants: {
      variant: {
        primary: 'bg-white! hover:bg-button-gray-100!',
        secondary: 'bg-black! !hover:bg-gray-600!',
        outlined: 'bg-transparent! border! border-black!',
      },
      size: {
        sm: 'p-2.5!',
        lg: 'p-3.5!',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
    },
  },
)

interface ChevronButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outlined'
  size?: 'sm' | 'lg'
}

export const ChevronButton = ({
  variant = 'primary',
  size = 'lg',
  className,
  disabled,
  ...props
}: ChevronButtonProps) => {
  const isPrimary = variant === 'primary'
  const isOutlined = variant === 'outlined'
  const iconSize = size === 'sm' ? 15 : 20

  const getIcon = (isHover: boolean) => {
    if (isOutlined) return ArrowRightDark
    if (isPrimary) return isHover ? ArrowRightDark : ArrowRightDark
    return isHover ? ArrowRightDark : ArrowRight
  }

  return (
    <button
      className={clsx(
        chevronButtonVariants({ variant, size }),
        disabled && 'pointer-events-none cursor-not-allowed opacity-40',
        disabled && isOutlined && 'border-[#e1e1e1]!',
        !disabled && 'cursor-pointer',
        className,
      )}
      disabled={disabled}
      {...props}
    >
      <span className="pointer-events-none absolute inset-0 flex -translate-x-8 items-center justify-center opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100">
        <Image src={getIcon(true)} alt="icon" width={iconSize} height={iconSize} />
      </span>

      <span className="relative flex items-center justify-center transition-all duration-200 ease-out group-hover:translate-x-8 group-hover:opacity-0">
        <Image src={getIcon(false)} alt="icon" width={iconSize} height={iconSize} />
      </span>
    </button>
  )
}
