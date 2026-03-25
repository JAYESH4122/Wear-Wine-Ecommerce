'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ShoppingBag, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Media } from '@/payload-types'
import type { CartItem } from '@/providers/cart'
import { QuantitySelector } from './QuantitySelector'

const mediaShell =
  'relative overflow-hidden bg-neutral-50 rounded-sm [perspective:1000px] transform-gpu'

const imageWrap =
  'absolute inset-0 will-change-transform [filter:grayscale(20%)_brightness(0.95)] data-[active=true]:[filter:grayscale(0%)_brightness(1.05)]'

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

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      const mediaEls = Array.from(card.querySelectorAll<HTMLElement>('[data-cart-media]'))
      const overlayEls = Array.from(card.querySelectorAll<HTMLElement>('[data-cart-overlay]'))
      const spotlightEls = Array.from(card.querySelectorAll<HTMLElement>('[data-cart-spotlight]'))
      const imageEls = Array.from(card.querySelectorAll<HTMLElement>('[data-cart-image]'))

      const setActive = (active: boolean) => {
        const value = active ? 'true' : 'false'
        mediaEls.forEach((el) => {
          el.dataset.active = value
        })
        imageEls.forEach((el) => {
          el.dataset.active = value
        })
      }

      const resetTransforms = () => {
        gsap.set(mediaEls, { rotateX: 0, rotateY: 0 })
        gsap.set(imageEls, { scale: 1, yPercent: 0 })
        gsap.set(overlayEls, { opacity: 0.3 })
        gsap.set(spotlightEls, { opacity: 0 })
        setActive(false)
      }

      mm.add('(prefers-reduced-motion: reduce)', () => {
        resetTransforms()
      })

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

        const handleMove = (event: PointerEvent) => {
          const rect = card.getBoundingClientRect()
          if (!rect.width || !rect.height) return

          const x = (event.clientX - rect.left) / rect.width
          const y = (event.clientY - rect.top) / rect.height
          const rotateY = (x - 0.5) * 10
          const rotateX = (0.5 - y) * 10

          rotateYTo.forEach((fn) => fn(rotateY))
          rotateXTo.forEach((fn) => fn(rotateX))
          lightXTo.forEach((fn) => fn((x - 0.5) * 40))
          lightYTo.forEach((fn) => fn((y - 0.5) * 40))
        }

        const handleEnter = () => {
          gsap.to(overlayEls, { opacity: 0.1, duration: 0.3, ease: 'power1.out' })
          gsap.to(imageEls, { scale: 1.03, duration: 0.4, ease: 'power2.out' })
          gsap.to(spotlightEls, { opacity: 0.9, duration: 0.4, ease: 'power2.out' })
          setActive(true)
        }

        const handleLeave = () => {
          gsap.to(overlayEls, { opacity: 0.3, duration: 0.3, ease: 'power1.out' })
          gsap.to(imageEls, { scale: 1, duration: 0.4, ease: 'power2.out' })
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
          gsap.to(imageEls, { scale: 1.04, duration: 0.35, ease: 'power2.out' })
          gsap.to(overlayEls, { opacity: 0.1, duration: 0.35, ease: 'power1.out' })
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

      return () => {
        mm.kill()
      }
    }, card)

    return () => ctx.revert()
  }, [])

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
  const sku = variantStock?.sku ?? product.id.toString().slice(-8).toUpperCase()

  const productHref = product.slug ? `/product/${product.slug}` : '#'

  return (
    <div ref={cardRef} className="group py-6 border-b border-neutral-100 last:border-b-0">
      <div className="flex gap-4 md:hidden">
        <Link
          href={productHref}
          className={cn(mediaShell, 'w-28 h-36 flex-shrink-0')}
          data-cart-media
          data-active="false"
        >
          <div className={imageWrap} data-cart-image data-active="false">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="112px"
                className="object-cover transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-300">
                <ShoppingBag className="w-6 h-6" />
              </div>
            )}
          </div>
          <div
            className="absolute inset-0 bg-black/20 opacity-30 pointer-events-none"
            data-cart-overlay
          />
          <div
            className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-2xl opacity-0 pointer-events-none mix-blend-screen"
            data-cart-spotlight
          />
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
              Sale
            </div>
          )}
        </Link>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              {categoryName && (
                <p className="text-[11px] text-neutral-400 uppercase tracking-wide mb-0.5">
                  {categoryName}
                </p>
              )}
              <Link href={productHref}>
                <h3 className="text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors leading-snug">
                  {product.name}
                </h3>
              </Link>
              <p className="mt-0.5 text-[11px] text-neutral-400 font-mono">SKU: {sku}</p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(cartItemId)}
              className="p-1.5 -m-1.5 text-neutral-400 hover:text-red-500 transition-colors flex-shrink-0"
              aria-label="Remove item"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2 space-y-1">
            {selectedColor && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-neutral-400">Color:</span>
                <span
                  className="w-3 h-3 rounded-full border border-neutral-200 shadow-sm"
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
              <div className="flex items-center gap-1.5 text-xs">
                <span
                  className={cn(
                    'font-medium',
                    stock > 10
                      ? 'text-emerald-600'
                      : stock > 0
                        ? 'text-amber-600'
                        : 'text-red-600',
                  )}
                >
                  {stock > 10 ? 'In Stock' : stock > 0 ? `Only ${stock} left` : 'Out of Stock'}
                </span>
              </div>
            )}
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span className="text-neutral-400">Price:</span>
            <span className="text-neutral-900 font-medium text-sm">${currentPrice.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-neutral-400 line-through">${product.price.toFixed(2)}</span>
            )}
          </div>

          <div className="mt-3 flex items-end justify-between gap-2">
            <div>
              <p className="text-[11px] text-neutral-400 uppercase tracking-wide mb-1.5">
                Quantity
              </p>
              <QuantitySelector
                quantity={quantity}
                onIncrease={() => onUpdateQuantity(cartItemId, quantity + 1)}
                onDecrease={() => onUpdateQuantity(cartItemId, Math.max(1, quantity - 1))}
              />
            </div>
            <div className="text-right">
              <p className="text-[11px] text-neutral-400 uppercase tracking-wide mb-1">Subtotal</p>
              <p className="text-base font-semibold text-neutral-900">${subtotal.toFixed(2)}</p>
              {hasDiscount && savings > 0 && (
                <p className="text-[11px] text-emerald-600 mt-0.5">Save ${savings.toFixed(2)}</p>
              )}
              {quantity > 1 && (
                <p className="text-[11px] text-neutral-400">
                  ${currentPrice.toFixed(2)} × {quantity}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:grid grid-cols-12 gap-4 items-start">
        <div className="col-span-6 flex gap-5">
          <Link
            href={productHref}
            className={cn(mediaShell, 'w-36 h-44 flex-shrink-0')}
            data-cart-media
            data-active="false"
          >
            <div className={imageWrap} data-cart-image data-active="false">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  sizes="144px"
                  className="object-cover transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-300">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              )}
            </div>
            <div
              className="absolute inset-0 bg-black/20 opacity-30 pointer-events-none"
              data-cart-overlay
            />
            <div
              className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-2xl opacity-0 pointer-events-none mix-blend-screen"
              data-cart-spotlight
            />
            {hasDiscount && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                Sale
              </div>
            )}
          </Link>

          <div className="flex flex-col justify-center min-w-0 py-1">
            {categoryName && (
              <p className="text-xs text-neutral-400 uppercase tracking-wide mb-0.5">
                {categoryName}
              </p>
            )}
            <Link href={productHref}>
              <h3 className="text-base font-medium text-neutral-900 hover:text-neutral-600 transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="mt-1 text-xs text-neutral-400 font-mono">SKU: {sku}</p>

            <div className="mt-2.5 space-y-1.5">
              {selectedColor && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-500 w-10 shrink-0">Color</span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-neutral-200 shadow-sm"
                      style={{ backgroundColor: selectedColor.hex || '#ddd' }}
                    />
                    <span className="text-neutral-800">{selectedColor.name}</span>
                  </span>
                </div>
              )}
              {selectedSize && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-500 w-10 shrink-0">Size</span>
                  <span className="text-neutral-800 font-medium">{selectedSize.label}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-neutral-500 w-10 shrink-0">Price</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-neutral-900 font-medium">${currentPrice.toFixed(2)}</span>
                  {hasDiscount && (
                    <span className="text-xs text-neutral-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </span>
              </div>
              {stock !== null && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-500 w-10 shrink-0">Stock</span>
                  <span
                    className={cn(
                      'font-medium text-xs',
                      stock > 10
                        ? 'text-emerald-600'
                        : stock > 0
                          ? 'text-amber-600'
                          : 'text-red-600',
                    )}
                  >
                    {stock > 10 ? 'In Stock' : stock > 0 ? `Only ${stock} left` : 'Out of Stock'}
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onRemove(cartItemId)}
              className="mt-3 self-start flex items-center gap-1.5 text-xs text-neutral-400 hover:text-red-500 transition-colors"
              aria-label="Remove item"
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        </div>

        <div className="col-span-3 flex flex-col items-center pt-10">
          <QuantitySelector
            quantity={quantity}
            onIncrease={() => onUpdateQuantity(cartItemId, quantity + 1)}
            onDecrease={() => onUpdateQuantity(cartItemId, Math.max(1, quantity - 1))}
          />
        </div>

        <div className="col-span-3 flex flex-col items-end pt-10">
          <p className="text-lg font-semibold text-neutral-900">${subtotal.toFixed(2)}</p>
          {hasDiscount && savings > 0 && (
            <p className="text-xs text-emerald-600 mt-0.5">Save ${savings.toFixed(2)}</p>
          )}
          {quantity > 1 && (
            <p className="text-xs text-neutral-400 mt-0.5">
              ${currentPrice.toFixed(2)} × {quantity}
            </p>
          )}
        </div>
      </div>
    </div>
  )
})
