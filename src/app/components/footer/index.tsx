'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaWhatsapp } from 'react-icons/fa6'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'

import type { Footer as FooterCMS, SiteSetting, Policy } from '@/payload-types'
import { LogoWhite } from 'assets'

gsap.registerPlugin(useGSAP)

const socialIcons: Record<string, React.ReactNode> = {
  Facebook: <FaFacebookF size={14} />,
  Instagram: <FaInstagram size={14} />,
  Twitter: <FaXTwitter size={14} />,
  LinkedIn: <FaLinkedinIn size={14} />,
  WhatsApp: <FaWhatsapp size={14} />,
}

interface FooterProps {
  cmsData?: FooterCMS | null
  siteSettings?: SiteSetting | null
}

export const Footer = ({ cmsData, siteSettings }: FooterProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const brandName = siteSettings?.siteName || 'Wear Wine'
  const brandYear = cmsData?.copyright?.year ?? new Date().getFullYear().toString()
  const copyrightText = cmsData?.copyright?.text ?? 'All rights reserved.'
  
  const socials = cmsData?.socials ?? []
  const policyLinks = cmsData?.policiesGroup?.links ?? []
  
  useGSAP(() => {
    // Media Query for exact mobile vs desktop detection using gsap.matchMedia
    const mm = gsap.matchMedia()
    
    mm.add('(pointer: fine)', () => {
      // Desktop interactions: Hover and mousemove
      gsap.utils.toArray<HTMLElement>('.interactive-link').forEach((link) => {
        const xTo = gsap.quickTo(link, 'x', { duration: 0.3, ease: 'power3' })
        const yTo = gsap.quickTo(link, 'y', { duration: 0.3, ease: 'power3' })
        
        const onMouseEnter = () => {
          gsap.to(link, { color: '#ffffff', scale: 1.05, duration: 0.3 })
        }
        
        const onMouseLeave = () => {
          xTo(0)
          yTo(0)
          gsap.to(link, { color: '', scale: 1, duration: 0.3 })
        }
        
        const onMouseMove = (e: MouseEvent) => {
          const rect = link.getBoundingClientRect()
          const relX = e.clientX - rect.left - rect.width / 2
          const relY = e.clientY - rect.top - rect.height / 2
          xTo(relX * 0.2)
          yTo(relY * 0.2)
        }
        
        link.addEventListener('mouseenter', onMouseEnter)
        link.addEventListener('mouseleave', onMouseLeave)
        link.addEventListener('mousemove', onMouseMove)
        
        return () => {
          link.removeEventListener('mouseenter', onMouseEnter)
          link.removeEventListener('mouseleave', onMouseLeave)
          link.removeEventListener('mousemove', onMouseMove)
        }
      })
    })

    mm.add('(pointer: coarse)', () => {
      // Mobile Interactions: pointerdown/up logic for the 'spotlight' card effect requirement
      gsap.utils.toArray<HTMLElement>('.interactive-card').forEach((card) => {
        const onPointerDown = () => {
          gsap.to(card, { 
            scale: 1.03, 
            filter: 'brightness(1.1) grayscale(0)',
            duration: 0.2, 
            ease: 'power2.out' 
          })
          const overlay = card.querySelector('.spotlight-overlay')
          if (overlay) {
            gsap.to(overlay, { opacity: 0.1, duration: 0.2 })
          }
        }
        
        const onPointerUp = () => {
          gsap.to(card, { 
            scale: 1, 
            filter: 'brightness(1) grayscale(0)',
            duration: 0.4, 
            ease: 'power2.out' 
          })
          const overlay = card.querySelector('.spotlight-overlay')
          if (overlay) {
            gsap.to(overlay, { opacity: 0, duration: 0.4 })
          }
        }
        
        card.addEventListener('pointerdown', onPointerDown)
        card.addEventListener('pointerup', onPointerUp)
        card.addEventListener('pointercancel', onPointerUp)
        card.addEventListener('pointerleave', onPointerUp)
        
        return () => {
          card.removeEventListener('pointerdown', onPointerDown)
          card.removeEventListener('pointerup', onPointerUp)
          card.removeEventListener('pointercancel', onPointerUp)
          card.removeEventListener('pointerleave', onPointerUp)
        }
      })
      
      // Passive floating animation for mobile to give it a premium feel
      gsap.to('.passive-float', {
        yPercent: -2,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      })
    })

    return () => mm.revert()
  }, { scope: containerRef })

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden bg-primary text-background",
        "will-change-transform"
      )}
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-background/5 via-transparent to-secondary/10" />

      <footer className="relative z-10 mx-auto max-w-7xl px-6 pb-8 pt-10  lg:pt-16 md:px-12">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-secondary/30 to-transparent mb-4 lg:mb-16" />

        <div className="grid grid-cols-1 gap-12 border-b border-background/10 pb-14 md:grid-cols-4 md:gap-8">
          
          {/* Logo & Intro */}
          <div className="flex flex-col gap-5 md:col-span-1 interactive-card relative group rounded-2xl p-4 -ml-4 transition-colors">
            <div className="spotlight-overlay absolute inset-0 rounded-2xl bg-white opacity-0 pointer-events-none" />
            <div className="passive-float">
                <Image
                  src={LogoWhite}
                  alt={brandName}
                  width={180}
                  height={56}
                  className="h-14 w-24 lg:h-19 lg:w-36 object-contain"
                  unoptimized
                />
            </div>
            <p className="text-sm text-background/60 leading-relaxed mt-2">
              {cmsData?.description || 'We blend classic styles with modern luxury to give you the perfect wardrobe for every occasion.'}
            </p>
            <p className="text-xs font-semibold tracking-widest uppercase text-background/40">
              {cmsData?.tagline || 'Elegance & Comfort'}
            </p>
          </div>

          {/* Contact Group */}
          {cmsData?.contact && (
            <div className="flex flex-col gap-6 w-full md:col-span-1">
              <h3 className="text-[0.625rem] font-bold uppercase tracking-[0.2em] text-background/50">
                {cmsData.contact.title || 'Contact Us'}
              </h3>
              <ul className="flex flex-col gap-3">
                {cmsData.contact.email && (
                  <li>
                    <a href={`mailto:${cmsData.contact.email}`} className="interactive-link inline-block text-sm text-background/60 hover:text-white transition-colors">
                      {cmsData.contact.email}
                    </a>
                  </li>
                )}
                {cmsData.contact.phone && (
                  <li>
                    <a href={`tel:${cmsData.contact.phone}`} className="interactive-link inline-block text-sm text-background/60 hover:text-white transition-colors">
                      {cmsData.contact.phone}
                    </a>
                  </li>
                )}
                {cmsData.contact.hours?.map((h, i) => (
                  <li key={i} className="text-sm text-background/40">
                    {h.time}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Policies */}
          {policyLinks.length > 0 && (
            <div className="flex flex-col gap-6 w-full md:col-span-1">
              <h3 className="text-[0.625rem] font-bold uppercase tracking-[0.2em] text-background/50">
                {cmsData?.policiesGroup?.title || 'Policies'}
              </h3>
              <ul className="flex flex-col gap-3">
                {policyLinks.map((l, i) => {
                  const href = l.link && typeof l.link === 'object' ? `/policies/${(l.link as Policy).slug}` : '#'
                  return (
                    <li key={`policy-${i}`}>
                      <Link
                        href={href}
                        className="interactive-link inline-block text-sm text-background/60 transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Socials */}
          <div className="flex flex-col gap-6 w-full md:col-span-1">
            <h3 className="text-[0.625rem] font-bold uppercase tracking-[0.2em] text-background/50">
              Socials
            </h3>
            <nav className="flex flex-wrap gap-3" aria-label="Social media">
              {socials.map((s, i) => {
                const icon = socialIcons[s.name] || <span className="text-xs">{s.name}</span>
                return (
                  <a
                    key={`social-${i}`}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="interactive-link flex size-10 items-center justify-center rounded-full border border-background/20 text-background/50 hover:bg-white/5 transition-colors"
                  >
                    {icon}
                  </a>
                )
              })}
            </nav>
          </div>

        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 text-[0.6875rem] tracking-wider text-background/40">
          <p>
            © {brandYear} {cmsData?.copyright?.brand || brandName}. {copyrightText}
          </p>
        </div>
      </footer>
    </div>
  )
}
