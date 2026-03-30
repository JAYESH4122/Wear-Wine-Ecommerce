// product-info-panel.tsx
'use client'

import { useState, useCallback, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Heart, ShoppingBag, Check, AlertCircle, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWishlist } from '@/providers/wishlist'
import { useCart } from '@/providers/cart'
import { Button } from '@/components/ui/button/Button'
import { ColorSelector } from './color-selector'
import { SizeSelector } from './size-selector'
import { QuantitySelector } from './quantity-selector'
import { ProductAccordion } from './product-accordion'
import { TrustBadges } from './trust-badges'
import type { Product, NormalizedColor, NormalizedSize } from './types'
import type { Color, Size } from '@/payload-types'

// Removed hardcoded ACCORDION_ITEMS as it's now in pdpStaticData

interface Props {
  product: Product
  onOpenTerms: () => void
  onOpenSizeChart: () => void
  sizes: NormalizedSize[]
  colors: NormalizedColor[]
  pdpStatic: any
}

export const ProductInfoPanel = ({
  product,
  onOpenTerms,
  onOpenSizeChart,
  sizes,
  colors,
  pdpStatic,
}: Props) => {
  const panelRef = useRef<HTMLDivElement>(null)

  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [isAgreed, setIsAgreed] = useState(false)
  const [showError, setShowError] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>('details')

  const { isInWishlist, toggleWishlist } = useWishlist()
  const { addItem } = useCart()

  const isWishlisted = isInWishlist(String(product.id))
  const hasSale = !!product.salePrice && product.salePrice < product.price
  const discountPercentage = hasSale
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0
  const displayPrice = hasSale ? product.salePrice! : product.price

  const needsColor = colors.length > 0
  const needsSize = sizes.length > 0
  const canAddToCart =
    (!needsColor || !!selectedColor) && (!needsSize || !!selectedSize) && isAgreed

  const handleAddToCart = useCallback(() => {
    if (!isAgreed) {
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }
    if ((needsColor && !selectedColor) || (needsSize && !selectedSize)) return

    const rawColors = (product.variants ?? []).reduce<Color[]>((acc, v) => {
      if (v.color && typeof v.color === 'object') acc.push(v.color as Color)
      return acc
    }, [])
    const rawSizes = (product.variants ?? []).reduce<Size[]>((acc, v) => {
      if (v.size && typeof v.size === 'object') acc.push(v.size as Size)
      return acc
    }, [])

    const color = rawColors.find((c) => String(c.id) === selectedColor)
    const size = rawSizes.find((s) => String(s.id) === selectedSize)

    addItem(product, quantity, color, size)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2500)
  }, [isAgreed, needsColor, needsSize, selectedColor, selectedSize, product, quantity, addItem])

  const handleToggleWishlist = useCallback(() => toggleWishlist(product), [toggleWishlist, product])
  const decreaseQty = useCallback(() => setQuantity((q) => Math.max(1, q - 1)), [])
  const increaseQty = useCallback(() => setQuantity((q) => q + 1), [])
  const toggleAgreed = useCallback(() => setIsAgreed((v) => !v), [])
  const toggleAccordion = useCallback(
    (id: string) => setOpenAccordion((prev) => (prev === id ? null : id)),
    [],
  )

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(pointer: fine)', () => {
        const items = panelRef.current?.querySelectorAll<HTMLElement>('.panel-item')
        if (!items?.length) return
        gsap.from(items, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          stagger: 0.05,
          ease: 'power3.out',
          clearProps: 'all',
        })
      })

      mm.add('(pointer: coarse)', () => {
        const items = panelRef.current?.querySelectorAll<HTMLElement>('.panel-item')
        if (!items?.length) return
        gsap.from(items, {
          y: 16,
          opacity: 0,
          duration: 0.5,
          stagger: 0.04,
          ease: 'power2.out',
          clearProps: 'all',
        })
      })

      return () => mm.revert()
    },
    { scope: panelRef },
  )

  return (
    <div ref={panelRef} className="flex flex-col gap-0">
      {/* Title & Rating */}
      <div className="panel-item pb-6 border-b border-neutral-100">
        <h1 className="text-2xl lg:text-3xl font-light font-anton text-neutral-900 tracking-tight mb-3 leading-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-2 mb-4" aria-label="Rating: 5 out of 5">
          <div className="flex gap-0.5" aria-hidden>
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">
            24 Reviews
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-semibold text-neutral-900">
            ₹{displayPrice.toLocaleString()}
          </span>
          {hasSale && (
            <>
              <span className="text-sm text-neutral-400 line-through">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5">
                Save {discountPercentage}%
              </span>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="panel-item py-5 text-sm font-sans text-neutral-500 leading-relaxed border-b border-neutral-100">
        {product.description ??
          'Thoughtfully crafted with premium materials for a lasting silhouette and unparalleled comfort.'}
      </p>

      {/* Selectors */}
      <div className="panel-item py-5 border-b border-neutral-100 space-y-0">
        <ColorSelector colors={colors} selected={selectedColor} onSelect={setSelectedColor} />
        <SizeSelector
          sizes={sizes}
          selected={selectedSize}
          onSelect={setSelectedSize}
          onViewChart={onOpenSizeChart}
        />
      </div>

      {/* Terms */}
      <div className="panel-item py-5 border-b border-neutral-100">
        <div className="flex items-start gap-3">
          <button
            onClick={toggleAgreed}
            role="checkbox"
            aria-checked={isAgreed}
            aria-label="Agree to terms and conditions"
            className={cn(
              'mt-0.5 w-4.5 h-4.5 shrink-0 border flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1',
              isAgreed
                ? 'bg-neutral-900 border-neutral-900'
                : 'bg-white border-neutral-300 hover:border-neutral-500',
            )}
          >
            {isAgreed && <Check className="w-2.5 h-2.5 text-white" />}
          </button>
          <p className="text-xs text-neutral-500 leading-relaxed">
            I agree to the{' '}
            <button
              onClick={onOpenTerms}
              className="text-neutral-900 font-semibold underline underline-offset-2 hover:text-neutral-600 transition-colors duration-200"
            >
              Terms & Conditions
            </button>{' '}
            and understand the return policy.
          </p>
        </div>
        <div
          aria-live="polite"
          className={cn(
            'mt-3 flex items-center gap-1.5 text-rose-600 transition-opacity duration-300',
            showError ? 'opacity-100' : 'opacity-0 pointer-events-none',
          )}
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Please agree to the terms to continue
          </span>
        </div>
      </div>

      <div className="panel-item py-5 flex flex-col sm:flex-row gap-3 border-b border-neutral-100">
        <QuantitySelector value={quantity} onDecrease={decreaseQty} onIncrease={increaseQty} />
        <Button
          onClick={handleAddToCart}
          disabled={isAdded}
          fullWidth
          variant="primary"
          leftIcon={
            isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />
          }
          className={cn(
            'h-12 text-[10px] font-bold uppercase tracking-[0.18em] rounded-none sm:flex-1',
            isAdded && 'bg-emerald-600 hover:bg-emerald-600 border-emerald-600 cursor-default',
            !isAdded &&
              !canAddToCart &&
              'bg-neutral-100 text-neutral-400 cursor-not-allowed border-neutral-100',
          )}
        >
          {isAdded ? (pdpStatic?.cta?.addedToCart ?? 'Added to Cart') : (pdpStatic?.cta?.buyNow ?? 'Buy Now')}
        </Button>
      </div>

      <div className="panel-item py-5 border-b border-neutral-100">
        <Button
          onClick={handleToggleWishlist}
          fullWidth
          variant="secondary"
          leftIcon={
            <Heart
              className={cn(
                'w-3.5 h-3.5 transition-all duration-200',
                isWishlisted && 'fill-current',
              )}
            />
          }
          className={cn(
            'h-12 text-[10px] font-bold uppercase tracking-[0.18em] rounded-none',
            isWishlisted && 'bg-neutral-900 text-white border-neutral-900',
          )}
        >
          {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
        </Button>
      </div>
      {/* Accordions */}
      <div className="panel-item py-2">
        <ProductAccordion
          items={pdpStatic?.accordions?.map((a: any) => ({ id: a.id, title: a.title, content: a.content })) ?? []}
          open={openAccordion}
          onToggle={toggleAccordion}
        />
      </div>

      {/* Trust Badges */}
      <div className="panel-item pt-2">
        <TrustBadges badges={pdpStatic?.trustBadges} />
      </div>
    </div>
  )
}
