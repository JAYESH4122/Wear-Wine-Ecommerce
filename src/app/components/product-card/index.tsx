'use client'

import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect, useCallback } from 'react'
import { clsx } from 'clsx'
import { Heart, ShoppingBag, Check, Loader2, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { useWishlist } from '@/providers/wishlist'
import { useCart } from '@/providers/cart'
import type { CartProduct } from '@/providers/cart'
import type { WishlistItem } from '@/providers/wishlist'

type ProductCardProps = {
  id: string
  title: string
  category: string
  price: number
  image: StaticImageData | string
  hoverImage?: StaticImageData | string
  badge?: string
  originalPrice?: number
  rating?: number
  reviews?: number
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
  reviews,
  slug,
  isInStock = true,
  product,
  onAddToCart,
  onFavorite,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)
  const isTouchDevice = useRef(false)

  const { isInWishlist, toggleWishlist } = useWishlist()
  const { cart, addItem } = useCart()

  const isInCart = cart.some((item) => String(item.product.id) === String(id))
  const isFavorite = isInWishlist(id)

  // ─── Tap-away dismissal ───────────────────────────────────────────────────
  const handleTapAway = useCallback((e: TouchEvent) => {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      setIsHovered(false)
    }
  }, [])

  useEffect(() => {
    if (isHovered && isTouchDevice.current) {
      document.addEventListener('touchstart', handleTapAway, { passive: true })
    } else {
      document.removeEventListener('touchstart', handleTapAway)
    }
    return () => document.removeEventListener('touchstart', handleTapAway)
  }, [isHovered, handleTapAway])

  // ─── Desktop hover handlers ───────────────────────────────────────────────
  const handleMouseEnter = () => {
    if (!isTouchDevice.current) setIsHovered(true)
  }
  const handleMouseLeave = () => {
    if (!isTouchDevice.current) setIsHovered(false)
  }

  // ─── Mobile tap handler ───────────────────────────────────────────────────
  const handleTouchStart = () => {
    isTouchDevice.current = true
    setIsHovered((prev) => !prev)
  }

  // ─── Add to cart ──────────────────────────────────────────────────────────
  const handleAddToCart = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isInStock || isLoading) return

    setIsLoading(true)
    if (onAddToCart) {
      await onAddToCart(id)
    } else {
      const cartProduct = (product as CartProduct) || {
        id,
        name: title,
        slug: slug ?? null,
        price,
        images: [{ image: typeof image === 'string' ? image : image.src }],
      }
      addItem(cartProduct, 1)
    }
    setIsLoading(false)
    setIsAdded(true)
    // Auto-dismiss the overlay on mobile after adding
    if (isTouchDevice.current) {
      setTimeout(() => {
        setIsAdded(false)
        setIsHovered(false)
      }, 1500)
    } else {
      setTimeout(() => setIsAdded(false), 2000)
    }
  }

  // ─── Wishlist toggle (works for both mouse and touch) ─────────────────────
  const handleWishlistToggle = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist((product as WishlistItem) || { id, name: title, price })
    onFavorite?.(id)
  }

  return (
    <motion.div
      ref={cardRef}
      className="group relative flex flex-col h-full bg-white font-sans"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      initial="initial"
      whileHover="hover"
    >
      {/* ── IMAGE SECTION ─────────────────────────────────────────────────── */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F2F2F2]">
        <Link href={`/product/${slug || id}`} className="block h-full w-full">
          <motion.div
            className="h-full w-full"
            variants={{
              initial: { scale: 1 },
              hover: { scale: 1.05 },
            }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          >
            <Image
              src={image}
              alt={title}
              fill
              className={clsx(
                'object-cover transition-opacity duration-700',
                hoverImage && isHovered ? 'opacity-0' : 'opacity-100',
              )}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            {hoverImage && (
              <Image
                src={hoverImage}
                alt={title}
                fill
                className={clsx(
                  'object-cover absolute inset-0 transition-opacity duration-700',
                  isHovered ? 'opacity-100' : 'opacity-0',
                )}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            )}
          </motion.div>
        </Link>

        {/* Badges */}
        {badge && (
          <div className="absolute top-0 left-0 p-3 z-10 pointer-events-none">
            <span className="bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1.5 shadow-sm">
              {badge}
            </span>
          </div>
        )}

        {/* Wishlist Icon */}
        <AnimatePresence>
          {isHovered && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={handleWishlistToggle}
              onTouchEnd={handleWishlistToggle}
              className="absolute top-4 right-4 z-20 cursor-pointer"
            >
              <div className="p-2 flex justify-center items-center bg-white/80 backdrop-blur-sm border border-black/5 hover:bg-white transition-colors shadow-sm w-12 h-12">
                <Heart
                  className={clsx(
                    'w-5 h-5 transition-all duration-300',
                    isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-black/60',
                  )}
                  strokeWidth={1.5}
                />
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Slide-Up Quick Add */}
        <AnimatePresence>
          {isHovered && isInStock && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 bottom-0 z-30 cursor-pointer"
            >
              <button
                onClick={handleAddToCart}
                onTouchEnd={handleAddToCart}
                disabled={isLoading}
                className={clsx(
                  'w-full py-5.5 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-500 cursor-pointer',
                  isAdded || isInCart
                    ? 'bg-black text-white'
                    : 'bg-white/95 backdrop-blur-md text-black hover:bg-black hover:text-white',
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isAdded || isInCart ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── PRODUCT INFO SECTION ──────────────────────────────────────────── */}
      <div className="pt-2 pb-2 flex flex-col px-4">
        {/* Title & Rating */}
        <div className="flex justify-between items-center">
          <Link href={`/product/${slug || id}`} className="flex-1">
            <h3 className="text-[16px] font-bold text-black uppercase tracking-widest leading-none line-clamp-1 p-0 m-0">
              {title}
            </h3>
          </Link>
          {rating && (
            <div className="flex items-center gap-1.5 pl-3">
              <Star
                className={clsx(
                  'w-3.5 h-3.5 fill-yellow-400 text-yellow-400 transition-all duration-300',
                  isHovered && 'rotate-12',
                )}
              />
              <span className="text-[13px] font-extrabold text-black">{rating}</span>
            </div>
          )}
        </div>

        <span className="text-[12px] uppercase tracking-[0.1em] text-black/40 font-bold mx-0 my-2">
          {category}
        </span>

        {/* Price & Stock */}
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-3">
            <span className="text-[17px] font-extrabold text-black tracking-tight">${price}</span>
            {originalPrice && (
              <span className="text-[14px] text-black/30 line-through tracking-tighter">
                ${originalPrice}
              </span>
            )}
          </div>
          <div className="flex items-center text-xs">
            <span className="flex items-center gap-1.5">
              <span className={clsx('relative flex h-2 w-2', isInStock && 'group/status')}>
                <span
                  className={clsx(
                    'absolute inline-flex h-full w-full rounded-full',
                    isInStock ? 'bg-green-500' : 'bg-red-500',
                  )}
                />
              </span>
              <span
                className={clsx(
                  'font-medium transition-colors duration-300',
                  isInStock ? (isHovered ? 'text-green-600' : 'text-gray-500') : 'text-red-500',
                )}
              >
                {isInStock ? 'In stock' : 'Sold out'}
              </span>
            </span>
          </div>
        </div>

        {/* Stock Progress Bar */}
        {isInStock && (
          <div className="mt-2 px-1">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] uppercase tracking-[0.1em] text-black/40 font-bold">
                Limited Availability
              </span>
              <span className="text-[10px] font-extrabold text-black uppercase">
                Only {Math.floor(Math.random() * 8 + 2)} Left
              </span>
            </div>
            <div className="h-[3px] w-full bg-gray-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: isHovered ? '75%' : '0%' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-black"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
