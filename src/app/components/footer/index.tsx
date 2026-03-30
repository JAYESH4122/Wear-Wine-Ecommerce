'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Mail, Phone, Clock } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa6'
import { footerData } from './data'

const socialIcons: Record<string, React.ReactNode> = {
  Facebook: <FaFacebookF size={14} />,
  Instagram: <FaInstagram size={14} />,
  WhatsApp: <FaWhatsapp size={16} />,
}
import type { Footer as FooterCMS, SiteSetting } from '@/payload-types'

interface FooterProps {
  cmsData?: FooterCMS | null
  siteSettings?: SiteSetting | null
}

export const Footer = ({ cmsData, siteSettings }: FooterProps) => {
  const { logo, policies, socials, contact, copyright: defaultCopyright } = footerData

  return (
    <div className="relative w-full overflow-hidden bg-primary text-background">
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-background/5 via-transparent to-secondary/10" />

      <footer className="relative z-10">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />

        <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 md:px-12">
          <div className="grid grid-cols-1 gap-12 border-b border-background/10 pb-14 md:grid-cols-3 md:gap-16">
            {/* Brand */}
            <div className="flex flex-col gap-5">
                <Image
                  src={logo.url}
                  alt={logo.alt}
                  width={160}
                  height={56}
                  className="h-14 w-24 object-contain"
                  unoptimized
                />     
              <p className="m-0 text-[0.625rem] uppercase tracking-[0.2em] text-background/50">
                {logo.tagline}
              </p>
              <p className="m-0 max-w-xs text-sm leading-relaxed text-background/40">
                {logo.description}
              </p>
              <nav className="flex gap-2" aria-label="Social media">
                {(siteSettings?.socialLinks?.length ? siteSettings.socialLinks.map((s: any) => ({
                  name: s.platform,
                  href: s.url,
                })) : socials).map((s) => {
                  const icon = socialIcons[s.name]
                  if (!icon) return null
                  return (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.name}
                      className="flex size-9 items-center justify-center rounded-full border border-background/20 text-background/50 transition-colors hover:border-background hover:text-background"
                    >
                      {icon}
                    </a>
                  )
                })}
              </nav>
            </div>

            {/* Links */}
            {(cmsData?.columns?.length ? cmsData.columns : [policies]).map((col: any) => (
              <div key={col.title} className="flex flex-col gap-6">
                <h3 className="text-[0.625rem] font-bold uppercase tracking-[0.2em]">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {(col.links || []).map((l: any) => {
                    const link = l.link || {}
                    const href = link.url || (typeof link.value === 'object' ? `/${link.value.slug}` : (link.value ? `/pages/${link.value}` : '#'))
                    return (
                      <li key={l.label}>
                        <Link
                          href={href}
                          className="text-sm text-background/60 transition-colors hover:text-background"
                        >
                          {l.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}

            {/* Contact */}
            <div className="flex flex-col gap-6">
              <h3 className="text-[0.625rem] font-bold uppercase tracking-[0.2em]">
                {contact.title}
              </h3>
              <address className="flex flex-col gap-4 text-sm not-italic text-background/60">
                <div className="flex items-center gap-3">
                  <Mail size={14} aria-hidden="true" />
                  <span>{contact.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={14} aria-hidden="true" />
                  <span>{contact.phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={14} className="mt-0.5" aria-hidden="true" />
                  <div className="space-y-1">
                    {contact.hours.map((h) => (
                      <span key={h} className="block">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </address>
            </div>
          </div>

          <p className="pt-8 text-[0.6875rem] tracking-wider text-background/40">
            {cmsData?.copyright ?? `© ${defaultCopyright.year}, ${defaultCopyright.brand}. ${defaultCopyright.text}`}
          </p>
        </div>
      </footer>
    </div>
  )
}
