'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Check,
  PackageX,
  X,
  Ruler,
  FileText,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product, Media, Color, Size } from '@/payload-types'
import { useWishlist } from '@/providers/wishlist'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ResolvedVariant {
  colorId: string
  sizeId: string
  sku: string | null | undefined
  stock: number
}

interface ProductDetailsProps {
  product: Product
  relatedProducts?: Product[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LOW_STOCK_THRESHOLD = 5

const FEATURES = [
  { icon: Truck, label: 'Free Shipping', sub: 'On orders over $150' },
  { icon: ShieldCheck, label: 'Secure Payment', sub: '100% secure checkout' },
  { icon: RefreshCcw, label: 'Easy Returns', sub: '30-day return policy' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveId(val: unknown): string {
  if (!val) return ''
  if (typeof val === 'object' && 'id' in (val as object))
    return String((val as { id: string | number }).id)
  return String(val)
}

function discountPercent(price: number, salePrice: number): number {
  return Math.round(((price - salePrice) / price) * 100)
}

// ─── StockBadge ───────────────────────────────────────────────────────────────

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)
    return (
      <div className="flex items-center gap-1.5">
        <PackageX className="w-3.5 h-3.5 text-rose-500" />
        <span className="text-xs font-semibold text-rose-500">Out of stock</span>
      </div>
    )
  if (stock <= LOW_STOCK_THRESHOLD)
    return (
      <div className="flex items-center gap-2.5">
        <div className="flex gap-0.5">
          {Array.from({ length: LOW_STOCK_THRESHOLD }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-4 h-1.5 rounded-full',
                i < stock ? 'bg-amber-400' : 'bg-neutral-200',
              )}
            />
          ))}
        </div>
        <span className="text-xs font-semibold text-amber-600">Only {stock} left</span>
      </div>
    )
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-xs font-semibold text-emerald-600">In stock · Ready to ship</span>
    </div>
  )
}

// ─── SizeChartModal ───────────────────────────────────────────────────────────

function SizeChartModal({ sizes, onClose }: { sizes: Size[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 w-full sm:w-auto sm:min-w-[400px] bg-white rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl sm:mx-4"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-neutral-500" />
            <h3 className="text-sm font-bold text-neutral-900">Size Guide</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-neutral-600" />
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-neutral-100">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Label
                </th>
                <th className="text-right px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Size ID
                </th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((size) => (
                <tr key={size.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3 font-semibold text-neutral-900">{size.label}</td>
                  <td className="px-4 py-3 text-right text-xs font-mono text-neutral-400">
                    {size.id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-neutral-400 leading-relaxed">
          Measurements may vary slightly. When between sizes, we recommend sizing up.
        </p>
      </motion.div>
    </div>
  )
}

// ─── TermsModal ───────────────────────────────────────────────────────────────

function TermsModal({ onClose }: { onClose: () => void }) {
  const sections = [
    {
      title: 'Shipping & Delivery',
      content: 'We offer worldwide shipping. Standard delivery takes 3-5 business days. Free shipping on orders over $150.',
    },
    {
      title: 'Returns & Exchanges',
      content: 'Items can be returned within 30 days of purchase in their original condition and packaging. Sale items are final sale.',
    },
    {
      title: 'Quality Guarantee',
      content: 'Every piece is inspected for quality. We use premium materials designed for durability and comfort.',
    },
    {
      title: 'Secure Shopping',
      content: 'Your security is our priority. All transactions are encrypted and we never store your full credit card details.',
    }
  ]

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl sm:mx-4 max-h-[80vh] overflow-y-auto scrollbar-none"
      >
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-2 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
              <FileText className="w-4 h-4 text-neutral-900" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Terms & Conditions</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-neutral-600" />
          </button>
        </div>

        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">{section.title}</h4>
              <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                {section.content}
              </p>
            </div>
          ))}
          
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 flex gap-3">
             <AlertCircle className="w-5 h-5 text-neutral-400 shrink-0" />
             <p className="text-xs text-neutral-400 leading-relaxed">
              By ticking the agreement box on the product page, you acknowledge that you have read and understood these terms.
             </p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="mt-8 w-full py-4 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Got it, thanks
        </button>
      </motion.div>
    </div>
  )
}

// ─── RelatedProductCard ───────────────────────────────────────────────────────

function RelatedProductCard({ product }: { product: Product }) {
  const image = product.images?.[0]?.image as Media | undefined
  const hasSale =
    typeof product.salePrice === 'number' &&
    product.salePrice > 0 &&
    product.price > product.salePrice
  const displayPrice = hasSale ? product.salePrice! : product.price

  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col gap-3">
      <div className="relative aspect-[3/4] bg-[#F0EDE8] rounded-2xl overflow-hidden">
        {image?.url && (
          <Image
            src={image.url}
            alt={image.alt ?? product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {hasSale && (
          <span className="absolute top-3 left-3 text-[9px] font-bold bg-rose-500 text-white px-2 py-1 rounded-full tracking-wide">
            -{discountPercent(product.price, product.salePrice!)}%
          </span>
        )}
      </div>
      <div className="px-0.5 space-y-1">
        <p className="text-sm font-semibold text-neutral-900 truncate group-hover:text-neutral-500 transition-colors">
          {product.name}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-neutral-900">${displayPrice}</span>
          {hasSale && (
            <span className="text-xs text-neutral-400 line-through">${product.price}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

// ─── ProductDetails ───────────────────────────────────────────────────────────

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product, relatedProducts }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [showSizeChart, setShowSizeChart] = useState(false)
  const [isAgreedToTerms, setIsAgreedToTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showTermsError, setShowTermsError] = useState(false)

  const { isInWishlist, toggleWishlist } = useWishlist()
  const isWishlisted = isInWishlist(String(product.id))

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  // ── Images ──────────────────────────────────────────────────────────────
  const allImages = useMemo(
    () => product.images?.map((item) => item.image as Media).filter(Boolean) ?? [],
    [product.images],
  )

  // ── Flatten variants once — source of truth for all lookups ─────────────
  // Each entry maps resolved colorId + sizeId → stock/sku.
  // We resolve IDs here so comparisons are always string vs string.
  const resolvedVariants: ResolvedVariant[] = useMemo(
    () =>
      (product.variants ?? []).map((v) => ({
        colorId: resolveId(v.color),
        sizeId: resolveId(v.size),
        sku: v.sku,
        stock: v.stock ?? 0,
      })),
    [product.variants],
  )

  // ── Unique color/size lists (preserve insertion order) ──────────────────
  const colors: Color[] = useMemo(() => {
    const seen = new Set<string>()
    const out: Color[] = []
    for (const v of product.variants ?? []) {
      if (!v.color || typeof v.color !== 'object') continue
      const c = v.color as Color
      const id = String(c.id)
      if (!seen.has(id)) {
        seen.add(id)
        out.push(c)
      }
    }
    return out
  }, [product.variants])

  const sizes: Size[] = useMemo(() => {
    const seen = new Set<string>()
    const out: Size[] = []
    for (const v of product.variants ?? []) {
      if (!v.size || typeof v.size !== 'object') continue
      const s = v.size as Size
      const id = String(s.id)
      if (!seen.has(id)) {
        seen.add(id)
        out.push(s)
      }
    }
    return out
  }, [product.variants])

  // ── Available sets — NEVER depend on each other to prevent deadlock ──────
  //
  // Rule: a color is selectable if ANY variant with that color has stock > 0.
  //       a size is selectable if ANY variant with that size has stock > 0.
  //       Crossing: once a color IS selected, show which sizes exist for it
  //       (even stock=0, so user can see "out of stock for this color").
  //       Sizes with no variant for the selected color → disabled/hidden.

  const colorIdsWithStock = useMemo(
    () => new Set(resolvedVariants.filter((v) => v.stock > 0).map((v) => v.colorId)),
    [resolvedVariants],
  )

  // Sizes that exist for the selected color (regardless of stock).
  // If no color selected → all sizes that exist in any variant.
  const sizeIdsForColor = useMemo(() => {
    if (!selectedColor) return new Set(resolvedVariants.map((v) => v.sizeId))
    return new Set(resolvedVariants.filter((v) => v.colorId === selectedColor).map((v) => v.sizeId))
  }, [selectedColor, resolvedVariants])

  // ── Active variant (only when both are chosen) ───────────────────────────
  const selectedVariant: ResolvedVariant | null = useMemo(() => {
    if (!selectedColor || !selectedSize) return null
    return (
      resolvedVariants.find((v) => v.colorId === selectedColor && v.sizeId === selectedSize) ?? null
    )
  }, [resolvedVariants, selectedColor, selectedSize])

  const currentStock = selectedVariant?.stock ?? 0
  const variantChosen = selectedColor !== null && selectedSize !== null
  const isOutOfStock = variantChosen && currentStock === 0
  const canAdd = variantChosen && currentStock > 0 && !isAddingToCart && !isAdded

  // ── Pricing — price lives on the product, not per-variant ───────────────
  // salePrice must be a positive number strictly less than price to count.
  const hasSale =
    typeof product.salePrice === 'number' &&
    product.salePrice > 0 &&
    product.price > product.salePrice

  const unitPrice = hasSale ? product.salePrice! : product.price
  const originalPrice = product.price
  const pct = hasSale ? discountPercent(originalPrice, unitPrice) : 0
  // Subtotal updates live as quantity changes
  const subtotal = (unitPrice * quantity).toFixed(2)

  const categoryName =
    product.category && typeof product.category === 'object' ? (product.category as any).name : null

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleColorSelect = (id: string) => {
    setSelectedColor(id)
    // If the already-chosen size has no variant for this new color, clear it.
    if (selectedSize) {
      const exists = resolvedVariants.some((v) => v.colorId === id && v.sizeId === selectedSize)
      if (!exists) setSelectedSize(null)
    }
    setQuantity(1)
  }

  const handleSizeSelect = (id: string) => {
    setSelectedSize(id)
    setQuantity(1)
  }

  const handleAddToCart = async () => {
    if (!canAdd) return
    if (!isAgreedToTerms) {
      setShowTermsError(true)
      setTimeout(() => setShowTermsError(false), 3000)
      return
    }
    setIsAddingToCart(true)
    await new Promise((r) => setTimeout(r, 800))
    setIsAddingToCart(false)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2500)
  }

  const handleBuyNow = async () => {
    if (!canAdd) return
    if (!isAgreedToTerms) {
      setShowTermsError(true)
      setTimeout(() => setShowTermsError(false), 3000)
      return
    }
    // Simulation of direct checkout
    setIsAddingToCart(true)
    await new Promise((r) => setTimeout(r, 1000))
    window.alert('Redirecting to checkout...')
    setIsAddingToCart(false)
  }

  const prevImage = () => setSelectedImageIndex((p) => (p === 0 ? allImages.length - 1 : p - 1))
  const nextImage = () => setSelectedImageIndex((p) => (p === allImages.length - 1 ? 0 : p + 1))

  return (
    <>
      <section className="min-h-screen bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24">
            {/* ── Gallery ─────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-[3/4] sm:aspect-[4/5] bg-[#F0EDE8] rounded-2xl overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute inset-0"
                  >
                    {allImages[selectedImageIndex]?.url && (
                      <Image
                        src={allImages[selectedImageIndex].url!}
                        alt={allImages[selectedImageIndex].alt ?? product.name}
                        fill
                        priority
                        className="object-cover"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 text-neutral-800" />
                    </button>
                    <button
                      onClick={nextImage}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4 text-neutral-800" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:hidden">
                      {allImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={cn(
                            'rounded-full transition-all duration-300 cursor-pointer',
                            selectedImageIndex === idx
                              ? 'w-5 h-1.5 bg-neutral-900'
                              : 'w-1.5 h-1.5 bg-neutral-400',
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}

                <button
                  onClick={handleWishlistClick}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-colors z-10 cursor-pointer"
                >
                  <Heart
                    className={cn(
                      'w-5 h-5 transition-colors',
                      isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-neutral-700',
                    )}
                  />
                </button>
              </div>

              {allImages.length > 1 && (
                <div className="hidden sm:flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx + (img.alt ?? '')}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={cn(
                        'relative flex-shrink-0 w-[72px] aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer',
                        selectedImageIndex === idx
                          ? 'border-neutral-900 opacity-100'
                          : 'border-transparent opacity-50 hover:opacity-80',
                      )}
                    >
                      <Image
                        src={img.url ?? ''}
                        alt={img.alt ?? ''}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Info ────────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-5 lg:gap-6 lg:pt-2">
              {/* Meta row */}
              <div className="flex items-center justify-between">
                {categoryName && (
                  <span className="text-[10px] sm:text-xs font-semibold tracking-[0.15em] uppercase text-neutral-400 bg-neutral-100 px-3 py-1.5 rounded-full">
                    {categoryName}
                  </span>
                )}
                <div className="flex items-center gap-1.5 ml-auto">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-neutral-400 font-medium">(24)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-[1.6rem] sm:text-4xl lg:text-[2.5rem] font-bold tracking-tight text-neutral-900 leading-[1.1]">
                {product.name}
              </h1>

              {/* Pricing block */}
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold text-neutral-900">
                    ${unitPrice}
                  </span>
                  {hasSale && (
                    <>
                      <span className="text-lg text-neutral-400 line-through font-medium">
                        ${originalPrice}
                      </span>
                      <span className="text-[10px] font-bold text-white bg-rose-500 px-2.5 py-1 rounded-full tracking-wide">
                        -{pct}% OFF
                      </span>
                    </>
                  )}
                </div>
                {/* Subtotal — updates live with quantity */}
                {quantity > 1 && (
                  <p className="text-xs text-neutral-400">
                    Subtotal: <span className="font-semibold text-neutral-700">${subtotal}</span>
                  </p>
                )}
              </div>

              <p className="text-neutral-500 text-sm sm:text-[15px] leading-relaxed">
                {product.description ??
                  'Crafted with meticulous attention to detail and premium materials, designed for comfort and everyday sophistication.'}
              </p>

              <div className="h-px bg-neutral-100" />

              {/* ── Color selector ── */}
              {colors.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Color
                    {selectedColor && (
                      <span className="ml-2 normal-case tracking-normal font-semibold text-neutral-700">
                        — {colors.find((c) => String(c.id) === selectedColor)?.name}
                      </span>
                    )}
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {colors.map((color) => {
                      const id = String(color.id)
                      // A color is disabled only if it has zero stock across ALL its variants
                      const hasAnyStock = colorIdsWithStock.has(id)
                      const isSelected = selectedColor === id
                      return (
                        <button
                          key={id}
                          onClick={() => handleColorSelect(id)}
                          title={color.name}
                          className={cn(
                            'relative w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all cursor-pointer ring-offset-2 ring-offset-[#FAFAF8]',
                            isSelected
                              ? 'ring-2 ring-neutral-900 scale-110'
                              : hasAnyStock
                                ? 'ring-1 ring-neutral-200 hover:ring-neutral-500 hover:scale-105'
                                : 'ring-1 ring-neutral-100 opacity-35 cursor-not-allowed',
                          )}
                          style={{ backgroundColor: color.hex ?? '#888' }}
                        >
                          {!hasAnyStock && (
                            <span className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden">
                              <span className="w-[130%] h-px bg-neutral-500/50 rotate-45 block" />
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ── Size selector ── */}
              {sizes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      Size
                    </p>
                    <button
                      onClick={() => setShowSizeChart(true)}
                      className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                    >
                      <Ruler className="w-3 h-3" />
                      Size guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => {
                      const id = String(size.id)
                      // Size is selectable only if it exists in a variant for the chosen color
                      // (or in any variant if no color is chosen yet).
                      const existsForColor = sizeIdsForColor.has(id)
                      const isSelected = selectedSize === id

                      // If color is chosen, show stock for this specific color+size combo
                      const variantForThis = selectedColor
                        ? resolvedVariants.find(
                            (v) => v.colorId === selectedColor && v.sizeId === id,
                          )
                        : null
                      const stockForThis = variantForThis?.stock ?? null
                      const isLowStock =
                        stockForThis !== null &&
                        stockForThis > 0 &&
                        stockForThis <= LOW_STOCK_THRESHOLD

                      return (
                        <button
                          key={id}
                          onClick={() => existsForColor && handleSizeSelect(id)}
                          disabled={!existsForColor}
                          className={cn(
                            'relative min-w-[48px] h-10 px-4 rounded-lg border text-xs font-bold transition-all',
                            isSelected
                              ? 'bg-neutral-900 border-neutral-900 text-white cursor-pointer'
                              : existsForColor
                                ? 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-500 cursor-pointer'
                                : 'bg-neutral-50 border-neutral-100 text-neutral-300 cursor-not-allowed line-through decoration-neutral-300',
                          )}
                        >
                          {size.label}
                          {isLowStock && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full border-2 border-[#FAFAF8]" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ── Stock indicator (appears after both color+size chosen) ── */}
              <AnimatePresence>
                {variantChosen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center justify-between py-2.5 px-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                      <StockBadge stock={currentStock} />
                      {selectedVariant?.sku && (
                        <span className="text-[10px] font-mono text-neutral-400">
                          SKU: {selectedVariant.sku}
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Terms and Conditions */}
              <div className="space-y-3 mt-2">
                <div className="flex items-start gap-3">
                  <div 
                    onClick={() => setIsAgreedToTerms(!isAgreedToTerms)}
                    className={cn(
                      "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 mt-0.5",
                      isAgreedToTerms ? "bg-neutral-900 border-neutral-900" : "bg-white border-neutral-200"
                    )}
                  >
                    {isAgreedToTerms && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <p className="text-[13px] text-neutral-500 leading-tight">
                    I agree to the{' '}
                    <button 
                      onClick={() => setShowTermsModal(true)}
                      className="text-neutral-900 font-bold underline underline-offset-4 hover:text-neutral-600 transition-colors cursor-pointer"
                    >
                      Terms and Conditions
                    </button>
                  </p>
                </div>
                <AnimatePresence>
                  {showTermsError && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[11px] font-bold text-rose-500 flex items-center gap-1.5"
                    >
                      <AlertCircle className="w-3 h-3" />
                      Please agree to the terms and conditions to proceed
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Prompt if nothing selected yet */}
              {!variantChosen && (colors.length > 0 || sizes.length > 0) && (
                <p className="text-xs text-neutral-400 italic -mt-1">
                  {!selectedColor && colors.length > 0
                    ? 'Select a color to continue'
                    : 'Select a size to continue'}
                </p>
              )}

              {/* ── Quantity + CTA ── */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                  <div className="flex items-center justify-between sm:justify-start bg-neutral-100 rounded-xl h-12 px-1 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-white transition-colors cursor-pointer disabled:opacity-30"
                  >
                    <Minus className="w-3.5 h-3.5 text-neutral-700" />
                  </button>
                    <span className="w-12 sm:w-8 text-center text-sm font-bold text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => (variantChosen ? Math.min(q + 1, currentStock) : q + 1))
                    }
                    disabled={variantChosen && quantity >= currentStock}
                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-white transition-colors cursor-pointer disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5 text-neutral-700" />
                  </button>
                </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={!canAdd}
                    className={cn(
                      'w-full sm:flex-1 h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all duration-300 overflow-hidden',
                      !variantChosen || isOutOfStock
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        : isAdded
                          ? 'bg-emerald-500 text-white cursor-default'
                          : 'bg-white border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-50 active:scale-[0.98] cursor-pointer',
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {!variantChosen ? (
                        <motion.span
                          key="select"
                          className="flex items-center gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Select options
                        </motion.span>
                      ) : isOutOfStock ? (
                        <motion.span
                          key="oos"
                          className="flex items-center gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <PackageX className="w-4 h-4" />
                          Out of Stock
                        </motion.span>
                      ) : isAddingToCart ? (
                        <motion.span
                          key="loading"
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                        >
                          <RefreshCcw className="w-4 h-4 animate-spin" />
                          Adding…
                        </motion.span>
                      ) : isAdded ? (
                        <motion.span
                          key="done"
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Check className="w-4 h-4" />
                          Added to Cart
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Add to Cart
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={!canAdd}
                    className={cn(
                      'w-full sm:flex-[1.2] h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-extrabold transition-all duration-300 shadow-sm border border-neutral-900',
                      !variantChosen || isOutOfStock
                        ? 'bg-neutral-200 text-neutral-400 border-neutral-200 cursor-not-allowed'
                        : 'bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98] cursor-pointer ring-4 ring-neutral-900/5',
                    )}
                  >
                    {isOutOfStock ? 'Notify Me' : 'Buy Now'}
                  </button>
                </div>
              </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-100">
                  {FEATURES.map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="flex flex-col items-start gap-2">
                      <div className="w-8 h-8 flex items-center justify-center bg-neutral-100 rounded-lg">
                        <Icon className="w-4 h-4 text-neutral-700" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs font-bold text-neutral-900 leading-tight">
                          {label}
                        </p>
                        <p className="text-[9px] sm:text-[11px] text-neutral-400 leading-tight mt-0.5">
                          {sub}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Related Products ─────────────────────────────────────────── */}
            {relatedProducts && relatedProducts.length > 0 && (
              <div className="mt-20 lg:mt-28">
                <div className="flex items-end justify-between mb-8 sm:mb-10">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1.5">
                      You May Also Like
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                      Related Products
                    </h2>
                  </div>
                  <Link
                    href="/products"
                    className="hidden sm:block text-xs font-semibold text-neutral-400 hover:text-neutral-900 transition-colors underline underline-offset-4"
                  >
                    View all
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {relatedProducts.slice(0, 4).map((rp) => (
                    <RelatedProductCard key={rp.id} product={rp} />
                  ))}
                </div>

                <div className="mt-6 text-center sm:hidden">
                  <Link
                    href="/products"
                    className="text-xs font-semibold text-neutral-400 hover:text-neutral-900 transition-colors underline underline-offset-4"
                  >
                    View all products
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        <AnimatePresence>
          {showSizeChart && <SizeChartModal sizes={sizes} onClose={() => setShowSizeChart(false)} />}
          {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}
        </AnimatePresence>
      </>
    )
  }

