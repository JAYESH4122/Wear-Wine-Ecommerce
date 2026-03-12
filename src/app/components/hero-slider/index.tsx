'use client'
import React, { useRef } from 'react'
import Image from 'next/image'
import { SliderNavButtons } from '../ui/arrow-slider/slider-nav-button'
import { useResponsive } from '@/hooks/use-responsive'
import { ArrowSlider } from '../ui/arrow-slider'
import { StaticImageData } from 'next/image'

export interface HeroSliderProps {
  slides: StaticImageData[]
}

export const HeroSlider = ({ slides }: HeroSliderProps) => {
  const swiperRef = useRef(null)
  const { isDesktop } = useResponsive()
  const renderImages = (slide: StaticImageData) => {
    return (
      <div className="w-screen h-62.5 lg:h-200 relative">
        <Image src={slide.src} alt="slide" fill className="object-cover" />
      </div>
    )
  }
  return (
    <div className="flex items-center">
      {isDesktop && (
        <SliderNavButtons
          swiperRef={swiperRef}
          SliderArrowClassname="absolute w-full flex justify-between z-50 px-10"
        />
      )}
      <ArrowSlider
        swiperRef={swiperRef}
        renderItem={slides.map((slide) => ({
          key: `${slide.src}`,
          element: renderImages(slide),
        }))}
        paginationClassName="absolute bottom-30 z-50"
        autoplay={{
          delay: 2000,
        }}
        fade
        slidesPerView={1}
      />
    </div>
  )
}
