'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'

const socialIcons: Record<string, React.ReactNode> = {
  Facebook: <FaFacebookF size={14} />,
  Instagram: <FaInstagram size={14} />,
  Twitter: <FaXTwitter size={14} />,
  LinkedIn: <FaLinkedinIn size={14} />,
}
import type { Footer as FooterCMS, Media, Page, SiteSetting } from '@/payload-types'

interface FooterProps {
  cmsData?: FooterCMS | null
  siteSettings?: SiteSetting | null
}

export const Footer = ({ cmsData, siteSettings }: FooterProps) => {
  const brandName = siteSettings?.siteName || 'Wear Wine'
  const logoUrl =
    siteSettings?.logo && typeof siteSettings.logo === 'object'
      ? (siteSettings.logo as Media).url ?? null
      : null
  const socialLinks =
    siteSettings?.socialLinks?.map((s) => ({ name: s.platform, href: s.url })) ?? []

  return (
    <div className="relative w-full overflow-hidden bg-primary text-background">
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-background/5 via-transparent to-secondary/10" />

      <footer className="relative z-10">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />

        <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 md:px-12">
          <div className="grid grid-cols-1 gap-12 border-b border-background/10 pb-14 md:grid-cols-3 md:gap-16">
            {/* Brand */}
            <div className="flex flex-col gap-5">
              {logoUrl && (
                <Image
                  src={logoUrl}
                  alt={brandName}
                  width={160}
                  height={56}
                  className="h-14 w-24 object-contain"
                  unoptimized
                />
              )}
              <nav className="flex gap-2" aria-label="Social media">
                {socialLinks.map((s) => {
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
            {(cmsData?.columns ?? []).map((col) => (
              <div key={col.title} className="flex flex-col gap-6">
                <h3 className="text-[0.625rem] font-bold uppercase tracking-[0.2em]">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {(col.links ?? []).map((l) => {
                    const href =
                      l.link && typeof l.link === 'object' ? `/${(l.link as Page).slug}` : '#'
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
          </div>

          <p className="pt-8 text-[0.6875rem] tracking-wider text-background/40">
            {cmsData?.copyright ?? `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`}
          </p>
        </div>
      </footer>
    </div>
  )
}
