'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, Clock } from 'lucide-react'
import { Plasma } from '../react-bits/plasma'
import { footerData } from '@/data/footer'

const socialIconMap: Record<string, React.ReactNode> = {
  Facebook: <Facebook size={16} />,
  Twitter: <Twitter size={16} />,
  Instagram: <Instagram size={16} />,
  YouTube: <Youtube size={16} />,
}

export const Footer = () => {
  const { logo, policies, socials, contact, copyright } = footerData

  return (
    <div className="relative w-full bg-primary text-background overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Plasma
          color="rgba(82, 87, 91, 0.2)"
          speed={0.6}
          direction="pingpong"
          scale={5}
          opacity={0.8}
          mouseInteractive={true}
        />
      </div>

      <footer className="relative z-10">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 pb-14 border-b border-background/10">
            {/* Logo Section */}
            <div className="flex flex-col gap-5">
              <Image
                src={logo.url}
                alt={logo.alt}
                width={120}
                height={40}
                className="h-9 w-30 object-contain"
                unoptimized
              />
              <p className="text-[10px] tracking-[0.2em] uppercase text-background/50 m-0!">
                {logo.tagline}
              </p>
              <p className="text-sm text-background/40 leading-relaxed max-w-xs m-0!">
                {logo.description}
              </p>
              <div className="flex gap-2">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    className="w-9 h-9 rounded-full border border-background/20 flex items-center justify-center text-background/50 hover:border-background hover:text-background transition-all"
                  >
                    {socialIconMap[s.name]}
                  </a>
                ))}
              </div>
            </div>

            {/* Links Section */}
            <div className="flex flex-col gap-6">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
                {policies.title}
              </span>
              <ul className="flex flex-col gap-3">
                {policies.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-background/60 hover:text-background transition-all"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Section */}
            <div className="flex flex-col gap-6">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
                {contact.title}
              </span>
              <div className="flex flex-col gap-4 text-sm text-background/60">
                <div className="flex items-center gap-3">
                  <Mail size={14} />
                  <span>{contact.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={14} />
                  <span>{contact.phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={14} />
                  <div className="space-y-1">
                    {contact.hours.map((h) => (
                      <span key={h} className="block">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 text-[11px] text-background/40 tracking-wider">
            © {copyright.year}, <span className="text-background/70">{copyright.brand}</span>.{' '}
            {copyright.text}
          </div>
        </div>
      </footer>
    </div>
  )
}
