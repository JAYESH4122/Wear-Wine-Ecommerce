'use client'
import React, { useRef } from 'react'
import Image from 'next/image'
import { SliderNavButtons } from '../arrow-slider/slider-nav-button'
import { useResponsive } from '@/hooks/use-responsive'
import { ArrowSlider } from '../arrow-slider'
import type { Media } from '@/payload-types'

export interface HeroSliderProps {
  slides: Media[]
}

export const HeroSlider = ({ slides }: HeroSliderProps) => {
  const swiperRef = useRef(null)
  const { isDesktop } = useResponsive()
  const renderImages = (slide: Media) => {
    return (
      <div className="w-screen h-[400px] lg:h-[800px] relative">
        <Image
          src={slide.url || ''}
          alt={slide.alt || 'Hero Image'}
          fill
          className="object-cover"
          priority
        />
      </div>
    )
  }
  return (
    <div className="flex items-center">
      {isDesktop && (
        <SliderNavButtons
          swiperRef={swiperRef}
          SliderArrowClassname="absolute w-full flex justify-between z-10 px-10"
        />
      )}
      <ArrowSlider
        swiperRef={swiperRef}
        renderItem={slides.map((slide) => ({
          key: `${slide.id}`,
          element: renderImages(slide),
        }))}
        paginationClassName="absolute bottom-10 z-10"
        autoplay={{
          delay: 2000,
        }}
        fade
        slidesPerView={1}
      />
    </div>
  )
}
