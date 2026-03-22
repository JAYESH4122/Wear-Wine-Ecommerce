'use client'
import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ArrowSlider } from '../arrow-slider'
import type { HeroSlide as HeroSlideData } from '@/types'

export interface HeroSliderProps {
  slides: HeroSlideData[]
}

const HeroSlide = ({
  slide,
  index,
  isActive,
}: {
  slide: HeroSlideData
  index: number
  isActive: boolean
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect()
      target.current = {
        x: (e.clientX - r.left) / r.width - 0.5,
        y: (e.clientY - r.top) / r.height - 0.5,
      }
    }

    const ticker = () => {
      const t = target.current
      const c = current.current
      c.x += (t.x - c.x) * 0.055
      c.y += (t.y - c.y) * 0.055

      if (bgRef.current) {
        gsap.set(bgRef.current, {
          x: c.x * 13,
          y: c.y * 8,
          scale: isActive ? 1 : 1.06,
        })
      }
    }

    gsap.ticker.add(ticker)
    container.addEventListener('mousemove', onMove)

    return () => {
      gsap.ticker.remove(ticker)
      container.removeEventListener('mousemove', onMove)
    }
  }, [isActive])

  useEffect(() => {
    if (!textRef.current) return
    const els = textRef.current.querySelectorAll('[data-animate]')

    if (isActive) {
      gsap.fromTo(
        els,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.3,
        }
      )
    } else {
      gsap.set(els, { y: 40, opacity: 0 })
    }
  }, [isActive])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[90vh] overflow-hidden bg-[#0a0a0a]"
    >
      {/* Image */}
      <div ref={bgRef} className="absolute inset-0 w-full h-full will-change-transform">
        <Image
          src={slide.url || ''}
          alt={slide.alt || ''}
          fill
          sizes="100vw"
          className="object-cover"
          priority={index === 0}
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 pointer-events-none z-[2] bg-black/35" />
      <div className="absolute inset-0 pointer-events-none z-[3] bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.25)_100%)]" />

      {/* Centered Text Content */}
      <div
        ref={textRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6"
      >
        <div data-animate className="overflow-hidden mb-4 sm:mb-6">
          <span className="inline-block w-8 sm:w-12 h-[1px] bg-white/50" />
        </div>

        <div data-animate className="overflow-hidden">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-[-0.02em] text-white leading-[1.1]">
            {slide.alt || 'Collection'}
          </h1>
        </div>

        <div data-animate className="overflow-hidden mt-4 sm:mt-6">
          <span className="inline-block w-8 sm:w-12 h-[1px] bg-white/50" />
        </div>
      </div>
    </div>
  )
}

const NavButton = ({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 flex items-center justify-center cursor-pointer text-white/70 border border-white/15 bg-black/30 backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-black/50"
  >
    <svg
      className="w-3 h-3 sm:w-3.5 sm:h-3.5"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === 'prev' ? <path d="M8 2L4 6L8 10" /> : <path d="M4 2L8 6L4 10" />}
    </svg>
  </button>
)

export const HeroSlider = ({ slides }: HeroSliderProps) => {
  const swiperRef = useRef<any>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const progressRef = useRef<HTMLDivElement>(null)
  const progressTween = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    if (!progressRef.current) return
    
    if (progressTween.current) {
      progressTween.current.kill()
    }
    
    gsap.set(progressRef.current, { width: '0%' })
    progressTween.current = gsap.to(progressRef.current, { 
      width: '100%', 
      duration: 5, 
      ease: 'none' 
    })

    return () => {
      if (progressTween.current) {
        progressTween.current.kill()
      }
    }
  }, [activeIndex])

  return (
    <div className="relative w-full">
      {/* Counter */}
      <div className="absolute top-4 sm:top-6 lg:top-[5%] right-4 sm:right-6 lg:right-[5%] z-30 text-[10px] sm:text-[11px] lg:text-[12px] text-white/30 tracking-[0.15em]">
        <span className="text-white/70">{String(activeIndex + 1).padStart(2, '0')}</span>
        <span className="mx-1.5 sm:mx-2">/</span>
        <span>{String(slides.length).padStart(2, '0')}</span>
      </div>

      {/* Left nav */}
      <div className="absolute left-3 sm:left-4 lg:left-[4%] top-1/2 -translate-y-1/2 z-30">
        <NavButton direction="prev" onClick={() => swiperRef.current?.slidePrev()} />
      </div>

      {/* Right nav */}
      <div className="absolute right-3 sm:right-4 lg:right-[4%] top-1/2 -translate-y-1/2 z-30">
        <NavButton direction="next" onClick={() => swiperRef.current?.slideNext()} />
      </div>

      {/* Dot pagination */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-[5%] left-1/2 -translate-x-1/2 z-30 flex gap-1.5 sm:gap-2 items-center">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => swiperRef.current?.slideTo(i)}
            className={`h-[2px] cursor-pointer transition-all duration-500 ${
              i === activeIndex
                ? 'w-6 sm:w-8 lg:w-10 bg-white/80'
                : 'w-3 sm:w-4 lg:w-5 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Progress bar - inside the slider */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-[2px] bg-white/5">
        <div ref={progressRef} className="h-full bg-white/50" />
      </div>

      {/* Slider wrapper to prevent extra space */}
      <div className="[&_.arrow-slider-wrapper]:!m-0 [&_.swiper-pagination-external]:!hidden">
        <ArrowSlider
          swiperRef={swiperRef}
          renderItem={slides.map((slide, index) => ({
            key: `${slide.id}`,
            element: <HeroSlide slide={slide} index={index} isActive={index === activeIndex} />,
          }))}
          showPagination={false}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          fade
          speed={1400}
          slidesPerView={1}
          loop
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        />
      </div>
    </div>
  )
}
