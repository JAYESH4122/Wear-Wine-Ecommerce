import type { MouseEvent, ReactElement } from 'react'
import { cloneElement, forwardRef, isValidElement } from 'react'
import { cn } from '@/lib/utils'
import type { ButtonProps } from './button.types'
import { getButtonClasses, getIconClasses } from './button.styles'

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
      sliderDirection,
      noWrap = true,
      className,
      children,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading
    const hasOnlyIcon =
      Boolean(!children && (leftIcon || rightIcon || sliderDirection)) || size === 'icon'

    const classes = getButtonClasses({ variant, size, fullWidth, hasOnlyIcon, className })

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) {
        event.preventDefault()
        event.stopPropagation()
        return
      }
      onClick?.(event)
    }

    const childContent =
      asChild && isValidElement<{ children?: React.ReactNode }>(children)
        ? children.props.children
        : children

    const sliderIcon =
      variant === 'slider' && sliderDirection ? (
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d={sliderDirection === 'left' ? 'M8 2L4 6L8 10' : 'M4 2L8 6L4 10'} />
        </svg>
      ) : null

    const resolvedLeftIcon = leftIcon ?? sliderIcon

    const content = (
      <>
        <span
          className={cn(
            'relative z-10 inline-flex items-center justify-center gap-2 transition-colors duration-300',
            variant === 'slider' && 'group-hover:text-background-primary',
            loading && 'opacity-0',
            hasOnlyIcon && 'gap-0',
          )}
        >
          {resolvedLeftIcon ? (
            <span
              className={cn(
                getIconClasses({ variant, position: 'left' }),
                'relative z-10 transition-colors duration-300',
              )}
            >
              {resolvedLeftIcon}
            </span>
          ) : null}
          {childContent ? (
            <span className={cn(noWrap && 'whitespace-nowrap')}>{childContent}</span>
          ) : null}
          {rightIcon ? (
            <span
              className={cn(
                getIconClasses({ variant, position: 'right' }),
                'relative z-10 transition-colors duration-300',
              )}
            >
              {rightIcon}
            </span>
          ) : null}
        </span>
        {loading ? (
          <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </span>
        ) : null}
      </>
    )

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{
        className?: string
        onClick?: (event: MouseEvent<HTMLElement>) => void
        tabIndex?: number
      }>
      const childOnClick = child.props.onClick

      const mergedOnClick = (event: MouseEvent<HTMLElement>) => {
        if (isDisabled) {
          event.preventDefault()
          event.stopPropagation()
          return
        }
        childOnClick?.(event)
        onClick?.(event as unknown as MouseEvent<HTMLButtonElement>)
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return cloneElement(child as ReactElement<any>, {
        ...rest,
        onClick: mergedOnClick,
        className: cn(classes, child.props.className),
        'aria-busy': loading || undefined,
        'aria-disabled': isDisabled || undefined,
        tabIndex: isDisabled ? -1 : child.props.tabIndex,
        children: content,
      })
    }

    return (
      <button
        {...rest}
        ref={ref}
        type={type}
        className={classes}
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
