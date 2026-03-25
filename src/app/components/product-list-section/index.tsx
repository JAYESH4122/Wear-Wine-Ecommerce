'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence, LayoutGroup, useInView } from 'framer-motion'
import type { Swiper as SwiperInstance } from 'swiper'
import NextImage from 'next/image'
import { Grid3x3, Image as ImageIcon, X, ChevronRight } from 'lucide-react'
import { ProductCard } from '../product-card'
import { ArrowSlider } from '../arrow-slider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button/Button'

type Category = { id: string; name: string }

interface Product {
  id: string
  title: string
  price: number
  originalPrice?: number
  image: string
  badge?: string
  rating: number
  reviews: number
  category: string
  categorySlug?: string
  slug?: string
}

const ALL_CATEGORY: Category = { id: 'all', name: 'All Products' }

const BREAKPOINTS = {
  320: { slidesPerView: 1, spaceBetween: 16 },
  640: { slidesPerView: 2, spaceBetween: 16 },
  1024: { slidesPerView: 3, spaceBetween: 20 },
  1280: { slidesPerView: 4, spaceBetween: 24 },
}

const ToggleButton = ({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ElementType
  label: string
}) => (
  <Button
    onClick={onClick}
    variant="icon"
    size="icon"
    leftIcon={<Icon className="w-4 h-4" />}
    aria-label={label}
    className={cn(
      'h-10 w-10 border transition-all duration-200',
      active
        ? 'bg-white text-neutral-900 border-neutral-200'
        : 'bg-transparent text-neutral-400 hover:text-neutral-600 border-transparent',
    )}
  />
)

export const ProductListSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'detailed' | 'images'>('detailed')
  const swiperRef = useRef<SwiperInstance | null>(null)
  const [dbProducts, setDbProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([ALL_CATEGORY])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const animationRef = useRef(null)
  const isInView = useInView(animationRef, { amount: 0.2, once: true })

  useEffect(() => {
    const controller = new AbortController()
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=20', { signal: controller.signal })
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        const products: any[] = data.docs || []
        setDbProducts(products)

        const seen = new Set<string>()
        const derived: Category[] = []
        for (const p of products) {
          const cat = p.category
          if (cat?.slug && !seen.has(cat.slug)) {
            seen.add(cat.slug)
            derived.push({ id: cat.slug, name: cat.name })
          }
        }
        setCategories([ALL_CATEGORY, ...derived])
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error fetching products:', error)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (isInView) {
      setHasAnimated(true)
    }
  }, [isInView])

  const formattedProducts: Product[] = useMemo(
    () =>
      dbProducts.map((p) => ({
        id: String(p.id ?? p._id),
        title: p.name ?? 'Untitled Product',
        price: p.salePrice ?? p.price ?? 0,
        originalPrice: p.salePrice ? p.price : undefined,
        image: p.images?.[0]?.image?.url ?? '/placeholder.jpg',
        badge: p.tags?.[0]?.name ?? (p.salePrice ? 'Sale' : undefined),
        rating: 5.0,
        reviews: Math.floor(Math.random() * 50) + 10,
        category: p.category?.name ?? 'General',
        categorySlug: p.category?.slug,
        slug: p.slug,
      })),
    [dbProducts],
  )

  const filteredProducts = useMemo(
    () =>
      formattedProducts.filter((p) =>
        selectedCategory === 'all' ? true : p.categorySlug === selectedCategory,
      ),
    [formattedProducts, selectedCategory],
  )

  const totalSlides = Math.max(1, Math.ceil(filteredProducts.length / 4))

  const handleSlideChange = useCallback((swiper: SwiperInstance) => {
    setActiveIndex(Math.floor(swiper.realIndex / 4))
  }, [])

  const handleCategoryChange = useCallback((id: string) => {
    setSelectedCategory(id)
    setActiveIndex(0)
    swiperRef.current?.slideTo(0)
  }, [])

  const goToSlide = useCallback((index: number) => {
    swiperRef.current?.slideTo(index * 4)
  }, [])

  const NavButton = ({
    direction,
    onClick,
  }: {
    direction: 'prev' | 'next'
    onClick: () => void
  }) => (
    <button
      onClick={onClick}
      className="w-10 h-10 flex items-center justify-center cursor-pointer text-neutral-600 border border-neutral-200 bg-white backdrop-blur-sm transition-all duration-200 hover:border-neutral-400 hover:text-neutral-900"
      aria-label={direction === 'prev' ? 'Previous' : 'Next'}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {direction === 'prev' ? <path d="M8 2L4 6L8 10" /> : <path d="M4 2L8 6L4 10" />}
      </svg>
    </button>
  )

  return (
    <section className="relative py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="lg:mb-10 mb-5">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-2"
          >
            <span className="text-[11px] font-black uppercase tracking-tighter text-neutral-900">
              // NEW ARRIVALS
            </span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 lg:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="max-w-2xl"
            >
              <h2 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900">
                <span>Product</span> <span className="text-neutral-500">List</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <Button
                variant="ghost"
                size="lg"
                rightIcon={
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                }
                className="group px-0 py-0 text-black relative flex items-center gap-2 lg:px-8 lg:py-4 lg:bg-neutral-900 lg:text-white text-xs font-black uppercase tracking-widest hover:bg-neutral-800 transition-all cursor-pointer"
              >
                Shop All
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200"
        >
          <LayoutGroup>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'relative px-5 py-2.5 text-sm font-medium whitespace-nowrap',
                    selectedCategory === cat.id
                      ? 'text-white'
                      : 'text-secondary border border-neutral-200 hover:border-neutral-400',
                  )}
                >
                  {selectedCategory === cat.id && (
                    <div
                      // layoutId="active-category"
                      className="absolute inset-0 bg-neutral-900"
                      // transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">{cat.name}</span>
                </Button>
              ))}
            </div>
          </LayoutGroup>

          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-400 tracking-wider tabular-nums">
              <span className="text-neutral-700">{String(activeIndex + 1).padStart(2, '0')}</span>
              {' / '}
              {String(totalSlides).padStart(2, '0')}
            </span>

            <div className="hidden md:flex items-center gap-1">
              <div className="  z-30 flex  gap-2">
                {(['prev', 'next'] as const).map((dir) => (
                  <Button
                    key={dir}
                    onClick={() =>
                      dir === 'prev'
                        ? swiperRef.current?.slidePrev()
                        : swiperRef.current?.slideNext()
                    }
                    variant="slider"
                    size="icon"
                    leftIcon={
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {dir === 'prev' ? <path d="M8 2L4 6L8 10" /> : <path d="M4 2L8 6L4 10" />}
                      </svg>
                    }
                    className="w-11 h-11 text-white/70 border border-white/15 bg-black backdrop-blur-md hover:border-white/40 hover:bg-black/50"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center border border-neutral-200 bg-neutral-50">
              <ToggleButton
                active={viewMode === 'detailed'}
                onClick={() => setViewMode('detailed')}
                icon={Grid3x3}
                label="Detailed View"
              />
              <ToggleButton
                active={viewMode === 'images'}
                onClick={() => setViewMode('images')}
                icon={ImageIcon}
                label="Images View"
              />
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="relative">
            <AnimatePresence mode="wait">
              <div>
                <div ref={animationRef}>
                  <ArrowSlider
                    swiperRef={swiperRef}
                    renderItem={filteredProducts.map((product, idx) => ({
                      key: product.id,
                      element:
                        viewMode === 'detailed' ? (
                          <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.1,

                              ease: 'easeOut',
                            }}
                            viewport={{
                              once: false,
                            }}
                          >
                            <ProductCard {...product} />
                          </motion.div>
                        ) : (
                          <div className="group relative aspect-square bg-neutral-100 overflow-hidden cursor-pointer">
                            <motion.div
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              transition={{
                                duration: 0.5,
                                delay: idx * 0.12,
                                ease: 'easeOut',
                              }}
                              viewport={{
                                once: true,
                                amount: 0.2,
                              }}
                            >
                              <NextImage
                                src={product.image}
                                alt={product.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </motion.div>
                            {product.badge && (
                              <span className="absolute left-4 top-4 px-3 py-1.5 bg-white text-neutral-900 text-xs font-medium">
                                {product.badge}
                              </span>
                            )}
                          </div>
                        ),
                    }))}
                    slidesPerView={1}
                    spaceBetween={16}
                    breakpoints={BREAKPOINTS}
                    speed={600}
                    autoplay={{ delay: 5000, disableOnInteraction: true }}
                    loop={true}
                    showPagination={false}
                    onSlideChange={handleSlideChange}
                  />
                </div>

                {/* Line pagination */}
                <div className="flex gap-2 items-center justify-center mt-8">
                  {Array.from({ length: totalSlides }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToSlide(i)}
                      className={cn(
                        'h-px transition-all duration-300 cursor-pointer',
                        i === activeIndex
                          ? 'w-10 bg-neutral-800'
                          : 'w-5 bg-neutral-300 hover:bg-neutral-500',
                      )}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 mb-4">
              <X className="w-6 h-6 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium">No products found</h3>
            <p className="text-neutral-500">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </section>
  )
}
