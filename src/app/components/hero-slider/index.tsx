'use client'

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button/Button'
import { ArrowSlider } from '../arrow-slider'
import type { Media } from '@/payload-types'
import type { ContainerPropsType } from '@types-frontend/types'
import type { Swiper as SwiperInstance } from 'swiper'

import { SectionWrapper } from '../SectionWrapper'

export interface HeroSliderProps {
  slides: (Media | { image: Media | string | number })[]
  properties?: ContainerPropsType
}

interface HeroSlideProps {
  slide: Media
  index: number
  isActive: boolean
  isInitialRender: boolean
}

const HeroSlide = ({ slide, index, isActive, isInitialRender }: HeroSlideProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const currentPos = useRef({ x: 0, y: 0 })
  const targetPos = useRef({ x: 0, y: 0 })
  const scrollOffset = useRef(0)
  const rafId = useRef<number>(0)
  const prefersReducedMotion = useRef(false)
  const hasAnimatedIn = useRef(false)

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Scroll parallax
  useEffect(() => {
    const container = containerRef.current
    const bg = bgRef.current
    if (!container || !bg || prefersReducedMotion.current) return

    let ticking = false

    const updateTransform = () => {
      if (!bg) return
      const scale = 1.05 + scrollOffset.current * 0.0003
      bg.style.transform = `translate3d(${currentPos.current.x}px, ${scrollOffset.current * 0.3 + currentPos.current.y}px, 0) scale(${scale})`
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect()
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          scrollOffset.current = Math.max(0, -rect.top)
          updateTransform()
        }
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Parallax and Text animation using useGSAP
  useGSAP(() => {
    const container = containerRef.current
    const bg = bgRef.current
    const text = textRef.current
    const title = titleRef.current
    if (!container || !bg || !text || prefersReducedMotion.current) return

    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Mouse move parallax (only if active)
      if (isActive) {
        const onMove = (e: MouseEvent) => {
          const r = container.getBoundingClientRect()
          targetPos.current = {
            x: ((e.clientX - r.left) / r.width - 0.5) * 20,
            y: ((e.clientY - r.top) / r.height - 0.5) * 12,
          }
        }

        const animate = () => {
          currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.06
          currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.06

          const scale = 1.05 + scrollOffset.current * 0.0003
          if (bg) {
            bg.style.transform = `translate3d(${currentPos.current.x}px, ${scrollOffset.current * 0.3 + currentPos.current.y}px, 0) scale(${scale})`
          }

          rafId.current = requestAnimationFrame(animate)
        }

        rafId.current = requestAnimationFrame(animate)
        container.addEventListener('mousemove', onMove, { passive: true })

        return () => {
          cancelAnimationFrame(rafId.current)
          container.removeEventListener('mousemove', onMove)
        }
      }
    })

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Text and Background animations on slide change
      if (isInitialRender && !hasAnimatedIn.current) {
        if (isActive) {
          hasAnimatedIn.current = true
          gsap.set(text, { opacity: 1, y: 0 })
          if (title) gsap.set(title, { opacity: 1, y: 0 })
        }
        return
      }

      if (isActive) {
        hasAnimatedIn.current = true
        gsap.fromTo(
          text,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 },
        )
        if (title) {
          gsap.fromTo(
            title,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.2 },
          )
        }
        if (bg) {
          gsap.fromTo(bg, { scale: 1.12 }, { scale: 1.05, duration: 0.7, ease: 'power2.out' })
        }
      } else {
        gsap.to(text, { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' })
      }
    })

    return () => mm.revert()
  }, [isActive, isInitialRender])

  // Scroll parallax (always active if not reduced motion)
  useEffect(() => {
    const container = containerRef.current
    const bg = bgRef.current
    if (!container || !bg || prefersReducedMotion.current) return

    let ticking = false

    const updateTransform = () => {
      if (!bg) return
      const scale = 1.05 + scrollOffset.current * 0.0003
      bg.style.transform = `translate3d(${currentPos.current.x}px, ${scrollOffset.current * 0.3 + currentPos.current.y}px, 0) scale(${scale})`
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect()
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          scrollOffset.current = Math.max(0, -rect.top)
          updateTransform()
        }
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!slide || typeof slide !== 'object') return null

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[90vh] overflow-hidden bg-neutral-950"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{ transform: 'translate3d(0, 0, 0) scale(1.05)' }}
      >
        <Image
          src={slide?.url ?? ''}
          alt={slide?.alt ?? ''}
          fill
          sizes="100vw"
          className="object-cover"
          priority={index === 0}
        />
      </div>

      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      <div
        ref={textRef}
        className={cn(
          'absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6',
          isActive && isInitialRender ? 'opacity-100' : 'opacity-0',
        )}
      >
        <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent mb-4 sm:mb-6" />
        <h1
          ref={titleRef}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-tight text-white leading-tight drop-shadow-2xl"
        >
          {slide?.alt ?? 'Collection'}
        </h1>
        <div className="w-16 sm:w-20 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent mt-6 sm:mt-8" />
      </div>
    </div>
  )
}

const NavButton = ({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) => (
  <Button
    type="button"
    onClick={onClick}
    variant="slider"
    size="icon"
    leftIcon={
      <svg
        className="relative size-5 lg:size-6 text-white/70 transition-colors duration-300 group-hover:text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={direction === 'prev' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
      </svg>
    }
    aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'}
    className="hidden sm:flex size-12 lg:size-14 bg-white/5 text-white/70 hover:bg-white/20"
  />
)

const PaginationDot = ({
  isActive,
  onClick,
  index,
}: {
  isActive: boolean
  onClick: () => void
  index: number
}) => (
  <Button
    type="button"
    onClick={onClick}
    variant="text"
    size="icon"
    aria-label={`Go to slide ${index + 1}`}
    aria-current={isActive ? 'true' : undefined}
    className="group relative py-2"
  >
    <div
      className={cn(
        'h-0.5 transition-all duration-500',
        isActive
          ? 'w-8 sm:w-10 lg:w-12 bg-white'
          : 'w-4 sm:w-5 lg:w-6 bg-white/20 group-hover:bg-white/40',
      )}
    />
    {isActive && <div className="absolute inset-0 bg-white/30 blur-sm" aria-hidden="true" />}
  </Button>
)

export const HeroSlider = ({ slides, properties }: HeroSliderProps) => {
  const swiperRef = useRef<SwiperInstance | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isInitialRender, setIsInitialRender] = useState(true)

  const handleSlideChange = useCallback(
    (swiper: SwiperInstance) => {
      setActiveIndex(swiper.realIndex)
      if (isInitialRender) setIsInitialRender(false)
    },
    [isInitialRender],
  )

  const handlePrev = useCallback(() => swiperRef.current?.slidePrev(), [])
  const handleNext = useCallback(() => swiperRef.current?.slideNext(), [])
  const handleDotClick = useCallback(
    (index: number) => {
      swiperRef.current?.slideTo(index)
      if (isInitialRender) setIsInitialRender(false)
    },
    [isInitialRender],
  )

  const renderItems = useMemo(
    () =>
      slides.map((item, index) => {
        // Handle both Media object directly and Payload block structure { image: Media }
        const slide = (item && typeof item === 'object' && 'image' in item) 
          ? (item.image as Media) 
          : (item as Media);

        return {
          key: String(slide?.id ?? index),
          element: (
            <HeroSlide
              slide={slide}
              index={index}
              isActive={index === activeIndex}
              isInitialRender={isInitialRender}
            />
          ),
        }
      }),
    [slides, activeIndex, isInitialRender],
  )

  if (!slides?.length) return null

  return (
    <SectionWrapper containerProps={properties ?? {}} className="!max-w-none !px-0">
      <div className="relative w-full">
        <div className="absolute left-4 lg:left-[4%] top-1/2 -translate-y-1/2 z-30">
          <NavButton direction="prev" onClick={handlePrev} />
        </div>

        <div className="absolute right-4 lg:right-[4%] top-1/2 -translate-y-1/2 z-30">
          <NavButton direction="next" onClick={handleNext} />
        </div>

        <div
          className="absolute bottom-6 sm:bottom-8 lg:bottom-[5%] left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-3 items-center"
          role="tablist"
          aria-label="Slide navigation"
        >
          {slides.map((_, i) => (
            <PaginationDot
              key={i}
              index={i}
              isActive={i === activeIndex}
              onClick={() => handleDotClick(i)}
            />
          ))}
        </div>

        <div className="sm:hidden absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 text-white/40 text-xs">
          <svg
            className="size-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5l7 7-7 7" />
          </svg>
          <span>Swipe to explore</span>
        </div>

        <div className="[&_.arrow-slider-wrapper]:!m-0 [&_.swiper-pagination-external]:!hidden">
          <ArrowSlider
            swiperRef={swiperRef}
            renderItem={renderItems}
            showPagination={false}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            fade
            speed={800}
            slidesPerView={1}
            loop
            onSlideChange={handleSlideChange}
          />
        </div>
      </div>
    </SectionWrapper>
  )
}
