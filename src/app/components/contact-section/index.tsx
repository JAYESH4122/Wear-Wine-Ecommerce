'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useEffect, useRef } from 'react'
import { SectionWrapper } from '../SectionWrapper'

import {
  Phone,
  Mail,
  Clock,
  ChevronRight,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  ArrowUpRight,
  Headphones,
} from 'lucide-react'

export interface ContactSectionProps {
  badge: string
  title: string
  description: string
  methods: {
    type: string
    value: string
    href: string
  }[]
  socialLinks: {
    platform: 'Instagram' | 'Twitter' | 'LinkedIn' | 'Facebook'
    href: string
  }[]
  newsletter: {
    title: string
    description: string
    buttonText: string
  }
  properties?: any
}

const getSocialIcon = (platform: string) => {
  switch (platform) {
    case 'Instagram': return Instagram
    case 'Twitter': return Twitter
    case 'LinkedIn': return Linkedin
    case 'Facebook': return Facebook
    default: return ArrowUpRight
  }
}

const getMethodIcon = (type: string) => {
  switch (type) {
    case 'Email': return Mail
    case 'Phone': return Phone
    case 'Chat': return Headphones
    default: return Clock
  }
}

export const ContactSection = ({
  badge,
  title,
  description,
  methods,
  socialLinks,
  newsletter,
  properties,
}: ContactSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const methodsRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        // Desktop Entrance
        gsap.from(headerRef.current, {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
          },
        })

        gsap.from('.method-card', {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: methodsRef.current,
            start: 'top 80%',
          },
        })

        gsap.from(footerRef.current, {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          },
        })

        if (bannerRef.current) {
          gsap.from(bannerRef.current, {
            scale: 0.98,
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: bannerRef.current,
              start: 'top 85%',
            },
          })
        }
      })

      mm.add('(max-width: 1023px)', () => {
        // Mobile Entrance
        gsap.from([headerRef.current, '.method-card'], {
          y: 20,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
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
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-xs font-medium tracking-wider uppercase text-neutral-500 block mb-6">
            {badge}
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-neutral-900 mb-6">
            {title}
          </h2>

          <p className="text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div ref={methodsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-20">
          {methods.map((method) => {
            const Icon = getMethodIcon(method.type)
            return (
              <a
                key={method.type}
                href={method.href}
                className="method-card group relative bg-gradient-to-br from-white to-neutral-50/80 border border-neutral-200 p-6 md:p-8 hover:border-neutral-300 transition-all duration-500 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 border border-neutral-200 group-hover:border-white/30 flex items-center justify-center mb-6 transition-all duration-500 bg-gradient-to-br from-white to-neutral-50 group-hover:from-white/10 group-hover:to-white/5">
                    <Icon
                      className="w-6 h-6 text-neutral-600 group-hover:text-white transition-colors duration-500"
                      strokeWidth={1.2}
                    />
                  </div>

                  <span className="text-xs font-medium tracking-wider uppercase text-neutral-400 group-hover:text-white/70 block mb-2 transition-colors duration-500">
                    {method.type}
                  </span>

                  <p className="text-base font-medium text-neutral-900 group-hover:text-white transition-colors duration-500">
                    {method.value}
                  </p>

                  <div className="absolute top-2 right-2">
                    <ArrowUpRight
                      className="w-5 h-5 text-neutral-900 group-hover:text-white transition-colors duration-500"
                      strokeWidth={1.2}
                    />
                  </div>
                </div>
              </a>
            )
          })}
        </div>

        {/* Divider */}
        <div className="border-b border-neutral-200 mb-16 md:mb-20" />

        {/* Social Section */}
        <div ref={footerRef} className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-medium tracking-wider uppercase text-neutral-500 block mb-3">
              Follow Us
            </span>
            <p className="text-base text-neutral-900">Stay connected for updates & new arrivals</p>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = getSocialIcon(social.platform)
              return (
                <a
                  key={social.platform}
                  href={social.href}
                  className="group relative w-14 h-14 border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 hover:border-transparent flex items-center justify-center transition-all duration-300 overflow-hidden"
                  aria-label={social.platform}
                >
                  <div className="absolute inset-0 bg-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Icon
                    className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors duration-500 relative z-10"
                    strokeWidth={1.2}
                  />
                </a>
              )
            })}
          </div>
        </div>

        {/* CTA Banner */}
        {newsletter && (
          <div ref={bannerRef} className="mt-16 md:mt-20 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white relative overflow-hidden group">
            <div className="relative p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div>
                <span className="text-xs font-medium tracking-wider uppercase text-neutral-400 block mb-4">
                  Newsletter
                </span>

                <h3 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight mb-3">
                  {newsletter.title}
                </h3>

                <p className="text-base text-neutral-400 max-w-md leading-relaxed">
                  {newsletter.description}
                </p>
              </div>

              <a
                href="#subscribe"
                className="group/btn inline-flex items-center gap-3 bg-white text-neutral-900 text-sm font-medium tracking-wide uppercase px-12 py-5 hover:bg-neutral-50 transition-all duration-300 cursor-pointer flex-shrink-0 relative overflow-hidden"
              >
                <span className="relative z-10">{newsletter.buttonText}</span>
                <ChevronRight className="w-4 h-4 relative z-10" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}