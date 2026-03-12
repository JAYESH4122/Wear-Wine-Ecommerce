import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, Clock } from 'lucide-react'
import { Plasma } from '../react-bits/plasma'

export interface ImageType {
  url: string
  alt: string
  width: number
  height: number
}

export interface FooterLogoType {
  image: ImageType
  tagline: string
  description: string
}

export interface FooterNavType {
  title: string
  links: {
    label: string
    href: string
  }[]
}

export interface FooterSocialType {
  name: string
  href: string
}

export interface FooterContactType {
  title: string
  email: string
  phone: string
  hours: string[]
}

export interface FooterCopyrightType {
  year: string
  brand: string
}

export interface FooterType {
  logo: FooterLogoType
  policies: FooterNavType
  socials: FooterSocialType[]
  contact: FooterContactType
  copyright: FooterCopyrightType
}

const socialIconMap: Record<string, React.ReactNode> = {
  Facebook: <Facebook size={16} />,
  Twitter: <Twitter size={16} />,
  Instagram: <Instagram size={16} />,
  YouTube: <Youtube size={16} />,
}

type LogoSectionProps = {
  logo: FooterLogoType
  socials: FooterSocialType[]
}

type PolicySectionProps = {
  policies: FooterNavType
}

type ContactSectionProps = {
  contact: FooterContactType
}

const LogoSection: React.FC<LogoSectionProps> = ({ logo, socials }) => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <Image
          src={logo.image.url}
          alt={logo.image.alt}
          width={logo.image.width}
          height={logo.image.height}
          className="h-9 w-auto object-contain"
        />
        <p className="mt-3 text-[10.5px] tracking-[0.18em] uppercase text-white/20">
          {logo.tagline}
        </p>
      </div>

      <div className="w-10 h-px bg-white/20" />

      <p className="text-[12.5px] text-white/40 leading-[1.85] max-w-[260px]">{logo.description}</p>

      <div className="flex items-center gap-2 mt-1">
        {socials.map((social: FooterSocialType) => (
          <a
            key={social.name}
            href={social.href}
            aria-label={social.name}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/30 transition-all duration-300 hover:border-white hover:text-white hover:bg-white/5"
          >
            {socialIconMap[social.name]}
          </a>
        ))}
      </div>
    </div>
  )
}

const PolicySection = ({ policies }: PolicySectionProps) => {
  return (
    <div className="flex flex-col gap-6">
      <span className="font-primary text-[10px] font-semibold tracking-[0.24em] uppercase text-white">
        {policies.title}
      </span>
      <ul className="flex flex-col gap-[14px]">
        {policies.links.map((policy) => (
          <li key={policy.label}>
            <Link
              href={policy.href}
              className="text-[13px] text-white/40 inline-block transition-all duration-200 hover:text-white hover:translate-x-1.5"
            >
              {policy.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

const ContactSection: React.FC<ContactSectionProps> = ({ contact }) => {
  return (
    <div className="flex flex-col gap-6">
      <span className="font-primary text-[10px] font-semibold tracking-[0.24em] uppercase text-white">
        {contact.title}
      </span>
      <ul className="flex flex-col gap-5">
        <li className="flex items-start gap-3">
          <Mail size={14} className="text-white/50 mt-0.5 shrink-0" />
          <a
            href={`mailto:${contact.email}`}
            className="text-[13px] text-white/40 hover:text-white transition-colors duration-200 leading-relaxed"
          >
            {contact.email}
          </a>
        </li>
        <li className="flex items-start gap-3">
          <Phone size={14} className="text-white/50 mt-0.5 shrink-0" />
          <a
            href={`tel:${contact.phone.replace(/\s/g, '')}`}
            className="text-[13px] text-white/40 hover:text-white transition-colors duration-200 leading-relaxed"
          >
            {contact.phone}
          </a>
        </li>
        <li className="flex items-start gap-3">
          <Clock size={14} className="text-white/50 mt-0.5 shrink-0" />
          <div className="text-[13px] text-white/40 leading-[1.8]">
            {contact.hours.map((h: string) => (
              <span key={h} className="block">
                {h}
              </span>
            ))}
          </div>
        </li>
      </ul>
    </div>
  )
}
export const Footer = ({ logo, policies, socials, contact, copyright }: FooterType) => {
  return (
    <div className="relative w-full bg-black text-white overflow-hidden font-primary">
      <div className="absolute inset-0 z-0 w-screen">
        <Plasma
          color="#2c3763"
          speed={0.6}
          direction="pingpong"
          scale={5}
          opacity={0.8}
          mouseInteractive={true}
        />
      </div>

      <footer className="relative z-10">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 pb-14 border-b border-white/5">
            <LogoSection logo={logo} socials={socials} />
            <PolicySection policies={policies} />
            <ContactSection contact={contact} />
          </div>

          <div className="flex items-center pt-6">
            <p className="text-[11.5px] text-white/20 tracking-wide">
              © {copyright.year}, <span className="text-white/30">{copyright.brand}</span>. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
