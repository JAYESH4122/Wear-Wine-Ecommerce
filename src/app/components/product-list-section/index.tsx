'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import type { Swiper as SwiperInstance } from 'swiper'
import NextImage from 'next/image'
import { Grid3x3, Image as ImageIcon, X, ChevronRight } from 'lucide-react'
import { ProductCard } from '../product-card'
import { ArrowSlider } from '../arrow-slider'
import { cn } from '@/lib/utils'
import { products as localProducts } from '@/data/products'
import { categories as localCategories } from '@/data/categories'

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

const fadeUpVariant = {
  hidden: { opacity: 0, y: -100 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      delay,
    },
  }),
}

const NavButton = ({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) => (
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
  <button
    onClick={onClick}
    className={cn(
      'p-2.5 transition-all duration-200 cursor-pointer',
      active
        ? 'bg-white text-neutral-900 border border-neutral-200'
        : 'text-neutral-400 hover:text-neutral-600 border border-transparent',
    )}
    aria-label={label}
  >
    <Icon className="w-4 h-4" />
  </button>
)

// ... existing types and variants ...

export const ProductListSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'detailed' | 'images'>('detailed')
  const swiperRef = useRef<SwiperInstance | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const categories = useMemo(() => [ALL_CATEGORY, ...localCategories], [])

  const formattedProducts: Product[] = useMemo(
    () =>
      localProducts.map((p) => ({
        id: p.id,
        title: p.name,
        price: p.salePrice ?? p.price,
        originalPrice: p.salePrice ? p.price : undefined,
        image: p.images?.[0]?.url ?? '/placeholder.jpg',
        badge: p.tags?.[0]?.name ?? (p.salePrice ? 'Sale' : undefined),
        rating: 5.0,
        reviews: Math.floor(Math.random() * 50) + 10,
        category: p.category?.name ?? 'General',
        categorySlug: p.category?.slug,
        slug: p.slug,
      })),
    [],
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

  return (
    <section className="relative py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between lg:mb-8 mb-4 gap-6"
          // variants={fadeUpVariant}
          // initial="hidden"
          // whileInView="visible"
          // viewport={{ once: false, margin: '-80px' }}
          // custom={0}
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-12 h-px bg-primary" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-secondary">
                New Arrivals
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-text mb-4">
              Premium <span className="text-secondary/60 font-bold">Collection</span>
            </h2>
            <p className="text-secondary text-lg">
              Explore our latest pieces designed for modern living.
            </p>
          </div>

          <button className="group flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary transition-colors cursor-pointer">
            View All Products
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200"
          // variants={fadeUpVariant}
          // initial="hidden"
          // whileInView="visible"
          // viewport={{ once: false, margin: '-80px' }}
          // custom={0.15}
        >
          <LayoutGroup>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={cn(
                    'relative px-5 py-2.5 text-sm font-medium transition-all whitespace-nowrap cursor-pointer',
                    selectedCategory === cat.id
                      ? 'text-white'
                      : 'text-secondary border border-neutral-200 hover:border-neutral-400',
                  )}
                >
                  {selectedCategory === cat.id && (
                    <motion.div
                      // layoutId="active-category"
                      className="absolute inset-0 bg-neutral-900"
                      // transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">{cat.name}</span>
                </button>
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
              <NavButton direction="prev" onClick={() => swiperRef.current?.slidePrev()} />
              <NavButton direction="next" onClick={() => swiperRef.current?.slideNext()} />
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

        {/* Content */}
        {filteredProducts.length > 0 ? (
          <motion.div
            className="relative"
            // variants={fadeUpVariant}
            // initial="hidden"
            // whileInView="visible"
            // viewport={{ once: false, margin: '-80px' }}
            // custom={0.2}
          >
            {/* <AnimatePresence mode="wait"> */}
              <motion.div
                key={`${selectedCategory}-${viewMode}`}
                // initial={{ opacity: 0, y: -100 }}
                // animate={{ opacity: 1, y: 0 }}
                // exit={{ opacity: 0, y: -40 }}
                // transition={{
                //   duration: 0.5,
                //   ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
                // }}
              >
                <ArrowSlider
                  swiperRef={swiperRef}
                  renderItem={filteredProducts.map((product) => ({
                    key: product.id,
                    element:
                      viewMode === 'detailed' ? (
                        <div>
                          <ProductCard {...product} />
                        </div>
                      ) : (
                        <div className="group relative aspect-square bg-neutral-100 overflow-hidden cursor-pointer">
                          <NextImage
                            src={product.image}
                            alt={product.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
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
                  showPagination={false}
                  onSlideChange={handleSlideChange}
                />

                {/* Line pagination */}
                <motion.div
                  className="flex gap-2 items-center justify-center mt-8"
                  variants={fadeUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false }}
                  custom={0.3}
                >
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
                </motion.div>
              </motion.div>
            {/* </AnimatePresence> */}
          </motion.div>
        ) : (
          <motion.div
            className="py-20 text-center"
            // variants={fadeUpVariant}
            // initial="hidden"
            // whileInView="visible"
            // viewport={{ once: false }}
            // custom={0}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 mb-4">
              <X className="w-6 h-6 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium">No products found</h3>
            <p className="text-neutral-500">Try adjusting your filters.</p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
