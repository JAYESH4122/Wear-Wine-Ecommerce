'use client'

import React, { useRef, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export interface GalleryImage {
  id: number
  src: string
  title: string
  label: string
  description?: string
}

interface ImageCardProps {
  image: GalleryImage
  index: number
  className?: string
}

/**
 * ImageCard - Dual-Engine (Mouse & Touch) GSAP Component
 */
export const ImageCard = ({ image, index, className }: ImageCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const lightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    const img = imageRef.current
    const overlay = overlayRef.current
    const light = lightRef.current
    if (!card || !img || !overlay || !light) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      /**
       * 1. DESKTOP LOGIC (Pointer: Fine)
       * Uses quickTo for high-frequency mouse tracking
       */
      mm.add('(pointer: fine)', () => {
        const xTo = gsap.quickTo(card, 'rotateY', { duration: 0.7, ease: 'power2.out' })
        const yTo = gsap.quickTo(card, 'rotateX', { duration: 0.7, ease: 'power2.out' })
        const lightX = gsap.quickTo(light, 'xPercent', { duration: 0.4, ease: 'power1.out' })
        const lightY = gsap.quickTo(light, 'yPercent', { duration: 0.4, ease: 'power1.out' })

        const onMouseMove = (e: MouseEvent) => {
          const { left, top, width, height } = card.getBoundingClientRect()
          const x = (e.clientX - left) / width - 0.5
          const y = (e.clientY - top) / height - 0.5
          xTo(x * 8)
          yTo(y * -8)
          lightX(x * 100)
          lightY(y * 100)
        }

        const onMouseEnter = () => {
          gsap.to(overlay, { opacity: 0.1, duration: 0.6 })
          gsap.to(img, {
            scale: 1.05,
            filter: 'grayscale(0%) brightness(1)',
            duration: 0.8,
            ease: 'power2.out',
          })
          gsap.to(light, { opacity: 1, duration: 0.6 })
        }

        const onMouseLeave = () => {
          xTo(0)
          yTo(0)
          gsap.to(overlay, { opacity: 0.3, duration: 0.6 })
          gsap.to(img, { scale: 1, filter: 'grayscale(20%) brightness(0.9)', duration: 0.8 })
          gsap.to(light, { opacity: 0, duration: 0.6 })
        }

        card.addEventListener('mousemove', onMouseMove)
        card.addEventListener('mouseenter', onMouseEnter)
        card.addEventListener('mouseleave', onMouseLeave)
      })

      /**
       * 2. MOBILE LOGIC (Pointer: Coarse)
       * Passive ambient movement + Tactile touch feedback
       */
      mm.add('(pointer: coarse)', () => {
        // Passive "Breathing" effect to signal interactivity
        gsap.to(img, {
          yPercent: 3,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.2,
        })

        const onTouchStart = () => {
          gsap.to(overlay, { opacity: 0.1, duration: 0.3 })
          gsap.to(img, { scale: 1.03, filter: 'grayscale(0%) brightness(1)', duration: 0.4 })
          // Soft centered spotlight on touch
          gsap.to(light, { opacity: 0.8, duration: 0.4, xPercent: 0, yPercent: 0 })
        }

        const onTouchEnd = () => {
          gsap.to(overlay, { opacity: 0.3, duration: 0.4 })
          gsap.to(img, { scale: 1, filter: 'grayscale(20%) brightness(0.9)', duration: 0.4 })
          gsap.to(light, { opacity: 0, duration: 0.4 })
        }

        card.addEventListener('touchstart', onTouchStart, { passive: true })
        card.addEventListener('touchend', onTouchEnd)
        card.addEventListener('touchcancel', onTouchEnd)
      })

      // 3. UNIVERSAL PARALLAX (Scroll-based)
      gsap.fromTo(
        img,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    }, cardRef)

    return () => ctx.revert()
  }, [index])

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative w-full h-full overflow-hidden bg-neutral-200 select-none',
        'cursor-crosshair will-change-transform group active:scale-[0.98] transition-transform duration-300',
        className,
      )}
      style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
    >
      {/* Image Layer */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-[115%] -top-[7.5%] will-change-[transform,filter]"
        style={{ filter: 'grayscale(20%) brightness(0.9)' }}
      >
        <Image
          src={image.src}
          alt={image.title}
          fill
          priority={index === 0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      {/* Spotlight (Gradient) */}
      <div
        ref={lightRef}
        className="absolute inset-0 pointer-events-none opacity-0 mix-blend-overlay z-10"
        style={{
          background:
            'radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 80%)',
          width: '200%',
          height: '200%',
          left: '-50%',
          top: '-50%',
        }}
      />

      {/* Scrim Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-neutral-950 opacity-30 pointer-events-none z-[5]"
      />

      {/* Content */}
      <div
        className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end z-20 pointer-events-none"
        style={{ transform: 'translateZ(30px)' }}
      >
        <span className="text-[9px] font-mono tracking-[0.5em] uppercase text-white/80 mb-2">
          {image.label}
        </span>
        <h3 className="text-xl md:text-3xl font-extralight text-white tracking-tighter leading-none">
          {image.title}
        </h3>
        <div className="h-px bg-white/30 w-0 group-hover:w-10 group-active:w-10 transition-all duration-700 mt-4" />
      </div>
    </div>
  )
}

/**
 * CollectionGallery - Responsive Premium Bento
 */
export const CollectionGallery = ({ images }: { images: GalleryImage[] }) => {
  const displayImages = useMemo(() => images.slice(0, 4), [images])

  if (displayImages.length < 4) return null

  return (
    <section className="relative w-full py-12 md:py-24 bg-transparent overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6">
        <header className="mb-10 md:mb-16 space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-neutral-400" />
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-neutral-400">
              Selected Pieces
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter text-text">
            Premium <span className="text-neutral-400 italic font-light">Series</span>
          </h2>
        </header>

        {/* Seamless Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Item 1: Hero */}
          <div className="md:col-span-8 h-[400px] md:h-[700px]">
            <ImageCard image={displayImages[0]} index={0} />
          </div>

          {/* Right Column */}
          <div className="md:col-span-4 flex flex-col">
            <div className="h-[300px] md:h-[350px]">
              <ImageCard image={displayImages[1]} index={1} />
            </div>

            <div className="flex h-[300px] md:h-[350px]">
              <div className="w-1/2">
                <ImageCard image={displayImages[2]} index={2} />
              </div>
              <div className="w-1/2">
                <ImageCard image={displayImages[3]} index={3} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
