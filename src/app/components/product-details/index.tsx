'use client'

import React, { useState, useMemo, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RefreshCcw,
  Plus,
  Minus,
  Check,
  X,
  ChevronDown,
  AlertCircle,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Color, Product, Size } from '@/types'
import { useWishlist } from '@/providers/wishlist'
import { useCart } from '@/providers/cart'

// gsap.registerPlugin(useGSAP)

interface ProductDetailsProps {
  product: Product
  relatedProducts?: Product[]
}

const TermsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <>
    {/* <AnimatePresence> */}
    {isOpen && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div
          // initial={{ opacity: 0 }}
          // animate={{ opacity: 1 }}
          // exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        />
        <motion.div
          // initial={{ opacity: 0, scale: 0.9, y: 20 }}
          // animate={{ opacity: 1, scale: 1, y: 0 }}
          // exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative z-10 w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-neutral-900" />
              <h3 className="text-lg font-bold text-neutral-900">Terms & Conditions</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-neutral-500" />
            </button>
          </div>
          <div className="p-6 max-h-[60vh] overflow-y-auto text-sm text-neutral-600 space-y-4 leading-relaxed">
            <p className="font-bold text-neutral-900">1. Shipping Policy</p>
            <p>
              Standard delivery takes 3-5 business days. International shipping may vary based on
              location.
            </p>
            <p className="font-bold text-neutral-900">2. Returns & Exchanges</p>
            <p>
              Items must be returned in original condition within 30 days. Sale items are final
              purchase.
            </p>
            <p className="font-bold text-neutral-900">3. Privacy & Security</p>
            <p>Your data is encrypted. We do not store full credit card details on our servers.</p>
          </div>
          <div className="p-6 border-t border-neutral-100">
            <button
              onClick={onClose}
              className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors"
            >
              Accept and Close
            </button>
          </div>
        </motion.div>
      </div>
    )}
    {/* </AnimatePresence> */}
  </>
)

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product, relatedProducts }) => {
  const container = useRef<HTMLDivElement>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [showSizeChart, setShowSizeChart] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [isAgreed, setIsAgreed] = useState(false)
  const [showError, setShowError] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>('details')

  const { isInWishlist, toggleWishlist } = useWishlist()
  const { addItem } = useCart()
  const isWishlisted = isInWishlist(String(product.id))

  const hasSale = product.salePrice && product.salePrice < product.price
  const discountPercentage = hasSale
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0

  // useGSAP(
  //   () => {
  //     const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.5 } })
  //     tl.from('.product-image-container', {
  //       clipPath: 'inset(100% 0% 0% 0%)',
  //       scale: 1.1,
  //       opacity: 0,
  //       y: 80,
  //       stagger: 0.1,
  //     }).from('.info-panel-item', { y: 30, opacity: 0, stagger: 0.07 }, '-=1.2')
  //   },
  //   { scope: container },
  // )

  const allImages = useMemo(() => product.images ?? [], [product.images])

  const colors = useMemo(() => {
    const seen = new Set<string>()
    return (product.variants ?? []).reduce((acc: Color[], v) => {
      if (!seen.has(v.color.id)) {
        seen.add(v.color.id)
        acc.push(v.color)
      }
      return acc
    }, [])
  }, [product.variants])

  const sizes = useMemo(() => {
    const seen = new Set<string>()
    return (product.variants ?? []).reduce((acc: Size[], v) => {
      if (!seen.has(v.size.id)) {
        seen.add(v.size.id)
        acc.push(v.size)
      }
      return acc
    }, [])
  }, [product.variants])

  const handleAddToCart = () => {
    if (!isAgreed) {
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }
    if (!selectedColor || !selectedSize) return
    const color = colors.find((c) => String(c.id) === selectedColor)
    const size = sizes.find((s) => String(s.id) === selectedSize)
    addItem(product, quantity, color, size)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div ref={container} className="bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="info-panel-item py-6 text-[10px] uppercase tracking-[0.2em] text-neutral-400">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-black">
            {product.category?.name ?? 'Product'}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          {/* Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allImages.map((img, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'product-image-container relative aspect-[3/4] bg-neutral-50 overflow-hidden',
                    idx === 0 ? 'sm:col-span-2' : 'sm:col-span-1',
                  )}
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-1000"
                    priority={idx === 0}
                  />
                  {idx === 0 && hasSale && (
                    <div className="absolute top-6 left-6 bg-black text-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                      Sale —{discountPercentage}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 pb-20">
              <div className="info-panel-item mb-8">
                <h1 className="text-xl lg:text-3xl font-light text-neutral-900 tracking-tight mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">
                    (24 Reviews)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-light text-neutral-900">
                    ${product.salePrice || product.price}
                  </span>
                  {hasSale && (
                    <>
                      <span className="text-sm text-neutral-400 line-through">
                        ${product.price}
                      </span>
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded tracking-widest uppercase">
                        Save {discountPercentage}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              <p className="info-panel-item text-[15px] text-neutral-500 leading-relaxed mb-8 border-b border-neutral-100 pb-8">
                {product.description}
              </p>

              {/* Color */}
              {colors.length > 0 && (
                <div className="info-panel-item mb-8">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-black mb-4">
                    Color Palette
                  </p>
                  <div className="flex gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(String(color.id))}
                        className={cn(
                          'w-10 h-10 rounded-full border-2 transition-all p-0.5',
                          selectedColor === String(color.id)
                            ? 'border-black'
                            : 'border-transparent',
                        )}
                      >
                        <div
                          className="w-full h-full rounded-full border border-neutral-100"
                          style={{ backgroundColor: color.hex ?? '#000' }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size */}
              {sizes.length > 0 && (
                <div className="info-panel-item mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black">
                      Size Guide
                    </p>
                    <button
                      onClick={() => setShowSizeChart(true)}
                      className="text-[10px] font-bold underline uppercase tracking-widest text-neutral-400 hover:text-black"
                    >
                      View Chart
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(String(size.id))}
                        className={cn(
                          'h-12 text-[11px] font-bold transition-all border',
                          selectedSize === String(size.id)
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-neutral-900 border-neutral-100 hover:border-black',
                        )}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Terms & Conditions Checkbox */}
              <div className="info-panel-item mb-6">
                <div className="flex items-start gap-3">
                  <div
                    onClick={() => setIsAgreed(!isAgreed)}
                    className={cn(
                      'mt-0.5 w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-all',
                      isAgreed ? 'bg-black border-black' : 'border-neutral-300',
                    )}
                  >
                    {isAgreed && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <p className="text-xs text-neutral-500 leading-tight">
                    I agree to the{' '}
                    <button
                      onClick={() => setShowTermsModal(true)}
                      className="text-black font-bold underline"
                    >
                      Terms & Conditions
                    </button>{' '}
                    and understand the return policy.
                  </p>
                </div>
                <AnimatePresence>
                  {showError && (
                    <motion.div
                      // initial={{ opacity: 0, y: -10 }}
                      // animate={{ opacity: 1, y: 0 }}
                      // exit={{ opacity: 0 }}
                      className="mt-3 flex items-center gap-2 text-rose-600"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-[11px] font-bold uppercase tracking-tighter">
                        Please agree to terms to proceed
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quantity & CTA */}
              <div className="info-panel-item flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex items-center border border-neutral-100 h-14 px-4 bg-neutral-50 rounded-lg sm:w-32 justify-between">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 hover:text-neutral-500"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 hover:text-neutral-500"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={cn(
                    'flex-1 h-14 text-[11px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 rounded-lg',
                    selectedColor && selectedSize && isAgreed
                      ? 'bg-black text-white hover:bg-neutral-800'
                      : 'bg-neutral-100 text-neutral-400 cursor-not-allowed',
                  )}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Bag
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(product)}
                className="info-panel-item w-full py-4 text-[10px] font-bold uppercase tracking-widest text-black border border-neutral-100 hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 mb-12 rounded-lg"
              >
                <Heart className={cn('w-4 h-4 transition-colors', isWishlisted && 'fill-black')} />
                {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
              </button>

              {/* Accordions */}
              <div className="info-panel-item border-t border-neutral-100">
                {[
                  {
                    id: 'details',
                    title: 'Product Details',
                    content:
                      'Premium construction with high-grade finishes designed for daily versatility.',
                  },
                  {
                    id: 'shipping',
                    title: 'Delivery & Returns',
                    content:
                      'Standard delivery 3-5 business days. Hassle-free returns within 30 days.',
                  },
                ].map((item) => (
                  <div key={item.id} className="border-b border-neutral-100">
                    <button
                      onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)}
                      className="w-full py-5 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-black text-left"
                    >
                      {item.title}
                      <ChevronDown
                        className={cn(
                          'w-3 h-3 transition-transform duration-300',
                          openAccordion === item.id && 'rotate-180',
                        )}
                      />
                    </button>
                    {/* <AnimatePresence> */}
                      {openAccordion === item.id && (
                        <motion.div
                          // initial={{ height: 0, opacity: 0 }}
                          // animate={{ height: 'auto', opacity: 1 }}
                          // exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="pb-5 text-[15px] text-neutral-500 leading-relaxed">
                            {item.content}
                          </p>
                        </motion.div>
                      )}
                    {/* </AnimatePresence> */}
                  </div>
                ))}
              </div>

              {/* Trust Badges */}
              <div className="info-panel-item grid grid-cols-3 gap-4 mt-12">
                {[
                  { icon: Truck, label: 'Fast Delivery' },
                  { icon: ShieldCheck, label: 'Secure' },
                  { icon: RefreshCcw, label: 'Returns' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    <item.icon className="w-4 h-4 mb-2 text-neutral-300" />
                    <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="py-24 border-t border-neutral-100">
            <div className="mb-12">
              <h2 className="text-xl font-light tracking-tight">Related Products</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} href={`/products/${rp.slug}`} className="group">
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50 mb-4 rounded-lg">
                    {rp.images?.[0]?.url && (
                      <Image
                        src={rp.images[0].url}
                        alt={rp.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <h3 className="text-[13px] font-medium text-neutral-900">{rp.name}</h3>
                  <p className="text-[11px] text-neutral-400 mt-1">${rp.price}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modals */}
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />

      {/* <AnimatePresence> */}
        {showSizeChart && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              // initial={{ opacity: 0 }}
              // animate={{ opacity: 1 }}
              // exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowSizeChart(false)}
            />
            <motion.div
              // initial={{ y: 50, opacity: 0 }}
              // animate={{ y: 0, opacity: 1 }}
              // exit={{ y: 50, opacity: 0 }}
              className="relative bg-white p-10 max-w-md w-full shadow-2xl rounded-2xl"
            >
              <button
                onClick={() => setShowSizeChart(false)}
                className="absolute top-6 right-6 text-neutral-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-neutral-900">
                Size Chart
              </h3>
              <div className="space-y-4">
                {sizes.map((s) => (
                  <div key={s.id} className="flex justify-between border-b border-neutral-50 pb-3">
                    <span className="text-xs font-medium text-neutral-700">{s.label}</span>
                    <span className="text-[10px] text-neutral-400 italic uppercase tracking-wider">
                      Universal Fit
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      {/* </AnimatePresence> */}
    </div>
  )
}
