'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import type { Swiper as SwiperInstance } from 'swiper'
import NextImage from 'next/image'
import { Sparkles, Tag, Grid3x3, Image as ImageIcon, X, ChevronRight } from 'lucide-react'
import { ProductCard } from '../product-card'
import { SliderNavButtons } from '../arrow-slider/slider-nav-button'
import { ArrowSlider } from '../arrow-slider'
import { cn } from '@/lib/utils'

type Category = { id: string; name: string; icon: React.ElementType }

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
}

const ALL_CATEGORY: Category = { id: 'all', name: 'All Products', icon: Sparkles }

const BREAKPOINTS = {
  320: { slidesPerView: 1, spaceBetween: 16 },
  640: { slidesPerView: 2, spaceBetween: 16 },
  1024: { slidesPerView: 3, spaceBetween: 20 },
  1280: { slidesPerView: 4, spaceBetween: 24 },
}

export const ProductListSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'detailed' | 'images'>('detailed')
  const swiperRef = useRef<SwiperInstance | null>(null)
  const [dbProducts, setDbProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([ALL_CATEGORY])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=20')
        if (res.ok) {
          const data = await res.json()
          const products: any[] = data.docs || []
          setDbProducts(products)

          const seen = new Set<string>()
          const derived: Category[] = []
          products.forEach((p) => {
            const cat = p.category
            if (cat && typeof cat === 'object' && cat.slug && !seen.has(cat.slug)) {
              seen.add(cat.slug)
              derived.push({ id: cat.slug, name: cat.name, icon: Tag })
            }
          })
          setCategories([ALL_CATEGORY, ...derived])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const formattedProducts: Product[] = useMemo(
    () =>
      dbProducts.map((p) => ({
        id: String(p.id ?? p._id),
        title: p.name ?? 'Untitled Product',
        price: p.salePrice ?? p.price ?? 0,
        originalPrice: p.salePrice ? p.price : undefined,
        image:
          p.image?.url ??
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1200',
        badge: p.tags?.[0]?.name ?? (p.salePrice ? 'Sale' : undefined),
        rating: 5.0,
        reviews: Math.floor(Math.random() * 50) + 10,
        category: p.category?.name ?? 'General',
        categorySlug: p.category?.slug,
      })),
    [dbProducts],
  )

  const filteredProducts = formattedProducts.filter((p) =>
    selectedCategory === 'all' ? true : p.categorySlug === selectedCategory,
  )

  return (
    <section className="relative py-20 bg-[#fafafa] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-neutral-200/50 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-neutral-200/50 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between lg:mb-8 mb-4 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-12 h-[1px] bg-black" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-500">
                New Arrivals
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 mb-4">
              Premium <span className="text-neutral-400 font-light italic">Collection</span>
            </h2>
            <p className="text-neutral-500 text-lg">
              Explore our latest pieces designed for modern living.
            </p>
          </motion.div>

          <div className="flex items-center gap-3">
            <button className="group flex items-center gap-2 text-sm font-semibold text-primary hover:text-neutral-600 transition-colors cursor-pointer">
              View All Products{' '}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200">
          <LayoutGroup>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'relative px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer',
                    selectedCategory === cat.id
                      ? 'text-white'
                      : 'bg-white text-neutral-600 border border-neutral-200 shadow-sm hover:shadow hover:bg-neutral-50',
                  )}
                >
                  {selectedCategory === cat.id && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-black rounded-full"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {cat.id === 'all' && <cat.icon className="w-4 h-4" />}
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </LayoutGroup>

          <div className="flex items-center gap-3 w-full justify-start md:w-auto md:ml-auto md:justify-end">
            <div className="hidden md:flex items-center gap-2 mr-2">
              <SliderNavButtons
                key={selectedCategory + viewMode}
                swiperRef={swiperRef}
                variant="primary"
                size="sm"
              />
            </div>

            <div className="flex items-center p-1 bg-neutral-100 rounded-lg border border-neutral-200">
              <button
                onClick={() => setViewMode('detailed')}
                className={cn(
                  'p-2 rounded-md transition-all cursor-pointer',
                  viewMode === 'detailed'
                    ? 'bg-white shadow-sm text-black'
                    : 'text-neutral-400 hover:text-neutral-600',
                )}
                aria-label="Detailed View"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('images')}
                className={cn(
                  'p-2 rounded-md transition-all cursor-pointer',
                  viewMode === 'images'
                    ? 'bg-white shadow-sm text-black'
                    : 'text-neutral-400 hover:text-neutral-600',
                )}
                aria-label="Images Only View"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-neutral-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div layout className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory + viewMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <ArrowSlider
                  swiperRef={swiperRef}
                  renderItem={filteredProducts.map((product) => ({
                    key: product.id,
                    element: (
                      <div className="h-full">
                        {viewMode === 'detailed' ? (
                          <div className="h-full">
                            <ProductCard {...product} />
                          </div>
                        ) : (
                          <div className="h-full">
                            <div className="group relative aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 cursor-pointer">
                              <NextImage
                                src={product.image}
                                alt={product.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              {product.badge && (
                                <div className="absolute left-4 top-4 flex flex-col gap-2 z-10">
                                  <span className="px-3 py-1.5 bg-white text-gray-900 text-xs font-semibold shadow-lg">
                                    {product.badge}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ),
                  }))}
                  slidesPerView={1}
                  spaceBetween={16}
                  breakpoints={BREAKPOINTS}
                  speed={800}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  showPagination
                  paginationClassName="bottom-0"
                  autoHeight
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-4">
              <X className="w-6 h-6 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium">No products found</h3>
            <p className="text-neutral-500">Try adjusting your filters or category.</p>
          </div>
        )}
      </div>
    </section>
  )
}
