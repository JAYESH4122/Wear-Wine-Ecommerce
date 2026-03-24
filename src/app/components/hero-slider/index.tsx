'use client'

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { ArrowSlider } from '../arrow-slider'
import type { Media } from '@/payload-types'

export interface HeroSliderProps {
  slides: Media[]
}

interface HeroSlideProps {
  slide: Media
  index: number
  isActive: boolean
}

const HeroSlide = ({ slide, index, isActive }: HeroSlideProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const currentPos = useRef({ x: 0, y: 0 })
  const targetPos = useRef({ x: 0, y: 0 })
  const rafId = useRef<number>(0)
  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Optimized mouse parallax - RAF based
  useEffect(() => {
    const container = containerRef.current
    if (!container || !isActive || prefersReducedMotion.current) return

    const onMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect()
      targetPos.current = {
        x: ((e.clientX - r.left) / r.width - 0.5) * 20,
        y: ((e.clientY - r.top) / r.height - 0.5) * 12,
      }
    }

    const animate = () => {
      const t = targetPos.current
      const c = currentPos.current
      c.x += (t.x - c.x) * 0.06
      c.y += (t.y - c.y) * 0.06

      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${c.x}px, ${c.y}px, 0) scale(1.05)`
      }
      rafId.current = requestAnimationFrame(animate)
    }

    rafId.current = requestAnimationFrame(animate)
    container.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      cancelAnimationFrame(rafId.current)
      container.removeEventListener('mousemove', onMove)
    }
  }, [isActive])

  // Simplified entrance animation
  useEffect(() => {
    if (!textRef.current || prefersReducedMotion.current) return

    const ctx = gsap.context(() => {
      if (isActive) {
        // Quick fade in for text container
        gsap.fromTo(
          textRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.15 },
        )

        // Simple title animation
        if (titleRef.current) {
          gsap.fromTo(
            titleRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.25 },
          )
        }

        // Background zoom
        if (bgRef.current) {
          gsap.fromTo(
            bgRef.current,
            { scale: 1.15 },
            { scale: 1.05, duration: 0.8, ease: 'power2.out' },
          )
        }
      } else {
        gsap.to(textRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          ease: 'power2.in',
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [isActive])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[90vh] overflow-hidden bg-neutral-950"
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{ transform: 'translate3d(0, 0, 0) scale(1.05)' }}
      >
        <Image
          src={slide.url ?? ''}
          alt={slide.alt ?? ''}
          fill
          sizes="100vw"
          className="object-cover"
          priority={index === 0}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      {/* Text Content */}
      <div
        ref={textRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 opacity-0"
      >
        <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent mb-4 sm:mb-6" />

        <h1
          ref={titleRef}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight text-white leading-tight drop-shadow-2xl"
        >
          {slide.alt ?? 'Collection'}
        </h1>

        <div className="w-16 sm:w-20 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent mt-6 sm:mt-8" />
      </div>
    </div>
  )
}

interface NavButtonProps {
  direction: 'prev' | 'next'
  onClick: () => void
}

const NavButton = ({ direction, onClick }: NavButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className="hidden sm:flex group relative size-12 lg:size-14 items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110"
    aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'}
  >
    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-full transition-colors duration-300 group-hover:bg-white/20" />
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
  </button>
)

interface PaginationDotProps {
  isActive: boolean
  onClick: () => void
  index: number
}

const PaginationDot = ({ isActive, onClick, index }: PaginationDotProps) => (
  <button
    type="button"
    onClick={onClick}
    className="group relative cursor-pointer py-2"
    aria-label={`Go to slide ${index + 1}`}
    aria-current={isActive ? 'true' : undefined}
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
  </button>
)

export const HeroSlider = ({ slides }: HeroSliderProps) => {
  const swiperRef = useRef<any>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handlePrev = useCallback(() => {
    swiperRef.current?.slidePrev()
  }, [])

  const handleNext = useCallback(() => {
    swiperRef.current?.slideNext()
  }, [])

  const handleDotClick = useCallback((index: number) => {
    swiperRef.current?.slideTo(index)
  }, [])

  const handleSlideChange = useCallback((swiper: any) => {
    setActiveIndex(swiper.realIndex)
  }, [])

  const renderItems = useMemo(
    () =>
      slides.map((slide, index) => ({
        key: String(slide.id),
        element: <HeroSlide slide={slide} index={index} isActive={index === activeIndex} />,
      })),
    [slides, activeIndex],
  )

  if (!slides.length) return null

  return (
    <div className="relative w-full">
      {/* Left nav */}
      <div className="absolute left-4 lg:left-[4%] top-1/2 -translate-y-1/2 z-30">
        <NavButton direction="prev" onClick={handlePrev} />
      </div>

      {/* Right nav */}
      <div className="absolute right-4 lg:right-[4%] top-1/2 -translate-y-1/2 z-30">
        <NavButton direction="next" onClick={handleNext} />
      </div>

      {/* Pagination */}
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

      {/* Mobile swipe hint */}
      <div className="absolute bottom-20 sm:hidden left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 text-white/40 text-xs">
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

      {/* Slider */}
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
  )
}
