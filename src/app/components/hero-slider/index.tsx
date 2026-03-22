'use client'
import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ArrowSlider } from '../arrow-slider'
import type { Media } from '@/payload-types'

gsap.registerPlugin(DrawSVGPlugin)

export interface HeroSliderProps {
  slides: Media[]
}

const HeroSlide = ({
  slide,
  index,
  isActive,
}: {
  slide: Media
  index: number
  isActive: boolean
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
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

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-[400px] lg:h-[800px] overflow-hidden bg-[#0a0a0a]"
    >
      <div ref={bgRef} className="absolute -inset-[6%] will-change-transform">
        <Image
          src={slide.url || ''}
          alt={slide.alt || ''}
          fill
          className="object-cover"
          priority={index === 0}
        />
      </div>
      <div className="absolute inset-0 pointer-events-none z-[2] bg-black/35" />
      <div className="absolute inset-0 pointer-events-none z-[3] bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.25)_100%)]" />
    </div>
  )
}



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
      ease: 'none',
    })

    return () => {
      if (progressTween.current) {
        progressTween.current.kill()
      }
    }
  }, [activeIndex])

  return (
    <div className="relative">
      <div className="absolute top-[5%] right-[5%] z-30 font-mono text-[12px] text-white/30 tracking-[0.15em]">
        <span className="text-white/70">{String(activeIndex + 1).padStart(2, '0')}</span>
        <span className="mx-2">/</span>
        <span>{String(slides.length).padStart(2, '0')}</span>
      </div>

      <div className="absolute right-[4%] top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
        {(['prev', 'next'] as const).map((dir) => (
          <button
            key={dir}
            onClick={() =>
              dir === 'prev' ? swiperRef.current?.slidePrev() : swiperRef.current?.slideNext()
            }
            className="w-11 h-11 flex items-center justify-center cursor-pointer text-white/70 border border-white/15 bg-black/30 backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-black/50"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {dir === 'prev' ? <path d="M8 2L4 6L8 10" /> : <path d="M4 2L8 6L4 10" />}
            </svg>
          </button>
        ))}
      </div>

      <div className="absolute bottom-[5.5%] right-[5%] z-30 flex gap-2 items-center">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => swiperRef.current?.slideTo(i)}
            className={`h-[2px] cursor-pointer transition-all duration-500 ${
              i === activeIndex ? 'w-10 bg-white/80' : 'w-5 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30 h-[2px] bg-white/5">
        <div ref={progressRef} className="h-full bg-white/50" />
      </div>


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
  )
}