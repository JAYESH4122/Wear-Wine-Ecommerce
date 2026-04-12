'use client'

import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect, useCallback } from 'react'
import { clsx } from 'clsx'
import { ShoppingBag, Check, Loader2, Star, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'

import type { Color, Size } from '@/payload-types'
import { useWishlist } from '@/providers/wishlist'
import { useCart } from '@/providers/cart'
import type { CartProduct } from '@/providers/cart'
import type { WishlistItem } from '@/providers/wishlist'

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
  product?: WishlistItem | CartProduct
  onAddToCart?: (id: string) => void
  onFavorite?: (id: string) => void
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
  product,
  onAddToCart,
  onFavorite,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [cartState, setCartState] = useState<'idle' | 'loading' | 'added'>('idle')
  const [wishState, setWishState] = useState<'idle' | 'added' | 'removed'>('idle')
  const [isMobileActive, setIsMobileActive] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)
  const isTouchDevice = useRef(false)
  const gsapContext = useRef<gsap.Context | null>(null)

  const { isInWishlist, toggleWishlist } = useWishlist()
  const { addItem } = useCart()

  const variants = product?.variants ?? []
  const defaultVariant = variants.length > 0 ? variants[0] : null
  const defaultSize = typeof defaultVariant?.size === 'object' ? (defaultVariant.size as Size) : null
  const defaultColor = typeof defaultVariant?.color === 'object' ? (defaultVariant.color as Color) : null

  const isFavorite = isInWishlist(id, defaultSize?.id, defaultColor?.id)
  const discountPct = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null

  // ── GSAP Animation System ─────────────────────────────────────────────────
  useEffect(() => {
    if (!cardRef.current) return

    gsapContext.current = gsap.context(() => {
      const mm = gsap.matchMedia()

      // Desktop: hover animations (pointer: fine)
      mm.add('(pointer: fine)', () => {
        const card = cardRef.current
        if (!card) return

        const handleMouseEnter = () => {
          gsap.to(card, {
            scale: 1.02,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: true,
          })
        }

        const handleMouseLeave = () => {
          gsap.to(card, {
            scale: 1,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
            overwrite: true,
          })
        }

        card.addEventListener('mouseenter', handleMouseEnter)
        card.addEventListener('mouseleave', handleMouseLeave)

        return () => {
          card.removeEventListener('mouseenter', handleMouseEnter)
          card.removeEventListener('mouseleave', handleMouseLeave)
        }
      })

      // Mobile: pointer interactions (pointer: coarse)
      mm.add('(pointer: coarse)', () => {
        const card = cardRef.current
        if (!card) return

        let activeTimeline: gsap.core.Timeline | null = null

        const onPointerDown = (_e: PointerEvent) => {
          if (activeTimeline) activeTimeline.kill()
          activeTimeline = gsap.timeline()
          activeTimeline.to(card, {
            scale: 1.03,
            duration: 0.2,
            ease: 'power2.out',
            overwrite: true,
          })
          activeTimeline.to(
            card,
            {
              y: -4,
              duration: 0.15,
              ease: 'power2.out',
            },
            0
          )
        }

        const onPointerUp = () => {
          if (activeTimeline) {
            activeTimeline.kill()
            activeTimeline = null
          }
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.35,
            ease: 'back.out(0.6)',
            overwrite: true,
          })
        }

        card.addEventListener('pointerdown', onPointerDown)
        card.addEventListener('pointerup', onPointerUp)
        card.addEventListener('pointercancel', onPointerUp)

        return () => {
          card.removeEventListener('pointerdown', onPointerDown)
          card.removeEventListener('pointerup', onPointerUp)
          card.removeEventListener('pointercancel', onPointerUp)
          if (activeTimeline) activeTimeline.kill()
        }
      })
    }, cardRef.current)

    return () => {
      gsapContext.current?.revert()
    }
  }, [])

  // ── Floating Animation (Mobile only) ─────────────────────────────────────
  useEffect(() => {
    if (!cardRef.current) return
    if (!isTouchDevice.current) return

    const ctx = gsap.context(() => {
      gsap.to(cardRef.current, {
        y: -3,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        overwrite: true,
      })
    }, cardRef.current)

    return () => ctx.revert()
  }, [])

  // ── Tap-away for mobile active state ─────────────────────────────────────
  const handleTapAway = useCallback((e: TouchEvent) => {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      setIsMobileActive(false)
      setIsHovered(false)
    }
  }, [])

  useEffect(() => {
    if (isMobileActive && isTouchDevice.current) {
      document.addEventListener('touchstart', handleTapAway, { passive: true })
    }
    return () => document.removeEventListener('touchstart', handleTapAway)
  }, [isMobileActive, handleTapAway])

  // ── Interaction handlers ─────────────────────────────────────────────────
  const handleMouseEnter = () => {
    if (!isTouchDevice.current) setIsHovered(true)
  }

  const handleMouseLeave = () => {
    if (!isTouchDevice.current) setIsHovered(false)
  }

  const handleTouchStart = () => {
    isTouchDevice.current = true
    setIsMobileActive(true)
    setIsHovered(true)
  }

  // ── Cart handler ─────────────────────────────────────────────────────────
  const handleAddToCart = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isInStock || cartState !== 'idle') return

    setCartState('loading')

    const variants = product?.variants ?? []
    const defaultVariant = variants.length > 0 ? variants[0] : null
    
    // Size is required, Color is optional
    const size = typeof defaultVariant?.size === 'object' ? (defaultVariant.size as Size) : undefined
    const color = typeof defaultVariant?.color === 'object' ? (defaultVariant.color as Color) : undefined

    try {
      if (onAddToCart) {
        await onAddToCart(id)
      } else {
        addItem(
          (product as CartProduct) || {
            id,
            name: title,
            slug: slug ?? null,
            price,
            images: [{ image: typeof image === 'string' ? image : (image as any).src }],
          },
          1,
          color,
          size,
        )
      }
      setCartState('added')
      setTimeout(() => setCartState('idle'), 1800)
    } catch {
      setCartState('idle')
    }
  }

  // ── Wishlist handler ─────────────────────────────────────────────────────
  const handleWishlistToggle = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const variants = product?.variants ?? []
    const defaultVariant = variants.length > 0 ? variants[0] : null
    const size = typeof defaultVariant?.size === 'object' ? (defaultVariant.size as Size) : undefined
    const color = typeof defaultVariant?.color === 'object' ? (defaultVariant.color as Color) : undefined

    const wasIn = isInWishlist(id, size?.id, color?.id)
    toggleWishlist((product as WishlistItem) || { id, name: title, price }, size, color)
    
    onFavorite?.(id)
    setWishState(wasIn ? 'removed' : 'added')
    setTimeout(() => setWishState('idle'), 1800)
  }

  return (
    <div
      ref={cardRef}
      className="group relative flex flex-col h-full bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 will-change-transform"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      {/* ── IMAGE SECTION ──────────────────────────────────────────────────── */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50">
        <Link href={`/product/${slug || id}`} className="block h-full w-full" tabIndex={-1}>
          <Image
            src={image}
            alt={title}
            fill
            className={clsx(
              'object-cover transition-all duration-700 ease-out',
              isHovered ? 'scale-110 opacity-0' : 'scale-100 opacity-100',
              !hoverImage && isHovered && '!opacity-100'
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {hoverImage && (
            <Image
              src={hoverImage}
              alt={title}
              fill
              className={clsx(
                'object-cover absolute inset-0 transition-all duration-700 ease-out',
                isHovered ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 pointer-events-none">
          {badge && (
            <span className="bg-black/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1.5 rounded-sm">
              {badge}
            </span>
          )}
          {discountPct && (
            <span className="bg-rose-500 text-white text-[10px] font-black uppercase tracking-wide px-2 py-1 rounded-sm">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Sold out overlay */}
        {!isInStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center pointer-events-none z-10">
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-600 border border-neutral-500/40 px-4 py-2 bg-white/90 rounded-sm">
              Sold Out
            </span>
          </div>
        )}

        {/* ── ACTION BUTTONS (Bottom edge) ──────────────────────────────────── */}
        <AnimatePresence>
          {(isHovered || isMobileActive) && isInStock && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: [0.2, 0.9, 0.4, 1] }}
              className="absolute bottom-3 left-3 right-3 z-20 flex gap-2"
            >
              {/* Cart Button - Full width primary */}
              <motion.button
                onClick={handleAddToCart}
                onTouchEnd={handleAddToCart}
                disabled={cartState === 'loading'}
                aria-label="Add to cart"
                className={clsx(
                  'flex-1 h-11 rounded-full flex items-center justify-center gap-2 transition-all duration-300',
                  cartState === 'added'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-white/95 backdrop-blur-md text-neutral-900 shadow-md hover:bg-black hover:text-white active:scale-95'
                )}
              >
                <AnimatePresence mode="wait">
                  {cartState === 'loading' ? (
                    <motion.span
                      key="spin"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </motion.span>
                  ) : cartState === 'added' ? (
                    <motion.span
                      key="check"
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.4 }}
                    >
                      <Check className="w-4 h-4" strokeWidth={2.5} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="bag"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" strokeWidth={1.8} />
                      <span className="text-[11px] font-black uppercase tracking-wide">Add</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Wishlist Button - Circular secondary */}
              <motion.button
                onClick={handleWishlistToggle}
                onTouchEnd={handleWishlistToggle}
                aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
                className={clsx(
                  'h-11 w-11 rounded-full flex items-center justify-center transition-all duration-300 shrink-0',
                  wishState === 'added'
                    ? 'bg-rose-500 text-white shadow-lg'
                    : wishState === 'removed'
                      ? 'bg-neutral-100 text-neutral-500'
                      : 'bg-white/95 backdrop-blur-md text-neutral-900 shadow-md hover:bg-rose-500 hover:text-white active:scale-95'
                )}
              >
                <AnimatePresence mode="wait">
                  {wishState === 'added' ? (
                    <motion.span
                      key="heart-fill"
                      initial={{ scale: 0.3, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.3, opacity: 0 }}
                    >
                      <Heart className="w-4 h-4 fill-white stroke-white" strokeWidth={1.5} />
                    </motion.span>
                  ) : wishState === 'removed' ? (
                    <motion.span
                      key="heart-out"
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <Heart className="w-4 h-4" strokeWidth={1.5} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="heart-idle"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Heart
                        className={clsx(
                          'w-4 h-4 transition-all duration-300',
                          isFavorite ? 'fill-rose-500 stroke-rose-500' : ''
                        )}
                        strokeWidth={1.5}
                      />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── PRODUCT INFO ────────────────────────────────────────────────────── */}
      <Link href={`/product/${slug || id}`} className="pt-3 pb-2 px-2 flex flex-col gap-1 flex-1">
        {category && (
          <span className="text-[9px] font-black uppercase tracking-[0.22em] text-neutral-400">
            {category}
          </span>
        )}

        <h3 className="text-[13px] font-black text-neutral-800 uppercase tracking-wide leading-tight line-clamp-2">
          {title}
        </h3>

        {rating !== undefined && rating > 0 && (
          <div className="flex items-center gap-1 mt-0.5">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={clsx(
                    'w-2.5 h-2.5',
                    i < Math.floor(rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-neutral-200 text-neutral-200'
                  )}
                />
              ))}
            </div>
            <span className="text-[9px] font-bold text-neutral-400 ml-0.5 tabular-nums">
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        <div className="flex items-baseline gap-2 mt-1 flex-wrap">
          <span className="text-[15px] font-black text-neutral-900 tracking-tight">
            ₹{price.toLocaleString()}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-[11px] text-neutral-400 line-through font-medium">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {defaultSize && (
          <div className="mt-1 flex items-center gap-1.5">
             <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
               Default:
             </span>
             <span className="text-[9px] font-black uppercase tracking-wider text-neutral-900 bg-neutral-100 px-1.5 py-0.5 rounded-[2px]">
               {defaultSize.label}
             </span>
             {defaultColor && (
               <span className="text-[9px] font-black uppercase tracking-wider text-neutral-900 bg-neutral-100 px-1.5 py-0.5 rounded-[2px]">
                 {defaultColor.name}
               </span>
             )}
          </div>
        )}
      </Link>
    </div>
  )
}