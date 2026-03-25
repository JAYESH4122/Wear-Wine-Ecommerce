'use client'

import {
  type MouseEvent,
  type ReactElement,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import { cn } from '@/lib/utils'
import type { ButtonProps } from './button.types'
import { getButtonClasses, getIconClasses } from './button.styles'
import { OverlayStrips, attachOverlayAnimation } from './button-overlay/button-overlay'
import { attachSliderAnimation } from './button-slider/index'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      type = 'button',
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      fullWidth,
      asChild = false,
      className,
      children,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const isPrimary = variant === 'primary'
    const isSecondary = variant === 'secondary'
    const isSlider = variant === 'slider'
    const hasOverlay = isPrimary || isSecondary

    const btnRef = useRef<HTMLButtonElement>(null)
    const topRef = useRef<HTMLSpanElement>(null)
    const bottomRef = useRef<HTMLSpanElement>(null)

    const isDisabled = disabled || loading

    useEffect(() => {
      if (!hasOverlay) return
      return attachOverlayAnimation(btnRef, topRef, bottomRef)
    }, [hasOverlay])

    useEffect(() => {
      if (!isSlider) return
      return attachSliderAnimation(btnRef)
    }, [isSlider])

    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        if (isDisabled) {
          event.preventDefault()
          event.stopPropagation()
          return
        }
        onClick?.(event)
      },
      [isDisabled, onClick],
    )

    const mergedRef = useCallback(
      (node: HTMLButtonElement | null) => {
        ;(btnRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
      },
      [ref],
    )

    const hasOnlyIcon = Boolean(!children && (leftIcon || rightIcon)) || size === 'icon'
    const buttonClasses = getButtonClasses({ variant, size, fullWidth, hasOnlyIcon, className })

    const stripFillClass = isPrimary ? 'bg-white' : 'bg-button-primary'

    const textHoverClass = isPrimary
      ? 'group-hover:text-button-primary'
      : isSecondary
        ? 'group-hover:text-white'
        : ''

    const childContent =
      asChild && isValidElement<{ children?: React.ReactNode }>(children)
        ? children.props.children
        : children

    const content = (
      <>
        {hasOverlay && (
          <OverlayStrips topRef={topRef} bottomRef={bottomRef} fillClass={stripFillClass} />
        )}

        <span
          className={cn(
            'relative z-10 inline-flex items-center gap-2 transition-colors duration-[350ms] ease-in-out',
            textHoverClass,
            loading && 'opacity-0',
            hasOnlyIcon && 'gap-0',
          )}
        >
          {leftIcon && (
            <span className={getIconClasses({ variant, position: 'left' })}>{leftIcon}</span>
          )}
          {childContent && <span className="whitespace-nowrap">{childContent}</span>}
          {rightIcon && (
            <span className={getIconClasses({ variant, position: 'right' })}>{rightIcon}</span>
          )}
        </span>

        {loading && (
          <span
            aria-hidden="true"
            className="absolute inset-0 z-20 flex items-center justify-center"
          >
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </span>
        )}
      </>
    )

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{
        className?: string
        onClick?: (e: MouseEvent<HTMLElement>) => void
        tabIndex?: number
      }>

      return cloneElement(child as ReactElement<Record<string, unknown>>, {
        ...rest,
        className: cn(buttonClasses, child.props.className),
        'aria-busy': loading || undefined,
        'aria-disabled': isDisabled || undefined,
        tabIndex: isDisabled ? -1 : child.props.tabIndex,
        onClick: (e: MouseEvent<HTMLElement>) => {
          if (isDisabled) {
            e.preventDefault()
            e.stopPropagation()
            return
          }
          child.props.onClick?.(e)
          onClick?.(e as unknown as MouseEvent<HTMLButtonElement>)
        },
        children: content,
      })
    }

    return (
      <button
        {...rest}
        ref={mergedRef}
        type={type}
        className={buttonClasses}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        onClick={handleClick}
      >
        {content}
      </button>
    )
  },
)

Button.displayName = 'Button'
