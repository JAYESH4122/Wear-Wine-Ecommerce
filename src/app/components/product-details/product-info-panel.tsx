// product-info-panel.tsx
'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import type { Color, PdpStatic, Size } from '@/payload-types'

// Removed hardcoded ACCORDION_ITEMS as it's now in pdpStaticData

interface Props {
  product: Product
  onOpenTerms: () => void
  onOpenSizeChart: () => void
  sizes: NormalizedSize[]
  colors: NormalizedColor[]
  pdpStatic: PdpStatic
}

const getRelationId = (value: unknown): string | null => {
  if (value == null) return null
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (typeof value === 'object' && 'id' in (value as { id?: unknown })) {
    const id = (value as { id?: unknown }).id
    if (typeof id === 'string' || typeof id === 'number') return String(id)
  }
  return null
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
  const router = useRouter()

  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [isAgreed, setIsAgreed] = useState(false)
  const [showError, setShowError] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>('details')

  const { isInWishlist, toggleWishlist } = useWishlist()
  const { cart, addItem, clearCart } = useCart()

  const isWishlisted = isInWishlist(String(product.id), selectedSize ?? undefined, selectedColor ?? undefined)
  const hasSale = !!product.salePrice && product.salePrice < product.price
  const discountPercentage = hasSale
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0
  const displayPrice = hasSale ? product.salePrice! : product.price

  const needsColor = colors.length > 0
  const needsSize = sizes.length > 0
  const variants = product.variants ?? []

  // Refactored useEffect for initial selection
  useEffect(() => {
    if (!variants.length || (!needsColor && !needsSize)) return

    // Only run this if we don't have a valid selection yet
    const hasMatchingVariant = variants.some((v) => {
      const vColorId = getRelationId(v.color)
      const vSizeId = getRelationId(v.size)
      const matchesColor = !needsColor || vColorId === selectedColor
      const matchesSize = !needsSize || vSizeId === selectedSize
      return matchesColor && matchesSize
    })

    if (hasMatchingVariant) return

    // Find a valid default
    const fallbackVariant = variants.find((v) => (v.stock ?? 0) > 0) ?? variants[0]
    const fallbackColorId = getRelationId(fallbackVariant.color)
    const fallbackSizeId = getRelationId(fallbackVariant.size)

    if (needsColor && fallbackColorId) setSelectedColor(fallbackColorId)
    if (needsSize && fallbackSizeId) setSelectedSize(fallbackSizeId)
    // We only want this to run once or when variants change to set initial state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants, needsColor, needsSize])

  const handleColorSelect = useCallback(
    (colorId: string) => {
      setSelectedColor(colorId)

      // Try to keep the current size if it's available for the new color
      const matchingSizeVariant = variants.find(
        (v) => getRelationId(v.color) === colorId && getRelationId(v.size) === selectedSize,
      )

      if (!matchingSizeVariant && needsSize) {
        // Find another size for this color that has stock
        const firstAvailableSizeVariant =
          variants.find((v) => getRelationId(v.color) === colorId && (v.stock ?? 0) > 0) ||
          variants.find((v) => getRelationId(v.color) === colorId)

        if (firstAvailableSizeVariant) {
          setSelectedSize(getRelationId(firstAvailableSizeVariant.size))
        }
      }
    },
    [variants, selectedSize, needsSize],
  )

  const handleSizeSelect = useCallback(
    (sizeId: string) => {
      setSelectedSize(sizeId)

      // Try to keep the current color if it's available for the new size
      const matchingColorVariant = variants.find(
        (v) => getRelationId(v.size) === sizeId && getRelationId(v.color) === selectedColor,
      )

      if (!matchingColorVariant && needsColor) {
        // Find another color for this size that has stock
        const firstAvailableColorVariant =
          variants.find((v) => getRelationId(v.size) === sizeId && (v.stock ?? 0) > 0) ||
          variants.find((v) => getRelationId(v.size) === sizeId)

        if (firstAvailableColorVariant) {
          setSelectedColor(getRelationId(firstAvailableColorVariant.color))
        }
      }
    },
    [variants, selectedColor, needsColor],
  )

  const resolveSelectedVariantOptions = useCallback(() => {
    const rawColors = (product.variants ?? []).reduce<Color[]>((acc, v) => {
      if (v.color && typeof v.color === 'object') acc.push(v.color as Color)
      return acc
    }, [])
    const rawSizes = (product.variants ?? []).reduce<Size[]>((acc, v) => {
      if (v.size && typeof v.size === 'object') acc.push(v.size as Size)
      return acc
    }, [])

    let color = rawColors.find((c) => String(c.id) === selectedColor)
    let size = rawSizes.find((s) => String(s.id) === selectedSize)

    if (!color && selectedColor) {
      const fallbackColor = colors.find((c) => c.id === selectedColor)
      if (fallbackColor) color = { id: selectedColor, name: fallbackColor.name } as unknown as Color
    }

    if (!size && selectedSize) {
      const fallbackSize = sizes.find((s) => s.id === selectedSize)
      if (fallbackSize) size = { id: selectedSize, label: fallbackSize.label } as unknown as Size
    }

    return { color, size }
  }, [product.variants, selectedColor, selectedSize, colors, sizes])

  const currentVariant = (product.variants ?? []).find((v) => {
    const vColorId = getRelationId(v.color)
    const vSizeId = getRelationId(v.size)

    const matchesColor = !needsColor || vColorId === selectedColor
    const matchesSize = !needsSize || vSizeId === selectedSize

    return matchesColor && matchesSize
  })

  const totalStock = (product.variants ?? []).reduce((acc, v) => acc + (v.stock ?? 0), 0)
  const isOutOfStockOverall = totalStock === 0

  const isVariantSelected = (!needsColor || !!selectedColor) && (!needsSize || !!selectedSize)
  const currentStock = currentVariant ? (currentVariant.stock ?? 0) : 0
  const isVariantOutOfStock = isVariantSelected && currentStock < quantity

  const canAddToCart = isVariantSelected && isAgreed && !isOutOfStockOverall && !isVariantOutOfStock

  const currentCartItemId = `${product.id}-${selectedColor || 'no-color'}-${selectedSize || 'no-size'}`
  const isAlreadyInCart = cart.some((item) => item.cartItemId === currentCartItemId)

  const getAddToCartText = () => {
    if (isOutOfStockOverall) return pdpStatic?.cta?.outOfStock ?? 'Out of Stock'
    if (isVariantSelected && isVariantOutOfStock) return pdpStatic?.cta?.outOfStock ?? 'Out of Stock'
    if (isAlreadyInCart) return pdpStatic?.cta?.alreadyInCart ?? 'Already in Bag'
    if (isAdded) return pdpStatic?.cta?.addedToCart ?? 'Added to Bag'
    return pdpStatic?.cta?.addToCart ?? 'Add to Bag'
  }

  const handleAddToCart = useCallback(() => {
    if (!isAgreed) {
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }
    if (isAlreadyInCart) return
    if ((needsColor && !selectedColor) || (needsSize && !selectedSize)) return

    const { color, size } = resolveSelectedVariantOptions()

    addItem(product, quantity, color, size)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2500)
  }, [
    isAgreed,
    isAlreadyInCart,
    needsColor,
    needsSize,
    selectedColor,
    selectedSize,
    resolveSelectedVariantOptions,
    product,
    quantity,
    addItem,
  ])

  const handleBuyNow = useCallback(() => {
    if (!isAgreed) {
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }
    if ((needsColor && !selectedColor) || (needsSize && !selectedSize)) return

    const { color, size } = resolveSelectedVariantOptions()

    clearCart()
    addItem(product, quantity, color, size)
    router.push('/cart?step=2')
  }, [
    isAgreed,
    needsColor,
    needsSize,
    selectedColor,
    selectedSize,
    resolveSelectedVariantOptions,
    product,
    quantity,
    addItem,
    router,
    clearCart,
  ])

  const handleToggleWishlist = useCallback(() => {
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

    toggleWishlist(product, size, color)
  }, [toggleWishlist, product, selectedColor, selectedSize])
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
      <div className="panel-item border-b border-neutral-100">
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
          {isOutOfStockOverall && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 ml-2">
              Out of Stock
            </span>
          )}
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
        <ColorSelector colors={colors} selected={selectedColor} onSelect={handleColorSelect} />
        <SizeSelector
          sizes={sizes}
          selected={selectedSize}
          onSelect={handleSizeSelect}
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

      <div className="panel-item py-5 flex flex-col gap-3 border-b border-neutral-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <QuantitySelector value={quantity} onDecrease={decreaseQty} onIncrease={increaseQty} />
          <Button
            onClick={handleAddToCart}
            disabled={isAdded || isAlreadyInCart || !canAddToCart}
            fullWidth
            variant="secondary"
            leftIcon={
              isAdded || isAlreadyInCart ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5" />
              )
            }
            className={cn(
              'h-12 text-[10px] font-bold uppercase tracking-[0.18em] rounded-none sm:flex-1',
              (isAdded || isAlreadyInCart) &&
                'bg-emerald-600 hover:bg-emerald-600 border-emerald-600 text-white cursor-default',
              !(isAdded || isAlreadyInCart) &&
                !canAddToCart &&
                'bg-neutral-100 text-neutral-400 cursor-not-allowed border-neutral-100',
            )}
          >
            {getAddToCartText()}
          </Button>
        </div>

        <Button
          onClick={handleBuyNow}
          disabled={!canAddToCart}
          fullWidth
          variant="primary"
          className={cn(
            'h-12 text-[10px] font-bold uppercase tracking-[0.18em] rounded-none',
            !canAddToCart && 'bg-neutral-100 text-neutral-400 cursor-not-allowed border-neutral-100',
          )}
        >
          {pdpStatic?.cta?.buyNow ?? 'Buy it Now'}
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
          items={
            pdpStatic?.accordions?.map((a) => ({
              id: String(a.id),
              title: a.title,
              content: a.content,
            })) ?? []
          }
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
