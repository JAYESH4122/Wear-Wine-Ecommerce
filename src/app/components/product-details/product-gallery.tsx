'use client'

import Image from 'next/image'
import { useRef, useState, useMemo, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { Swiper as SwiperInstance } from 'swiper'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Media } from './types'

interface Props {
  images: Media[]
  productName: string
  discountPercentage: number
  hasSale: boolean
}

export const ProductGallery = ({ images, productName, discountPercentage, hasSale }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperInstance | null>(null)

  const safeImages = useMemo(() => images?.filter((img) => img?.url) ?? [], [images])

  const goTo = useCallback((idx: number) => {
    setActiveIndex(idx)
    swiperRef.current?.slideTo(idx)
  }, [])

  const total = safeImages.length

  // 🎯 Dynamic desktop layout logic (prevents broken UI)
  const getLayout = useMemo(() => {
    if (total === 1) return 'single'
    if (total === 2) return 'split'
    if (total === 3) return 'feature-left'
    return 'masonry'
  }, [total])

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <div className="hidden sm:grid grid-cols-12 gap-2 h-[620px]">
        {getLayout === 'single' && (
          <div className="col-span-12 relative overflow-hidden bg-neutral-100">
            <Image
              src={safeImages[0].url!}
              alt={safeImages[0].alt ?? productName}
              fill
              className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
              priority
              sizes="100vw"
            />
          </div>
        )}

        {getLayout === 'split' &&
          safeImages.slice(0, 2).map((img, idx) => (
            <div key={idx} className="col-span-6 relative overflow-hidden bg-neutral-100">
              <Image
                src={img.url!}
                alt={img.alt ?? productName}
                fill
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                priority={idx === 0}
                sizes="50vw"
              />
            </div>
          ))}

        {getLayout === 'feature-left' && (
          <>
            <div className="col-span-7 relative overflow-hidden bg-neutral-100">
              <Image
                src={safeImages[0].url!}
                alt={safeImages[0].alt ?? productName}
                fill
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
                priority
                sizes="60vw"
              />
            </div>

            <div className="col-span-5 grid grid-rows-2 gap-2">
              {safeImages.slice(1, 3).map((img, idx) => (
                <div key={idx} className="relative overflow-hidden bg-neutral-100">
                  <Image
                    src={img.url!}
                    alt={img.alt ?? productName}
                    fill
                    className="object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
                    sizes="40vw"
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {getLayout === 'masonry' &&
          safeImages.slice(0, 5).map((img, idx) => {
            const layoutMap = [
              'col-span-7 row-span-2',
              'col-span-5',
              'col-span-3',
              'col-span-2',
              'col-span-2',
            ]

            return (
              <div
                key={idx}
                className={cn(
                  'relative overflow-hidden bg-neutral-100 group',
                  layoutMap[idx],
                )}
              >
                <Image
                  src={img.url!}
                  alt={img.alt ?? productName}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  priority={idx === 0}
                  sizes={idx === 0 ? '60vw' : '25vw'}
                />
              </div>
            )
          })}

        {/* Sale badge */}
        {hasSale && total > 0 && (
          <span className="absolute top-4 left-4 z-10 bg-neutral-900 text-white px-3 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase">
            -{discountPercentage}% Off
          </span>
        )}
      </div>

      {/* ================= MOBILE ================= */}
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
            {safeImages.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative h-full w-full">
                  <Image
                    src={img.url!}
                    alt={img.alt ?? productName}
                    fill
                    className="object-cover"
                    priority={idx === 0}
                    sizes="100vw"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {hasSale && (
            <span className="absolute top-4 left-4 z-10 bg-neutral-900 text-white px-3 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase">
              -{discountPercentage}% Off
            </span>
          )}
        </div>

        {/* Premium thumbnail strip */}
        {total > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-none px-1">
            {safeImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={cn(
                  'relative shrink-0 w-16 h-16 overflow-hidden rounded-md bg-neutral-100 transition-all duration-300',
                  activeIndex === idx
                    ? 'ring-2 ring-neutral-900 scale-105'
                    : 'opacity-60',
                )}
              >
                <Image
                  src={img.url!}
                  alt={img.alt ?? productName}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}