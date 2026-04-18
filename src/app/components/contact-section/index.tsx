'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useEffect, useRef, useState } from 'react'
import { SectionWrapper } from '../SectionWrapper'
import type { ContainerPropsType } from '@types-frontend/types'
import { Mail, Phone, Headphones, ArrowUpRight, Send } from 'lucide-react'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa6'
import { cn } from '@/lib/utils'

export interface ContactSectionProps {
  badge?: string
  title: string
  description?: string
  methods: {
    type: 'Email' | 'Phone' | 'Chat'
    value: string
    href: string
  }[]
  instagramHref?: string
  whatsappHref?: string
  properties?: ContainerPropsType
}

gsap.registerPlugin(ScrollTrigger)

const METHOD_CONFIG: Record<
  string,
  {
    icon: React.ElementType
    bg: string
    hoverBg: string
    iconColor: string
    labelColor: string
    valueColor: string
  }
> = {
  Email: {
    icon: Mail,
    bg: 'bg-[#f0f4ff]',
    hoverBg: 'hover:bg-[#e2eaff]',
    iconColor: 'text-[#4361ee]',
    labelColor: 'text-[#4361ee]/70',
    valueColor: 'text-[#1a2563]',
  },
  Phone: {
    icon: Phone,
    bg: 'bg-[#f0faf4]',
    hoverBg: 'hover:bg-[#dcf5e7]',
    iconColor: 'text-[#2d9b5a]',
    labelColor: 'text-[#2d9b5a]/70',
    valueColor: 'text-[#14472a]',
  },
  Chat: {
    icon: Headphones,
    bg: 'bg-[#fdf4ef]',
    hoverBg: 'hover:bg-[#fce8db]',
    iconColor: 'text-[#e07b39]',
    labelColor: 'text-[#e07b39]/70',
    valueColor: 'text-[#5c2d0a]',
  },
}

export const ContactSection = ({
  badge = 'Get in Touch',
  title,
  description,
  methods,
  instagramHref = 'https://instagram.com/wearvine',
  whatsappHref = 'https://wa.me/18009328746',
  properties,
}: ContactSectionProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(pointer: fine)', () => {
        gsap.from('.cs-fade', {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 80%' },
        })
      })

      mm.add('(pointer: coarse)', () => {
        gsap.from('.cs-fade', {
          y: 20,
          opacity: 0,
          duration: 0.7,
          stagger: 0.07,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 90%' },
        })
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <SectionWrapper containerProps={properties ?? {}}>
      <div ref={rootRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24">
        {/* ── LEFT COLUMN ─────────────────────────────────────── */}
        <div className="flex flex-col gap-10">
          {/* Header */}
          <div className="cs-fade">
            <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 block mb-4">
              {badge}
            </span>
            <h2 className="text-5xl md:text-6xl font-light tracking-tight text-neutral-900 leading-none mb-4 whitespace-pre-line">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-neutral-500 leading-relaxed max-w-sm">{description}</p>
            )}
          </div>

          {/* Method Cards */}
          <div className="cs-fade flex flex-col gap-2.5">
            {methods.map((m) => {
              const config = METHOD_CONFIG[m.type]
              const Icon = config.icon
              return (
                <a
                  key={m.type}
                  href={m.href}
                  className={cn(
                    'group flex items-center gap-4 px-5 py-4 transition-colors duration-300',
                    config.bg,
                    config.hoverBg,
                  )}
                >
                  <div className="w-8 h-8 flex items-center justify-center shrink-0">
                    <Icon className={cn('w-4 h-4', config.iconColor)} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span
                      className={cn(
                        'text-[10px] tracking-[0.18em] uppercase font-medium',
                        config.labelColor,
                      )}
                    >
                      {m.type}
                    </span>
                    <span className={cn('text-sm font-medium truncate', config.valueColor)}>
                      {m.value}
                    </span>
                  </div>
                  <ArrowUpRight
                    className={cn(
                      'w-4 h-4 ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                      config.iconColor,
                    )}
                    strokeWidth={1.5}
                  />
                </a>
              )
            })}
          </div>

          {/* Socials */}
          <div className="cs-fade flex items-center gap-3 border-t border-neutral-100 pt-8">
            <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mr-2">
              Follow
            </span>
            <a
              href={instagramHref}
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="group w-10 h-10 border border-neutral-200 flex items-center justify-center hover:border-[#E1306C] hover:bg-[#E1306C] transition-all duration-300"
            >
              <FaInstagram className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors duration-300" />
            </a>
            <a
              href={whatsappHref}
              aria-label="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
              className="group w-10 h-10 border border-neutral-200 flex items-center justify-center hover:border-[#25D366] hover:bg-[#25D366] transition-all duration-300"
            >
              <FaWhatsapp className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors duration-300" />
            </a>
          </div>
        </div>

        {/* ── RIGHT COLUMN — FORM ──────────────────────────────── */}
        <div className="cs-fade">
          {submitted ? (
            <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center gap-4 bg-neutral-50 px-8 py-16">
              <div className="w-12 h-12 border border-neutral-900 flex items-center justify-center">
                <Send className="w-5 h-5 text-neutral-900" strokeWidth={1.3} />
              </div>
	              <h3 className="text-2xl font-light tracking-tight text-neutral-900">Message Sent</h3>
	              <p className="text-sm text-neutral-500 max-w-xs leading-relaxed">
	                We&apos;ll get back to you within 24 hours. Keep an eye on your inbox.
	              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false)
                  setFormState({ name: '', email: '', message: '' })
                }}
                className="mt-4 text-[10px] tracking-[0.2em] uppercase text-neutral-400 hover:text-neutral-900 transition-colors duration-300 underline underline-offset-4"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-400">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={formState.name}
                    onChange={(e) => setFormState((p) => ({ ...p, name: e.target.value }))}
                    className="bg-neutral-50 border border-neutral-200 px-4 py-3.5 text-sm text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-900 transition-colors duration-200"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-400">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={formState.email}
                    onChange={(e) => setFormState((p) => ({ ...p, email: e.target.value }))}
                    className="bg-neutral-50 border border-neutral-200 px-4 py-3.5 text-sm text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-900 transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-400">
                  Message
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Tell us what's on your mind…"
                  value={formState.message}
                  onChange={(e) => setFormState((p) => ({ ...p, message: e.target.value }))}
                  className="bg-neutral-50 border border-neutral-200 px-4 py-3.5 text-sm text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-900 transition-colors duration-200 resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="group flex items-center justify-center gap-3 bg-neutral-900 text-white text-[11px] tracking-[0.22em] uppercase px-8 py-4 hover:bg-neutral-700 active:bg-neutral-800 transition-colors duration-300 w-full"
              >
                Send Message
                <Send
                  className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                  strokeWidth={1.5}
                />
              </button>
            </form>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
