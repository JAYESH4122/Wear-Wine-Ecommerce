'use client'

import Image from 'next/image'
import { useRef, useState, useMemo, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { Swiper as SwiperInstance } from 'swiper'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Media } from './types'
import { getMediaUrl } from '@/lib/media'

interface Props {
  images: Media[]
  productName: string
  discountPercentage: number
  hasSale: boolean
}

type Layout = 'single' | 'split' | 'feature-left' | 'feature-strip' | 'masonry'

const SaleBadge = ({ percentage }: { percentage: number }) => (
  <span className="absolute top-4 left-4 z-10 bg-neutral-900 text-white px-3 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase">
    -{percentage}% Off
  </span>
)

const gallerySizes = {
  single: '(max-width: 1023px) 100vw, (max-width: 1439px) 56vw, 784px',
  split: '(max-width: 1023px) 50vw, (max-width: 1439px) 28vw, 392px',
  feature: '(max-width: 1023px) 67vw, (max-width: 1439px) 37vw, 523px',
  side: '(max-width: 1023px) 34vw, (max-width: 1439px) 19vw, 261px',
  masonryFeature: '(max-width: 1023px) 58vw, (max-width: 1439px) 33vw, 457px',
  masonrySide: '(max-width: 1023px) 42vw, (max-width: 1439px) 23vw, 327px',
  strip: '(max-width: 1023px) 50vw, (max-width: 1439px) 19vw, 261px',
} as const

const GalleryImage = ({
  img,
  productName,
  priority = false,
  sizes,
}: {
  img: Media
  productName: string
  priority?: boolean
  sizes: string
}) => {
  const imageUrl = getMediaUrl(img, 'pdp')

  if (!imageUrl) return null

  return (
    <Image
      src={imageUrl}
      alt={img.alt ?? productName}
      fill
      className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
      priority={priority}
      sizes={sizes}
    />
  )
}

export const ProductGallery = ({ images, productName, discountPercentage, hasSale }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperInstance | null>(null)

  const safeImages = useMemo(
    () => images?.filter((img) => Boolean(getMediaUrl(img, 'pdp'))) ?? [],
    [images],
  )

  const goTo = useCallback((idx: number) => {
    setActiveIndex(idx)
    swiperRef.current?.slideTo(idx)
  }, [])

  const total = safeImages.length

  const layout = useMemo<Layout>(() => {
    if (total <= 1) return 'single'
    if (total === 2) return 'split'
    if (total === 3) return 'feature-left'
    if (total === 4) return 'feature-strip'
    return 'masonry'
  }, [total])

  if (total === 0) return null

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden sm:block relative">
        {layout === 'single' && (
          <div className="relative h-[620px] overflow-hidden bg-neutral-100">
            <GalleryImage
              img={safeImages[0]}
              productName={productName}
              priority
              sizes={gallerySizes.single}
            />
            {hasSale && <SaleBadge percentage={discountPercentage} />}
          </div>
        )}

        {layout === 'split' && (
          <div className="relative grid grid-cols-2 gap-2 h-[620px]">
            {safeImages.slice(0, 2).map((img, idx) => (
              <div key={img.id} className="relative overflow-hidden bg-neutral-100">
                <GalleryImage
                  img={img}
                  productName={productName}
                  priority={idx === 0}
                  sizes={gallerySizes.split}
                />
              </div>
            ))}
            {hasSale && <SaleBadge percentage={discountPercentage} />}
          </div>
        )}

        {layout === 'feature-left' && (
          <div className="relative grid grid-cols-12 gap-2 h-[620px]">
            <div className="col-span-8 relative overflow-hidden bg-neutral-100">
              <GalleryImage
                img={safeImages[0]}
                productName={productName}
                priority
                sizes={gallerySizes.feature}
              />
            </div>
            <div className="col-span-4 grid grid-rows-2 gap-2">
              {safeImages.slice(1, 3).map((img) => (
                <div key={img.id} className="relative overflow-hidden bg-neutral-100">
                  <GalleryImage img={img} productName={productName} sizes={gallerySizes.side} />
                </div>
              ))}
            </div>
            {hasSale && <SaleBadge percentage={discountPercentage} />}
          </div>
        )}

        {layout === 'feature-strip' && (
          <div className="relative grid grid-cols-12 grid-rows-[1fr_auto] gap-2 h-[620px]">
            <div className="col-span-8 relative overflow-hidden bg-neutral-100">
              <GalleryImage
                img={safeImages[0]}
                productName={productName}
                priority
                sizes={gallerySizes.feature}
              />
            </div>
            <div className="col-span-4 grid grid-rows-2 gap-2">
              {safeImages.slice(1, 3).map((img) => (
                <div key={img.id} className="relative overflow-hidden bg-neutral-100">
                  <GalleryImage img={img} productName={productName} sizes={gallerySizes.side} />
                </div>
              ))}
            </div>
            <div className="col-span-12 relative h-[180px] overflow-hidden bg-neutral-100">
              <GalleryImage img={safeImages[3]} productName={productName} sizes={gallerySizes.single} />
            </div>
            {hasSale && <SaleBadge percentage={discountPercentage} />}
          </div>
        )}

        {layout === 'masonry' && (
          <div className="relative grid grid-cols-12 grid-rows-2 gap-2 h-[620px]">
            {/* Row 1: big feature (7) + 2 stacked (5) */}
            <div className="col-span-7 row-span-2 relative overflow-hidden bg-neutral-100">
              <GalleryImage
                img={safeImages[0]}
                productName={productName}
                priority
                sizes={gallerySizes.masonryFeature}
              />
            </div>
            <div className="col-span-5 relative overflow-hidden bg-neutral-100">
              <GalleryImage img={safeImages[1]} productName={productName} sizes={gallerySizes.masonrySide} />
            </div>
            <div className="col-span-5 relative overflow-hidden bg-neutral-100">
              <GalleryImage img={safeImages[2]} productName={productName} sizes={gallerySizes.masonrySide} />
            </div>
            {/* Row 2 bottom: 3 equal columns filling remaining cols under feature */}
            {/* Already filled by row-span-2 on col 0-6; cols 7-11 row 2 split into 2 above */}
            {/* Extra images go in an overlay strip */}
            {safeImages.length >= 6 && (
              <div
                className="col-span-12 relative h-[160px] overflow-hidden bg-neutral-100 -mt-1"
                style={{ gridColumn: '1 / -1', gridRow: '3' }}
              >
                <div className="grid grid-cols-3 gap-2 h-full">
                  {safeImages.slice(3, 6).map((img, idx) => (
                    <div key={img.id} className="relative overflow-hidden bg-neutral-100">
                      <GalleryImage img={img} productName={productName} sizes={gallerySizes.strip} />
                      {idx === 2 && safeImages.length > 6 && (
                        <div className="absolute inset-0 bg-neutral-900/50 flex items-center justify-center">
                          <span className="text-white text-sm font-medium tracking-wide">
                            +{safeImages.length - 6} more
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {safeImages.length === 5 && (
              <>
                <div
                  className="col-span-12 relative h-[160px] overflow-hidden bg-neutral-100"
                  style={{ gridColumn: '1 / -1', gridRow: '3' }}
                >
                  <div className="grid grid-cols-2 gap-2 h-full">
                    {safeImages.slice(3, 5).map((img) => (
                      <div key={img.id} className="relative overflow-hidden bg-neutral-100">
                        <GalleryImage img={img} productName={productName} sizes={gallerySizes.split} />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            {hasSale && <SaleBadge percentage={discountPercentage} />}
          </div>
        )}
      </div>

      {/* MOBILE */}
      <div className="sm:hidden flex flex-col gap-3">
        <div className="relative h-[55vh] min-h-[420px] overflow-hidden bg-neutral-100">
          <Swiper
            onSwiper={(s) => {
              swiperRef.current = s
            }}
            onSlideChange={(s) => setActiveIndex(s.activeIndex)}
            slidesPerView={1}
            speed={500}
            className="h-full w-full"
          >
            {safeImages.map((img, idx) => {
              const imageUrl = getMediaUrl(img, 'pdp')
              if (!imageUrl) return null

              return (
                <SwiperSlide key={img.id}>
                  <div className="relative h-full w-full">
                    <Image
                      src={imageUrl}
                      alt={img.alt ?? productName}
                      fill
                      className="object-cover"
                      priority={idx === 0}
                      sizes="100vw"
                    />
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
          {hasSale && <SaleBadge percentage={discountPercentage} />}
        </div>

        {total > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-none px-1">
            {safeImages.map((img, idx) => {
              const imageUrl = getMediaUrl(img, 'card') ?? getMediaUrl(img, 'pdp')
              if (!imageUrl) return null

              return (
                <button
                  key={img.id}
                  onClick={() => goTo(idx)}
                  className={cn(
                    'relative shrink-0 w-16 h-16 overflow-hidden rounded-md bg-neutral-100 transition-all duration-300',
                    activeIndex === idx ? 'ring-2 ring-neutral-900 scale-105' : 'opacity-60',
                  )}
                >
                  <Image
                    src={imageUrl}
                    alt={img.alt ?? productName}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
