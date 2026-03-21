'use client'
import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ArrowSlider } from '../arrow-slider'
import type { Media } from '@/payload-types'

export interface HeroSliderProps {
  slides: Media[]
}

const SLIDE_META = [
  {
    eyebrow: 'New Collection 2025',
    lines: ['The Art of', 'Silence'],
    italic: 1,
    sub: 'Elevated essentials — minimal form',
    cta: 'Discover',
  },
  {
    eyebrow: 'Editorial',
    lines: ['Dressed', 'in Light'],
    italic: 1,
    sub: 'Fluid silhouettes — autumn ritual',
    cta: 'Explore',
  },
  {
    eyebrow: 'Winter 2025',
    lines: ['Noir', 'Couture'],
    italic: 0,
    sub: 'Shadow and form — pure contrast',
    cta: 'Shop Now',
  },
  {
    eyebrow: 'Signature Series',
    lines: ['Grace', 'in Motion'],
    italic: 1,
    sub: 'Timeless craft — structured freedom',
    cta: 'View Lookbook',
  },
]

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
  const textRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  const meta = SLIDE_META[index % SLIDE_META.length]

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
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.12,
          ease: 'power4.out',
          delay: 0.2,
        }
      )
    } else {
      gsap.set(els, { y: 60, opacity: 0 })
    }
  }, [isActive])

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-[400px] lg:h-[800px] overflow-hidden bg-[#0a0a0a]"
    >
      {/* Image */}
      <div ref={bgRef} className="absolute -inset-[6%] will-change-transform">
        <Image
          src={slide.url || ''}
          alt={slide.alt || ''}
          fill
          className="object-cover"
          priority={index === 0}
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 pointer-events-none z-[2] bg-black/30" />
      <div className="absolute inset-0 pointer-events-none z-[3] bg-[linear-gradient(to_top,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.2)_50%,transparent_100%)]" />
      <div className="absolute inset-0 pointer-events-none z-[3] bg-[linear-gradient(to_right,rgba(0,0,0,0.4)_0%,transparent_50%)]" />

      {/* Text Content */}
      <div
        ref={textRef}
        className="absolute bottom-0 left-0 z-10 px-8 lg:px-16 pb-16 lg:pb-24 max-w-[720px]"
      >
        {/* Eyebrow */}
        <div data-animate className="overflow-hidden mb-6">
          <span className="inline-flex items-center gap-4">
            <span className="block w-12 h-[1px] bg-white/30" />
            <span className="font-sans text-[10px] lg:text-[11px] font-medium tracking-[0.3em] uppercase text-white/50">
              {meta.eyebrow}
            </span>
          </span>
        </div>

        {/* Headline */}
        <div data-animate className="overflow-hidden mb-6">
          <h1 className="font-serif text-[clamp(42px,8vw,96px)] font-light leading-[0.9] tracking-[-0.03em] text-white">
            {meta.lines.map((line, i) => (
              <React.Fragment key={i}>
                {i > 0 && <br />}
                {i === meta.italic ? (
                  <em className="italic font-normal text-white/70">{line}</em>
                ) : (
                  <span>{line}</span>
                )}
              </React.Fragment>
            ))}
          </h1>
        </div>

        {/* Subtitle */}
        <div data-animate className="overflow-hidden mb-10">
          <p className="font-sans text-[12px] lg:text-[13px] tracking-[0.2em] text-white/40 uppercase">
            {meta.sub}
          </p>
        </div>

        {/* CTA */}
        <div data-animate className="overflow-hidden">
          <button className="group relative inline-flex items-center gap-4 font-sans text-[11px] font-medium tracking-[0.25em] uppercase text-white py-4 cursor-pointer">
            <span className="relative z-10">{meta.cta}</span>
            <span className="relative z-10 flex items-center">
              <span className="block w-10 h-[1px] bg-white/60 transition-all duration-500 group-hover:w-14" />
              <svg
                className="w-3 h-3 -ml-1 transition-transform duration-500 group-hover:translate-x-1"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M4 2L8 6L4 10" />
              </svg>
            </span>
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/20 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
          </button>
        </div>
      </div>
    </div>
  )
}

export const HeroSlider = ({ slides }: HeroSliderProps) => {
  const swiperRef = useRef<any>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!progressRef.current) return
    gsap.fromTo(progressRef.current, { width: '0%' }, { width: '100%', duration: 5, ease: 'none' })
  }, [activeIndex])

  return (
    <div className="relative">
      {/* Counter */}
      <div className="absolute top-[5%] right-[5%] z-30 font-mono text-[12px] text-white/30 tracking-[0.15em]">
        <span className="text-white/70">{String(activeIndex + 1).padStart(2, '0')}</span>
        <span className="mx-2">/</span>
        <span>{String(slides.length).padStart(2, '0')}</span>
      </div>

      {/* Vertical nav */}
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

      {/* Dot pagination */}
      <div className="absolute bottom-[5.5%] right-[5%] z-30 flex gap-2 items-center">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => swiperRef.current?.slideTo(i)}
            className={`h-[2px] cursor-pointer transition-all duration-500 ${
              i === activeIndex
                ? 'w-10 bg-white/80'
                : 'w-5 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
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