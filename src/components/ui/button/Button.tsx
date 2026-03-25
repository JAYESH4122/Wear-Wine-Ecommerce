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
      className,
      children,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading
    const hasOnlyIcon = Boolean(!children && (leftIcon || rightIcon)) || size === 'icon'

    const classes = getButtonClasses({
      variant,
      size,
      fullWidth,
      hasOnlyIcon,
      className,
    })

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

    const content = (
      <>
        <span
          className={cn(
            'inline-flex items-center gap-2',
            loading && 'opacity-0',
            hasOnlyIcon && 'gap-0',
          )}
        >
          {leftIcon ? (
            <span className={getIconClasses({ variant, position: 'left' })}>{leftIcon}</span>
          ) : null}
          {childContent ? <span className="whitespace-nowrap">{childContent}</span> : null}
          {rightIcon ? (
            <span className={getIconClasses({ variant, position: 'right' })}>{rightIcon}</span>
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
