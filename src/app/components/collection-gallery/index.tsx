'use client'

import React, { useRef, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Link from 'next/link'
import { SectionWrapper } from '../SectionWrapper'
import type { Media, Product } from '@/payload-types'
import type { ContainerPropsType } from '@types-frontend/types'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export interface GalleryImage {
  id: string | number
  image: Media
  title?: string
  label?: string
  product?: string | number | Product | null
}

interface CollectionGalleryProps {
  badge?: string
  title?: string
  images: GalleryImage[]
  properties?: ContainerPropsType
}

interface ImageCardProps {
  image: GalleryImage
  index: number
  className?: string
}

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
          gsap.to(img, { scale: 1.05, filter: 'grayscale(0%) brightness(1)', duration: 0.8, ease: 'power2.out' })
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

      mm.add('(pointer: coarse)', () => {
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

  const productSlug =
    typeof image.product === 'object' && image.product !== null ? image.product.slug : null
  const isClickable = !!productSlug

  const content = (
    <div
      ref={cardRef}
      className={cn(
        'relative w-full h-full overflow-hidden bg-neutral-200 select-none',
        'will-change-transform group active:scale-[0.98] transition-transform duration-300',
        isClickable ? 'cursor-pointer' : 'cursor-crosshair',
        className,
      )}
      style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
    >
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-[115%] -top-[7.5%] will-change-[transform,filter]"
        style={{ filter: 'grayscale(20%) brightness(0.9)' }}
      >
        <Image
          src={image.image?.url ?? ''}
          alt={image.image?.alt ?? image.title ?? ''}
          fill
          priority={index === 0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <div
        ref={lightRef}
        className="absolute inset-0 pointer-events-none opacity-0 mix-blend-overlay z-10"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 80%)',
          width: '200%',
          height: '200%',
          left: '-50%',
          top: '-50%',
        }}
      />

      <div ref={overlayRef} className="absolute inset-0 bg-neutral-950 opacity-30 pointer-events-none z-[5]" />

      <div
        className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end z-20 pointer-events-none"
        style={{ transform: 'translateZ(30px)' }}
      >
        <span className="text-[9px] font-mono tracking-[0.5em] uppercase text-white/80 mb-2">
          {image.label}
        </span>
        <h3 className="text-xl md:text-3xl font-extralight text-white tracking-tighter leading-none">
          {image.image?.alt ?? image.title}
        </h3>
        <div className="h-px bg-white/30 w-0 group-hover:w-10 group-active:w-10 transition-all duration-700 mt-4" />
      </div>
    </div>
  )

  if (isClickable) {
    return (
      <Link href={`/product/${productSlug}`} className="block h-full w-full">
        {content}
      </Link>
    )
  }

  return content
}

const getGridItems = (imgs: GalleryImage[]) => {
  const count = imgs.length

  if (count === 1) {
    return (
      <div className="gallery-card h-[500px] md:h-[700px]">
        <ImageCard image={imgs[0]} index={0} />
      </div>
    )
  }

  if (count === 2) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2">
        {imgs.map((img, i) => (
          <div key={img.id} className="gallery-card h-[400px] md:h-[600px]">
            <ImageCard image={img} index={i} />
          </div>
        ))}
      </div>
    )
  }

  if (count === 3) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="gallery-card md:col-span-8 h-[400px] md:h-[600px]">
          <ImageCard image={imgs[0]} index={0} />
        </div>
        <div className="md:col-span-4 flex flex-col">
          {imgs.slice(1).map((img, i) => (
            <div key={img.id} className="gallery-card h-[300px] md:h-[300px]">
              <ImageCard image={img} index={i + 1} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (count === 4) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="gallery-card md:col-span-8 h-[400px] md:h-[700px]">
          <ImageCard image={imgs[0]} index={0} />
        </div>
        <div className="md:col-span-4 flex flex-col">
          <div className="gallery-card h-[300px] md:h-[350px]">
            <ImageCard image={imgs[1]} index={1} />
          </div>
          <div className="flex h-[300px] md:h-[350px]">
            <div className="gallery-card w-1/2">
              <ImageCard image={imgs[2]} index={2} />
            </div>
            <div className="gallery-card w-1/2">
              <ImageCard image={imgs[3]} index={3} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 5+ — hero left + 2x2 right grid (capped at 5)
  return (
    <div className="grid grid-cols-1 md:grid-cols-12">
      <div className="gallery-card md:col-span-7 h-[400px] md:h-[700px]">
        <ImageCard image={imgs[0]} index={0} />
      </div>
      <div className="md:col-span-5 grid grid-cols-2 grid-rows-2">
        {imgs.slice(1, 5).map((img, i) => (
          <div key={img.id} className="gallery-card h-[300px] md:h-[350px]">
            <ImageCard image={img} index={i + 1} />
          </div>
        ))}
      </div>
    </div>
  )
}

export const CollectionGallery = ({
  badge = 'NEW ARRIVALS',
  title = 'Premium Series',
  images,
  properties,
}: CollectionGalleryProps) => {
  const displayImages = useMemo(() => images?.slice(0, 5) || [], [images])

  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        gsap.from(headerRef.current, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%' },
        })
        gsap.from('.gallery-card', {
          scale: 0.95,
          opacity: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
        })
      })

      mm.add('(max-width: 1023px)', () => {
        gsap.from([headerRef.current, '.gallery-card'], {
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 90%' },
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  if (!displayImages || displayImages.length === 0) return null

  return (
    <SectionWrapper containerProps={properties ?? {}} className={cn('!max-w-none !px-0')}>
      <div ref={containerRef} className="max-w-[1600px] mx-auto px-4 md:px-6">
        <header ref={headerRef} className="mb-10 md:mb-16 space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-neutral-400" />
            <span className="text-[11px] font-black uppercase tracking-tighter text-neutral-900">
              {badge}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter text-text">
            {title}
          </h2>
        </header>

        <div ref={gridRef}>{getGridItems(displayImages)}</div>
      </div>
    </SectionWrapper>
  )
}