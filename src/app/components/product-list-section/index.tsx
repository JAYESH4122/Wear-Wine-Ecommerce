'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Swiper as SwiperInstance } from 'swiper'
import NextImage from 'next/image'
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'

gsap.registerPlugin(ScrollTrigger)
import { Grid3x3, Image as ImageIcon, X, ChevronRight } from 'lucide-react'
import { ProductCard } from '../product-card'
import { ArrowSlider } from '../arrow-slider'
import { cn } from '@/lib/utils'
import { getApiUrl } from '@/lib/api/getApiUrl'
import { Button } from '@/components/ui/button/Button'
import { useResponsive } from '@/hooks/use-responsive'
import { SectionWrapper } from '../SectionWrapper'

import type { Category as CategoryType, Product as ProductType } from '@/payload-types'
import type { ContainerPropsType } from '@types-frontend/types'

type Category = { id: string; name: string }

interface Product {
  id: string
  title: string
  price: number
  originalPrice?: number
  image: string
  badge?: string
  rating: number
  reviews?: number
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
      'h-10 w-10 border transition-all duration-200 rounded-none',
      active
        ? 'bg-white text-neutral-900 border-neutral-200'
        : 'bg-transparent text-neutral-400 hover:text-neutral-600 border-transparent',
    )}
  />
)

interface ProductListSectionProps {
  badge?: string
  title?: string
  limit?: number
  properties?: ContainerPropsType
}

export const ProductListSection = ({
  badge = 'COLLECTIONS',
  title = 'Product List',
  limit = 8,
  properties,
}: ProductListSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'detailed' | 'images'>('detailed')
  const swiperRef = useRef<SwiperInstance | null>(null)
  const [dbProducts, setDbProducts] = useState<ProductType[]>([])
  const [categories, setCategories] = useState<Category[]>([ALL_CATEGORY])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const { isDesktop } = useResponsive()
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)
  const productsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        // Desktop Entrance
        gsap.from(headerRef.current, {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
          },
        })

        gsap.from(controlsRef.current, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: controlsRef.current,
            start: 'top 90%',
          },
        })

        if (productsRef.current) {
          gsap.from(productsRef.current, {
            y: 50,
            opacity: 0,
            duration: 1.4,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: productsRef.current,
              start: 'top 80%',
            },
          })
        }
      })

      mm.add('(max-width: 1023px)', () => {
        // Mobile Entrance
        gsap.from([headerRef.current, controlsRef.current, productsRef.current], {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const fetchProducts = async () => {
      try {
        const API_URL = getApiUrl()
        const res = await fetch(`${API_URL}/api/products?limit=${limit}`, {
          signal: controller.signal,
          credentials: 'include',
        })
        if (!res.ok) throw new Error('Failed to fetch')
        const data = (await res.json()) as { docs?: ProductType[] }
        const products = data.docs ?? []
        setDbProducts(products)

        const seen = new Set<string>()
        const derived: Category[] = []
        for (const p of products) {
          const cat =
            p.category && typeof p.category === 'object' ? (p.category as CategoryType) : null
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
  }, [limit])

  const formattedProducts: Product[] = useMemo(
    () =>
      dbProducts.map((p) => {
        const category =
          p.category && typeof p.category === 'object' ? (p.category as CategoryType) : null
        const firstImage = p.images?.[0]?.image
        const imageUrl =
          firstImage && typeof firstImage === 'object' ? firstImage.url ?? null : null
        const firstTag = p.tags?.[0]
        const tagName = firstTag && typeof firstTag === 'object' ? firstTag.name ?? null : null

        return {
          id: String(p.id),
          title: p.name,
          price: p.salePrice ?? p.price,
          originalPrice: p.salePrice ? p.price : undefined,
          image: imageUrl ?? '/placeholder.jpg',
          badge: tagName ?? (p.salePrice ? 'Sale' : undefined),
          rating: 5.0,
          category: category?.name ?? 'General',
          categorySlug: category?.slug,
          slug: p.slug ?? undefined,
        }
      }),
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

  return (
    <SectionWrapper
      containerProps={properties ?? {}}
      className={cn('!max-w-none !px-0')}
    >
      <div ref={sectionRef} className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="lg:mb-10 mb-5">
          <div className="mb-2">
            <div className="flex items-center gap-3">
              <div className="h-px w-6 bg-neutral-400" />
              <span className="text-[11px] font-black uppercase tracking-tighter text-neutral-900">
                {badge}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 lg:gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter text-text">
                {title}
              </h2>
            </div>

            <div>
              <Button
                variant={isDesktop ? 'primary' : 'ghost'}
                className={cn(isDesktop ? '' : 'p-0')}
                size="lg"
                rightIcon={
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                }
              >
                Shop More
              </Button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div
          ref={controlsRef}
          className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200"
        >
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={cn(
                  'relative px-5 py-2 text-sm font-medium whitespace-nowrap border transition-colors duration-200 cursor-pointer',
                  selectedCategory === cat.id
                    ? 'text-white border-neutral-900 bg-neutral-900'
                    : 'text-neutral-500 border-neutral-200 hover:border-neutral-900 hover:text-neutral-900',
                )}
              >
                <span className="relative z-10">{cat.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-400 tracking-wider tabular-nums">
              <span className="text-neutral-700">{String(activeIndex + 1).padStart(2, '0')}</span>
              {' / '}
              {String(totalSlides).padStart(2, '0')}
            </span>

            <div className="hidden md:flex items-center gap-1">
              <div className="z-30 flex gap-2">
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
                    sliderDirection={dir === 'prev' ? 'left' : 'right'}
                    className="w-11 h-11 !rounded-none text-white/70 border border-white/15 bg-button-primary backdrop-blur-md hover:border-white/40"
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
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="relative">
            <div ref={productsRef}>
              <ArrowSlider
                swiperRef={swiperRef}
                renderItem={filteredProducts.map((product) => ({
                  key: product.id,
                  element:
                    viewMode === 'detailed' ? (
                      <ProductCard {...product} />
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
    </SectionWrapper>
  )
}
