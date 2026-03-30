'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'

import { SectionWrapper } from '../SectionWrapper'
import { Media } from '@/payload-types'

gsap.registerPlugin(ScrollTrigger)

export interface AboutSectionProps {
  badge: string
  title: string
  description: string
  image: Media
  stats: {
    value: string
    label: string
  }[]
  values: {
    number: string
    title: string
    description: string
  }[]
  properties?: any
}

import { ArrowRight } from 'lucide-react'

export const AboutSection = ({
  badge,
  title,
  description,
  image,
  stats,
  values,
  properties,
}: AboutSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

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

        gsap.from(imageContainerRef.current, {
          x: -100,
          opacity: 0,
          duration: 1.4,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: imageContainerRef.current,
            start: 'top 80%',
          },
        })

        gsap.from('.value-item', {
          x: 60,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: valuesRef.current,
            start: 'top 80%',
          },
        })

        gsap.from('.stat-item', {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 90%',
          },
        })
      })

      mm.add('(max-width: 1023px)', () => {
        // Mobile Entrance (Simpler/Faster)
        gsap.from([headerRef.current, imageContainerRef.current, '.value-item'], {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
          },
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])
  return (
    <SectionWrapper containerProps={properties}>
      <div ref={containerRef} className="relative z-10">
        {/* Header */}
        <div ref={headerRef} className="max-w-3xl mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#52575b]">
              {badge}
            </span>
            <span
              className="flex-1 h-px"
              style={{
                background: `linear-gradient(90deg, #52575b40, transparent)`,
              }}
            />
          </div>

          <h2 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] font-light tracking-tight leading-[1.1] mb-6 text-[#171717]">
            {title}
          </h2>

          <p className="text-base md:text-lg max-w-xl leading-relaxed text-[#52575b]">
            {description}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16 md:mb-20">
          {/* Image */}
          <div
            ref={imageContainerRef}
            className="group relative aspect-[4/5] overflow-hidden"
            style={{
              background: `linear-gradient(135deg, #1d1b1b20, #05091430)`,
            }}
          >
            <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-800">
              <Image src={image?.url || ''} alt={image?.alt || ''} fill className="object-cover" />
            </div>

            <div className="absolute inset-0 bg-neutral-950 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-500" />

            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
              <span className="text-xs font-medium tracking-[0.2em] uppercase block mb-2 text-white/60">
                Est. 2020
              </span>
              <p className="text-lg font-light text-white">Redefining everyday luxury</p>
            </div>
          </div>

          {/* Values */}
          <div className="flex flex-col justify-center">
            <span className="text-xs font-medium tracking-[0.2em] uppercase mb-8 text-[#52575b]">
              Our Values
            </span>

            <div ref={valuesRef} className="space-y-0 text-[#171717]">
              {values.map((item) => (
                <div
                  key={item.number}
                  className="value-item group relative py-8 border-b first:border-t cursor-pointer overflow-hidden transition-all duration-300 hover:bg-neutral-50"
                  style={{ borderColor: `#52575b20` }}
                >
                  <div className="relative flex items-start gap-6">
                    <span className="text-sm font-medium tabular-nums text-[#52575b60] group-hover:text-[#52575b]">
                      {item.number}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium mb-2 group-hover:text-[#1d1b1b]">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed max-w-sm text-[#52575b] group-hover:text-[#171717]">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight
                      className="w-5 h-5 transition-all duration-300 mt-1 text-[#52575b60] group-hover:text-[#050914] group-hover:translate-x-1"
                      strokeWidth={1.2}
                    />
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#our-story"
              className="group inline-flex items-center gap-3 mt-10 text-sm font-medium tracking-wide uppercase cursor-pointer text-[#1d1b1b]"
            >
              <span>Read Our Story</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="stat-item group relative p-8 md:p-10 text-center bg-white hover:bg-neutral-50 transition-all duration-300"
            >
              <span className="block text-3xl md:text-4xl font-light tracking-tight mb-2 text-[#171717] group-hover:text-[#050914]">
                {stat.value}
              </span>
              <span className="text-xs font-medium tracking-[0.15em] uppercase text-[#52575b] group-hover:text-[#1d1b1b]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
