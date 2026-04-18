'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ShoppingBag, X } from 'lucide-react'
import { cn, formatPriceINR } from '@/lib/utils'
import type { Media } from '@/payload-types'
import type { CartItem } from '@/providers/cart'
import { QuantitySelector } from './QuantitySelector'

const mediaShell =
  'relative overflow-hidden bg-neutral-50 rounded-sm [perspective:1000px] transform-gpu flex-shrink-0'

const imageWrap =
  'absolute inset-0 will-change-transform [filter:grayscale(20%)_brightness(0.95)] data-[active=true]:[filter:grayscale(0%)_brightness(1.08)] transition-[filter] duration-300'

export const CartItemCard = React.memo(function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem
  onUpdateQuantity: (id: string, qty: number) => void
  onRemove: (id: string) => void
}) {
  const { product, quantity, selectedColor, selectedSize, cartItemId } = item

  const cardRef = useRef<HTMLDivElement>(null)
  const removeBtnRef = useRef<HTMLButtonElement>(null)

  useGSAP(
    () => {
      const card = cardRef.current
      if (!card) return

      const mm = gsap.matchMedia()
      const mediaEls = Array.from(card.querySelectorAll<HTMLElement>('[data-cart-media]'))
      const overlayEls = Array.from(card.querySelectorAll<HTMLElement>('[data-cart-overlay]'))
      const spotlightEls = Array.from(card.querySelectorAll<HTMLElement>('[data-cart-spotlight]'))
      const imageEls = Array.from(card.querySelectorAll<HTMLElement>('[data-cart-image]'))

      const setActive = (active: boolean) => {
        const value = active ? 'true' : 'false'
        mediaEls.forEach((el) => { el.dataset.active = value })
        imageEls.forEach((el) => { el.dataset.active = value })
      }

      const resetAll = () => {
        gsap.set(mediaEls, { rotateX: 0, rotateY: 0 })
        gsap.set(imageEls, { scale: 1, yPercent: 0 })
        gsap.set(overlayEls, { opacity: 0.3 })
        gsap.set(spotlightEls, { opacity: 0 })
        setActive(false)
      }

      mm.add('(prefers-reduced-motion: reduce)', resetAll)

      mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const rotateYTo = mediaEls.map((el) =>
          gsap.quickTo(el, 'rotateY', { duration: 0.5, ease: 'power2.out' }),
        )
        const rotateXTo = mediaEls.map((el) =>
          gsap.quickTo(el, 'rotateX', { duration: 0.5, ease: 'power2.out' }),
        )
        const lightXTo = spotlightEls.map((el) =>
          gsap.quickTo(el, 'xPercent', { duration: 0.4, ease: 'power1.out' }),
        )
        const lightYTo = spotlightEls.map((el) =>
          gsap.quickTo(el, 'yPercent', { duration: 0.4, ease: 'power1.out' }),
        )

        const handleMove = (e: PointerEvent) => {
          const rect = card.getBoundingClientRect()
          if (!rect.width || !rect.height) return
          const x = (e.clientX - rect.left) / rect.width
          const y = (e.clientY - rect.top) / rect.height
          rotateYTo.forEach((fn) => fn((x - 0.5) * 10))
          rotateXTo.forEach((fn) => fn((0.5 - y) * 10))
          lightXTo.forEach((fn) => fn((x - 0.5) * 40))
          lightYTo.forEach((fn) => fn((y - 0.5) * 40))
        }

        const handleEnter = () => {
          gsap.to(overlayEls, { opacity: 0.05, duration: 0.35, ease: 'power2.out' })
          gsap.to(imageEls, { scale: 1.06, duration: 0.5, ease: 'power2.out' })
          gsap.to(spotlightEls, { opacity: 1, duration: 0.4, ease: 'power2.out' })
          setActive(true)
        }

        const handleLeave = () => {
          gsap.to(overlayEls, { opacity: 0.3, duration: 0.4, ease: 'power1.out' })
          gsap.to(imageEls, { scale: 1, duration: 0.5, ease: 'power2.out' })
          gsap.to(spotlightEls, { opacity: 0, duration: 0.3, ease: 'power1.out' })
          rotateYTo.forEach((fn) => fn(0))
          rotateXTo.forEach((fn) => fn(0))
          setActive(false)
        }

        card.addEventListener('pointermove', handleMove, { passive: true })
        card.addEventListener('pointerenter', handleEnter)
        card.addEventListener('pointerleave', handleLeave)

        return () => {
          card.removeEventListener('pointermove', handleMove)
          card.removeEventListener('pointerenter', handleEnter)
          card.removeEventListener('pointerleave', handleLeave)
        }
      })

      mm.add('(pointer: coarse) and (prefers-reduced-motion: no-preference)', () => {
        const floatTween = gsap.to(imageEls, {
          yPercent: -1.5,
          duration: 4.8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })

        const handleDown = () => {
          gsap.to(imageEls, { scale: 1.05, duration: 0.35, ease: 'power2.out' })
          gsap.to(overlayEls, { opacity: 0.05, duration: 0.35, ease: 'power1.out' })
          gsap.to(spotlightEls, { opacity: 0.6, duration: 0.35, ease: 'power2.out' })
          setActive(true)
        }

        const handleUp = () => {
          gsap.to(imageEls, { scale: 1, duration: 0.4, ease: 'power2.out' })
          gsap.to(overlayEls, { opacity: 0.3, duration: 0.4, ease: 'power1.out' })
          gsap.to(spotlightEls, { opacity: 0, duration: 0.35, ease: 'power1.out' })
          setActive(false)
        }

        card.addEventListener('pointerdown', handleDown, { passive: true })
        card.addEventListener('pointerup', handleUp, { passive: true })
        card.addEventListener('pointercancel', handleUp, { passive: true })
        card.addEventListener('pointerleave', handleUp)

        return () => {
          floatTween.kill()
          card.removeEventListener('pointerdown', handleDown)
          card.removeEventListener('pointerup', handleUp)
          card.removeEventListener('pointercancel', handleUp)
          card.removeEventListener('pointerleave', handleUp)
        }
      })

      return () => mm.revert()
    },
    { scope: cardRef },
  )

  const handleRemoveEnter = () => {
    if (removeBtnRef.current) removeBtnRef.current.dataset.hovered = 'true'
  }
  const handleRemoveLeave = () => {
    if (removeBtnRef.current) removeBtnRef.current.dataset.hovered = 'false'
  }

  const firstImage = product.images?.[0]?.image
  const imageUrl =
    typeof firstImage === 'string' ? firstImage : ((firstImage as Media | null)?.url ?? null)

  const hasDiscount = product.salePrice != null && product.salePrice < product.price
  const currentPrice = hasDiscount ? product.salePrice! : product.price
  const subtotal = currentPrice * quantity
  const savings = hasDiscount ? (product.price - product.salePrice!) * quantity : 0

  const categoryName =
    typeof product.category === 'object' && product.category?.name ? product.category.name : null

  const variantStock = product.variants?.find((variant) => {
    const colorMatch = selectedColor
      ? typeof variant.color === 'object'
        ? variant.color?.id === selectedColor.id
        : variant.color === selectedColor.id
      : true
    const sizeMatch = selectedSize
      ? typeof variant.size === 'object'
        ? variant.size?.id === selectedSize.id
        : variant.size === selectedSize.id
      : true
    return colorMatch && sizeMatch
  })
  const stock = variantStock?.stock ?? null

  const productHref = product.slug ? `/product/${product.slug}` : '#'

  const subtotalBlock = (
    <div className="text-right">
      <p className="text-sm sm:text-base font-semibold text-neutral-900 tabular-nums">
        {formatPriceINR(subtotal)}
      </p>
      {hasDiscount && savings > 0 && (
        <p className="text-[11px] text-emerald-600 mt-0.5 tabular-nums">
          Save {formatPriceINR(savings)}
        </p>
      )}
      {quantity > 1 && (
        <p className="text-[11px] text-neutral-400 tabular-nums">
          {formatPriceINR(currentPrice)} × {quantity}
        </p>
      )}
    </div>
  )

  return (
    <div ref={cardRef} className="py-5 border-b border-neutral-100 last:border-b-0">
      <div className="md:grid md:grid-cols-12 md:items-center md:gap-4">
        {/* ── col-span-6: Product ── */}
        <div className="md:col-span-6 flex gap-3 sm:gap-4">
          {/* Image */}
          <Link
            href={productHref}
            className={cn(mediaShell, 'w-24 h-32 sm:w-28 sm:h-36 md:w-36 md:h-44')}
            data-cart-media
            data-active="false"
          >
            <div className={imageWrap} data-cart-image data-active="false">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 144px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-300">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              )}
            </div>
            <div
              className="absolute inset-0 bg-black/20 opacity-30 pointer-events-none"
              data-cart-overlay
            />
            <div
              className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50 blur-2xl opacity-0 pointer-events-none mix-blend-screen"
              data-cart-spotlight
            />
            {hasDiscount && (
              <div className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                Sale
              </div>
            )}
          </Link>

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Name row + remove */}
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                {categoryName && (
                  <p className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wide mb-0.5 truncate">
                    {categoryName}
                  </p>
                )}
                <Link href={productHref}>
                  <h3 className="text-sm sm:text-[15px] font-medium text-neutral-900 hover:text-neutral-600 transition-colors leading-snug line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
              </div>

              {/* Remove button */}
              <button
                ref={removeBtnRef}
                type="button"
                onClick={() => onRemove(cartItemId)}
                aria-label="Remove item"
                onPointerEnter={handleRemoveEnter}
                onPointerLeave={handleRemoveLeave}
                className="group/remove shrink-0 flex items-center justify-center w-8 h-8 -mt-0.5 -mr-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <X
                  className={cn(
                    'w-[18px] h-[18px] text-neutral-300',
                    'transition-all duration-300 ease-out',
                    'group-hover/remove:text-red-500 group-hover/remove:rotate-90',
                    'group-active/remove:text-red-600',
                    '[button[data-hovered=true]_&]:text-red-500 [button[data-hovered=true]_&]:rotate-90',
                  )}
                />
              </button>
            </div>

            {/* Variants + stock */}
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              {selectedColor && (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-neutral-400">Color:</span>
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-neutral-200 shadow-sm shrink-0"
                    style={{ backgroundColor: selectedColor.hex || '#ddd' }}
                  />
                  <span className="text-neutral-700">{selectedColor.name}</span>
                </div>
              )}
              {selectedSize && (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-neutral-400">Size:</span>
                  <span className="text-neutral-700 font-medium">{selectedSize.label}</span>
                </div>
              )}
              {stock !== null && (
                <span
                  className={cn(
                    'text-xs font-medium',
                    stock > 10 ? 'text-emerald-600' : stock > 0 ? 'text-amber-600' : 'text-red-600',
                  )}
                >
                  {stock > 10 ? 'In Stock' : stock > 0 ? `Only ${stock} left` : 'Out of Stock'}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="text-sm font-medium text-neutral-900 tabular-nums">
                {formatPriceINR(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-neutral-400 line-through tabular-nums">
                  {formatPriceINR(product.price)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── col-span-3: Quantity (desktop only) ── */}
        <div className="hidden md:flex md:col-span-3 justify-center">
          <QuantitySelector
            quantity={quantity}
            onIncrease={() => onUpdateQuantity(cartItemId, quantity + 1)}
            onDecrease={() => onUpdateQuantity(cartItemId, Math.max(1, quantity - 1))}
          />
        </div>

        {/* ── col-span-3: Subtotal (desktop only) ── */}
        <div className="hidden md:flex md:col-span-3 justify-end">
          {subtotalBlock}
        </div>
      </div>

      {/* ── Mobile: full-width bottom bar ── */}
      <div className="md:hidden flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
        <QuantitySelector
          quantity={quantity}
          onIncrease={() => onUpdateQuantity(cartItemId, quantity + 1)}
          onDecrease={() => onUpdateQuantity(cartItemId, Math.max(1, quantity - 1))}
        />
        {subtotalBlock}
      </div>
    </div>
  )
})