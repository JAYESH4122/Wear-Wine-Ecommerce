'use client'

import clsx from 'clsx'
import { useEffect, useState } from 'react'
import type { SwiperClass } from 'swiper/react'
import { ChevronButton } from './chevron-button'

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
      <ChevronButton
        onClick={() => swiperRef.current?.slidePrev()}
        disabled={isPrevDisabled}
        variant={variant}
        size={size}
        className="rotate-180"
        aria-label="Previous slide"
      />

      {children}

      <ChevronButton
        onClick={() => swiperRef.current?.slideNext()}
        disabled={isNextDisabled}
        variant={variant}
        size={size}
        aria-label="Next slide"
      />
    </div>
  )
}
