'use client'

import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'
import { CircleOff, Star } from 'lucide-react'
import { gsap } from 'gsap'

type ProductCardProps = {
  id: string
  title: string
  category?: string
  price: number
  image: StaticImageData | string
  hoverImage?: StaticImageData | string
  badge?: string
  originalPrice?: number
  rating?: number
  slug?: string | null
  isInStock?: boolean
}

export const ProductCard = ({
  id,
  title,
  category,
  price,
  image,
  hoverImage,
  badge,
  originalPrice,
  rating,
  slug,
  isInStock = true,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const isTouchDevice = useRef(false)

  const hasDiscount =
    typeof originalPrice === 'number' && originalPrice > 0 && price > 0 && originalPrice > price
  const discountPct = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : null

  useEffect(() => {
    if (!cardRef.current) return

    const context = gsap.context(() => {
      const media = gsap.matchMedia()

      media.add('(pointer: fine)', () => {
        const card = cardRef.current
        if (!card) return

        const handleEnter = () => {
          gsap.to(card, {
            scale: 1.02,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: true,
          })
        }

        const handleLeave = () => {
          gsap.to(card, {
            scale: 1,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
            overwrite: true,
          })
        }

        card.addEventListener('mouseenter', handleEnter)
        card.addEventListener('mouseleave', handleLeave)

        return () => {
          card.removeEventListener('mouseenter', handleEnter)
          card.removeEventListener('mouseleave', handleLeave)
        }
      })

      media.add('(pointer: coarse)', () => {
        const card = cardRef.current
        if (!card) return

        const handlePointerDown = () => {
          gsap.to(card, {
            scale: 1.03,
            y: -4,
            duration: 0.2,
            ease: 'power2.out',
            overwrite: true,
          })
        }

        const handlePointerUp = () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.35,
            ease: 'back.out(0.6)',
            overwrite: true,
          })
        }

        card.addEventListener('pointerdown', handlePointerDown)
        card.addEventListener('pointerup', handlePointerUp)
        card.addEventListener('pointercancel', handlePointerUp)

        return () => {
          card.removeEventListener('pointerdown', handlePointerDown)
          card.removeEventListener('pointerup', handlePointerUp)
          card.removeEventListener('pointercancel', handlePointerUp)
        }
      })
    }, cardRef.current)

    return () => context.revert()
  }, [])

  const handleMouseEnter = () => {
    if (!isTouchDevice.current) setIsHovered(true)
  }

  const handleMouseLeave = () => {
    if (!isTouchDevice.current) setIsHovered(false)
  }

  const handleTouchStart = () => {
    isTouchDevice.current = true
  }

  return (
    <div
      ref={cardRef}
      className="relative h-full will-change-transform"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      <Link
        href={`/product/${slug || id}`}
        className={clsx(
          'group flex h-full flex-col overflow-hidden rounded-sm bg-white transition-shadow duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2',
          isInStock
            ? 'shadow-sm hover:shadow-xl'
            : 'border border-neutral-200 shadow-sm hover:shadow-md',
        )}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50">
          <Image
            src={image}
            alt={title}
            fill
            className={clsx(
              'object-cover transition-all duration-700 ease-out',
              !isInStock
                ? 'scale-100 opacity-100 grayscale-[0.45] brightness-[0.72]'
                : isHovered
                  ? 'scale-110 opacity-0'
                  : 'scale-100 opacity-100',
              isInStock && !hoverImage && isHovered && '!opacity-100',
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {hoverImage && isInStock && (
            <Image
              src={hoverImage}
              alt=""
              fill
              className={clsx(
                'absolute inset-0 object-cover transition-all duration-700 ease-out',
                isHovered ? 'scale-100 opacity-100' : 'scale-110 opacity-0',
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col gap-2">
            {badge && (
              <span className="rounded-sm bg-black/90 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                {badge}
              </span>
            )}
            {discountPct && (
              <span className="rounded-sm bg-rose-500 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                -{discountPct}%
              </span>
            )}
          </div>

          {!isInStock && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-neutral-950 via-neutral-950/85 to-transparent px-4 pb-4 pt-14 text-white">
              <div className="flex items-center gap-2 border-l border-white/60 pl-3">
                <CircleOff className="h-4 w-4 shrink-0" aria-hidden="true" strokeWidth={1.75} />
                <div className="flex min-w-0 flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.24em]">
                    Sold out
                  </span>
                  <span className="text-[9px] font-medium text-white/70">
                    Currently unavailable
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className={clsx(
            'flex flex-1 flex-col gap-1 px-2 pb-2 pt-3',
            !isInStock && 'bg-neutral-50',
          )}
        >
          {category && (
            <span className="text-[9px] font-black uppercase tracking-[0.22em] text-neutral-400">
              {category}
            </span>
          )}

          <h3
            className={clsx(
              'line-clamp-2 text-[13px] font-black uppercase leading-tight tracking-wide',
              isInStock ? 'text-neutral-800' : 'text-neutral-600',
            )}
          >
            {title}
          </h3>

          {rating !== undefined && rating > 0 && (
            <div className="mt-0.5 flex items-center gap-1">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={clsx(
                      'h-2.5 w-2.5',
                      index < Math.floor(rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-neutral-200 text-neutral-200',
                    )}
                  />
                ))}
              </div>
              <span className="ml-0.5 text-[9px] font-bold tabular-nums text-neutral-400">
                {rating.toFixed(1)}
              </span>
            </div>
          )}

          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            <span
              className={clsx(
                'text-[15px] font-black tracking-tight',
                isInStock ? 'text-neutral-900' : 'text-neutral-600',
              )}
            >
              ₹{price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-[11px] font-medium text-neutral-400 line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
