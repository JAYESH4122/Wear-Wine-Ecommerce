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
  const shapesRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  const meta = SLIDE_META[index % SLIDE_META.length]

  // Parallax mouse tracking with GSAP
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
      if (shapesRef.current) {
        gsap.set(shapesRef.current, {
          x: c.x * -24,
          y: c.y * -16,
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

  // Text animation
  useEffect(() => {
    if (!textRef.current) return

    gsap.to(textRef.current, {
      y: isActive ? 0 : 18,
      opacity: isActive ? 1 : 0,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out',
    })
  }, [isActive])

  // Shape animations
  useEffect(() => {
    const shapes = shapesRef.current?.children
    if (!shapes) return

    const ctx = gsap.context(() => {
      // Circle float
      gsap.to(shapes[0], {
        y: -20,
        rotation: 4,
        duration: 4.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      // Blob morph
      gsap.to(shapes[1], {
        y: -13,
        rotation: -5,
        duration: 3.7,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1,
      })

      // Vertical line pulse
      gsap.to(shapes[2], {
        scaleY: 1.25,
        opacity: 1,
        duration: 3.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      // Diamond spin
      gsap.to(shapes[3], {
        rotation: 62,
        y: -9,
        duration: 6.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 0.5,
      })

      // Ellipse float
      gsap.to(shapes[4], {
        y: 8,
        rotation: 3,
        duration: 5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      // Horizontal line pulse
      gsap.to(shapes[5], {
        scaleX: 1.25,
        opacity: 1,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2,
      })
    }, shapesRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-[400px] lg:h-[800px] overflow-hidden bg-[rgb(5,9,20)]"
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
      <div className="absolute inset-0 pointer-events-none z-[2] bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_30%,rgba(5,9,20,0.6)_100%)]" />
      <div className="absolute inset-0 pointer-events-none z-[3] bg-[linear-gradient(to_top,rgba(5,9,20,0.88)_0%,rgba(5,9,20,0.3)_28%,transparent_55%)]" />
      <div className="absolute inset-0 pointer-events-none z-[3] bg-[linear-gradient(to_bottom,rgba(5,9,20,0.45)_0%,transparent_35%)]" />
      <div className="absolute inset-0 pointer-events-none z-[3] bg-[linear-gradient(to_right,rgba(5,9,20,0.55)_0%,transparent_42%,rgba(5,9,20,0.2)_100%)]" />
      <div className="absolute inset-0 pointer-events-none z-[4] bg-[radial-gradient(ellipse_55%_70%_at_65%_35%,rgba(255,248,235,0.07)_0%,transparent_65%)] mix-blend-screen" />

      {/* Shapes */}
      <div
        ref={shapesRef}
        className="absolute inset-0 pointer-events-none z-[5] will-change-transform"
      >
        {/* Circle */}
        <div className="absolute rounded-full w-[min(38vw,420px)] h-[min(38vw,420px)] -top-[12%] -right-[8%] bg-[radial-gradient(circle_at_40%_40%,rgba(82,87,91,0.14)_0%,rgba(29,27,27,0.05)_55%,transparent_70%)] border border-white/[0.04]" />

        {/* Blob */}
        <div
          className="absolute w-[min(12vw,150px)] h-[min(12vw,150px)] bottom-[14%] left-[5%] bg-[rgba(5,9,20,0.12)] border border-white/[0.08]"
          style={{ borderRadius: '32% 68% 68% 32% / 30% 30% 70% 70%' }}
        />

        {/* Vertical line */}
        <div className="absolute w-[2px] h-[20vh] top-[16%] left-[42%] bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.18),transparent)] opacity-50" />

        {/* Diamond */}
        <div className="absolute w-[min(3vw,32px)] h-[min(3vw,32px)] top-[22%] right-[14%] border border-white/[0.14] rotate-45" />

        {/* Ellipse */}
        <div className="absolute rounded-full w-[min(22vw,260px)] h-[min(8vw,80px)] top-[48%] -left-[5%] bg-[rgba(82,87,91,0.07)] blur-[3px]" />

        {/* Horizontal line */}
        <div className="absolute w-[90px] h-[1px] bottom-[30%] right-[8%] bg-[linear-gradient(to_left,transparent,rgba(255,255,255,0.22),transparent)] opacity-50" />
      </div>

      {/* Text */}
      <div
        ref={textRef}
        className="absolute bottom-0 left-0 z-10 px-[6vw] pb-[6vh] max-w-[640px] opacity-0 translate-y-[18px]"
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="block w-8 h-px bg-[rgba(245,242,238,0.35)] shrink-0" />
          <span className="font-[Didact_Gothic] text-[11px] tracking-[0.28em] uppercase text-[rgba(245,242,238,0.5)]">
            {meta.eyebrow}
          </span>
        </div>

        <h1 className="font-[Cormorant_Garamond] font-light text-[clamp(36px,6.5vw,78px)] leading-[0.95] text-[#f5f2ee] tracking-tight mb-4">
          {meta.lines.map((line, i) => (
            <React.Fragment key={i}>
              {i > 0 && <br />}
              {i === meta.italic ? (
                <em className="italic text-[rgba(245,242,238,0.72)]">{line}</em>
              ) : (
                line
              )}
            </React.Fragment>
          ))}
        </h1>

        <p className="font-[Didact_Gothic] text-[11px] tracking-[0.15em] text-[rgba(245,242,238,0.4)] uppercase mb-8">
          {meta.sub}
        </p>

        <button className="group inline-flex items-center gap-3.5 font-[Didact_Gothic] text-[10px] tracking-[0.22em] uppercase text-[#f5f2ee] px-[26px] py-[13px] border border-[rgba(245,242,238,0.22)] bg-[rgba(5,9,20,0.25)] backdrop-blur-[8px] cursor-pointer transition-all duration-300 hover:border-[rgba(245,242,238,0.45)] hover:bg-[rgba(5,9,20,0.45)]">
          {meta.cta}
          <span className="relative inline-block w-[26px] h-px bg-[rgba(245,242,238,0.55)]">
            <span className="absolute right-0 -top-[3px] w-1.5 h-1.5 border-r border-t border-[rgba(245,242,238,0.55)] rotate-45" />
          </span>
        </button>
      </div>
    </div>
  )
}

export const HeroSlider = ({ slides }: HeroSliderProps) => {
  const swiperRef = useRef<any>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const progressRef = useRef<HTMLDivElement>(null)

  // Progress bar animation with GSAP
  useEffect(() => {
    if (!progressRef.current) return

    gsap.fromTo(progressRef.current, { width: '0%' }, { width: '100%', duration: 5, ease: 'none' })
  }, [activeIndex])

  return (
    <div className="relative">
      {/* Counter */}
      <div className="absolute top-[5%] right-[5%] z-30 font-[Cormorant_Garamond] text-[13px] text-[rgba(245,242,238,0.32)] tracking-[0.12em]">
        <span className="text-[rgba(245,242,238,0.65)]">
          {String(activeIndex + 1).padStart(2, '0')}
        </span>{' '}
        / {String(slides.length).padStart(2, '0')}
      </div>

      {/* Vertical nav */}
      <div className="absolute right-[4%] top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
        {(['prev', 'next'] as const).map((dir) => (
          <button
            key={dir}
            onClick={() =>
              dir === 'prev' ? swiperRef.current?.slidePrev() : swiperRef.current?.slideNext()
            }
            className="w-11 h-11 flex items-center justify-center cursor-pointer text-[rgba(245,242,238,0.75)] border border-[rgba(245,242,238,0.18)] bg-[rgba(5,9,20,0.3)] backdrop-blur-[12px] transition-all duration-200 hover:border-[rgba(245,242,238,0.5)] hover:bg-[rgba(5,9,20,0.55)]"
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
      <div className="absolute bottom-[5.5%] right-[5%] z-30 flex gap-[7px] items-center">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => swiperRef.current?.slideTo(i)}
            className={`h-px cursor-pointer transition-all duration-[400ms] ${
              i === activeIndex
                ? 'w-11 bg-[rgba(245,242,238,0.75)]'
                : 'w-[22px] bg-[rgba(245,242,238,0.22)] hover:bg-[rgba(245,242,238,0.4)]'
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-px bg-[rgba(245,242,238,0.1)]">
        <div ref={progressRef} className="h-full bg-[rgba(245,242,238,0.55)]" />
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
