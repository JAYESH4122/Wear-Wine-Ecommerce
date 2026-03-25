'use client'

import clsx from 'clsx'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { SwiperClass } from 'swiper/react'
import { ArrowRight, ArrowRightDark } from 'assets'
import { Button } from '@/components/ui/button/Button'

interface SliderNavButtonsProps {
  swiperRef: React.RefObject<SwiperClass | null>
  variant?: 'primary' | 'secondary' | 'outlined'
  size?: 'sm' | 'lg'
  loop?: boolean
  children?: React.ReactNode
  SliderArrowClassname?: string
}

type NavigationEvent = 'slideChange' | 'reachBeginning' | 'reachEnd' | 'fromEdge' | 'init'

export const SliderNavButtons = ({
  swiperRef,
  variant = 'primary',
  size = 'lg',
  loop = false,
  children,
  SliderArrowClassname,
}: SliderNavButtonsProps) => {
  const [navigationState, setNavigationState] = useState({
    isAtStart: true,
    isAtEnd: false,
  })

  useEffect(() => {
    const swiper = swiperRef.current
    if (!swiper) return

    const updateNavigationState = () => {
      setNavigationState({
        isAtStart: swiper.isBeginning,
        isAtEnd: swiper.isEnd,
      })
    }

    const navigationEvents: NavigationEvent[] = [
      'slideChange',
      'reachBeginning',
      'reachEnd',
      'fromEdge',
      'init',
    ]

    navigationEvents.forEach((event) => {
      swiper.on(event, updateNavigationState)
    })

    updateNavigationState()

    const observer = new ResizeObserver(() => {
      swiper.update()
      updateNavigationState()
    })

    if (swiper.el) {
      observer.observe(swiper.el)
    }

    return () => {
      navigationEvents.forEach((event) => {
        swiper.off(event, updateNavigationState)
      })
      observer.disconnect()
    }
  }, [swiperRef])

  const isPrevDisabled = !loop && navigationState.isAtStart
  const isNextDisabled = !loop && navigationState.isAtEnd

  return (
    <div className={clsx('flex items-center gap-3', SliderArrowClassname)}>
      <Button
        onClick={() => swiperRef.current?.slidePrev()}
        disabled={isPrevDisabled}
        variant="icon"
        size="icon"
        className={clsx(
          'group relative overflow-hidden rounded-full shadow-xs',
          size === 'sm' ? 'h-9 w-9' : 'h-12 w-12',
          variant === 'primary' && 'bg-white hover:bg-neutral-100',
          variant === 'secondary' && 'bg-black hover:bg-gray-600',
          variant === 'outlined' && 'bg-transparent border border-black',
          'rotate-180',
        )}
        aria-label="Previous slide"
      >
        <span className="pointer-events-none absolute inset-0 flex -translate-x-8 items-center justify-center opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100">
          <Image
            src={variant === 'secondary' ? ArrowRight : ArrowRightDark}
            alt="icon"
            width={size === 'sm' ? 15 : 20}
            height={size === 'sm' ? 15 : 20}
          />
        </span>
        <span className="relative flex items-center justify-center transition-all duration-200 ease-out group-hover:translate-x-8 group-hover:opacity-0">
          <Image
            src={variant === 'secondary' ? ArrowRight : ArrowRightDark}
            alt="icon"
            width={size === 'sm' ? 15 : 20}
            height={size === 'sm' ? 15 : 20}
          />
        </span>
      </Button>

      {children}

      <Button
        onClick={() => swiperRef.current?.slideNext()}
        disabled={isNextDisabled}
        variant="icon"
        size="icon"
        className={clsx(
          'group relative overflow-hidden rounded-full shadow-xs',
          size === 'sm' ? 'h-9 w-9' : 'h-12 w-12',
          variant === 'primary' && 'bg-white hover:bg-neutral-100',
          variant === 'secondary' && 'bg-black hover:bg-gray-600',
          variant === 'outlined' && 'bg-transparent border border-black',
        )}
        aria-label="Next slide"
      >
        <span className="pointer-events-none absolute inset-0 flex -translate-x-8 items-center justify-center opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100">
          <Image
            src={variant === 'secondary' ? ArrowRight : ArrowRightDark}
            alt="icon"
            width={size === 'sm' ? 15 : 20}
            height={size === 'sm' ? 15 : 20}
          />
        </span>
        <span className="relative flex items-center justify-center transition-all duration-200 ease-out group-hover:translate-x-8 group-hover:opacity-0">
          <Image
            src={variant === 'secondary' ? ArrowRight : ArrowRightDark}
            alt="icon"
            width={size === 'sm' ? 15 : 20}
            height={size === 'sm' ? 15 : 20}
          />
        </span>
      </Button>
    </div>
  )
}
