'use client'

import React, { useId, useRef } from 'react'
import clsx from 'clsx'
import type { Swiper as SwiperInstance } from 'swiper'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/grid'
import 'swiper/css/pagination'
import { Autoplay, EffectFade, Grid, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import './arrow-slider.scss'

interface ArrowSliderProps {
  swiperRef?: React.RefObject<SwiperInstance | null>
  renderItem: { key: string; element: React.ReactNode }[]
  slidesPerView?: number | 'auto'
  centeredSlides?: boolean
  spaceBetween?: number
  loop?: boolean
  fade?: boolean
  showPagination?: boolean
  paginationId?: string
  autoHeight?: boolean
  slidesOffsetAfter?: number
  autoplay?: {
    delay: number
    disableOnInteraction?: boolean
  }
  swiperClassName?: string
  grid?: {
    rows: number
    fill?: 'row' | 'column'
  }
  initialSlide?: number
  speed?: number
  paginationClassName?: string
  onSlideChange?: (swiper: SwiperInstance) => void
  breakpoints?: Record<number, { slidesPerView?: number | 'auto'; spaceBetween?: number }>
}
export const ArrowSlider = ({
  swiperRef,
  renderItem,
  slidesPerView = 1,
  centeredSlides = false,
  spaceBetween = 0,
  loop = false,
  fade = false,
  showPagination = true,
  autoplay,
  swiperClassName,
  grid,
  autoHeight,
  paginationId,
  initialSlide,
  speed = 1000,
  paginationClassName,
  onSlideChange,
  breakpoints,
}: ArrowSliderProps) => {
  const localSwiperRef = useRef<SwiperInstance | null>(null)
  const activeSwiperRef = swiperRef || localSwiperRef

  const uniqueId = useId()
  const paginationElementId = paginationId || `swiper-pagination-${uniqueId.replace(/:/g, '-')}`

  const slidesPerViewCount = typeof slidesPerView === 'number' ? slidesPerView : 1

  const paginationConfig = showPagination
    ? {
        clickable: true,
        el: `#${paginationElementId}`,
        bulletClass: 'swiper-pagination-bullet',
        bulletActiveClass: 'swiper-pagination-bullet-active',
      }
    : false

  const renderPaginationControls = () => {
    return (
      <div
        id={paginationElementId}
        className={clsx('swiper-pagination-external mt-10! lg:mt-6!', paginationClassName)}
      />
    )
  }

  return (
    <div className="arrow-slider-wrapper">
      <Swiper
        onSwiper={(swiper) => {
          activeSwiperRef.current = swiper
        }}
        onSlideChange={(swiper) => {
          onSlideChange?.(swiper)
        }}
        modules={[Autoplay, EffectFade, Grid, Pagination]}
        effect={fade ? 'fade' : 'slide'}
        fadeEffect={fade ? { crossFade: true } : undefined}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        centeredSlides={centeredSlides}
        loop={loop}
        speed={speed}
        autoplay={autoplay}
        grid={grid}
        className={swiperClassName}
        pagination={paginationConfig}
        autoHeight={autoHeight}
        initialSlide={initialSlide}
        slidesPerGroup={Math.floor(slidesPerViewCount)}
        breakpoints={breakpoints}
      >
        {renderItem.map((item, index) => (
          <SwiperSlide key={item.key + index}>{item.element}</SwiperSlide>
        ))}
      </Swiper>
      {renderPaginationControls()}
    </div>
  )
}
