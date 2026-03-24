import { LogoWhite } from '../../../../assets'

export interface FooterType {
  logo: {
    url: string
    alt: string
    tagline: string
    description: string
  }
  policies: {
    title: string
    links: { label: string; href: string }[]
  }
  socials: { name: string; href: string }[]
  contact: {
    title: string
    email: string
    phone: string
    hours: string[]
  }
  copyright: {
    year: string
    brand: string
    text: string
  }
}

export const footerData: FooterType = {
  logo: {
    url: LogoWhite.src,
    alt: 'Wear Wine Logo',
    tagline: 'Elegance & Comfort',
    description:
      'We blend classic styles with modern luxury to give you the perfect wardrobe for every occasion.',
  },
  policies: {
    title: 'Policies',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Shipping & Returns', href: '/shipping' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  socials: [
    { name: 'Facebook', href: 'https://facebook.com' },
    { name: 'Instagram', href: 'https://instagram.com' },
    { name: 'WhatsApp', href: 'https://wa.me/15551234567' },
  ],
  contact: {
    title: 'Contact Us',
    email: 'hello@wearwine.com',
    phone: '+1 (555) 123-4567',
    hours: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat - Sun: Closed'],
  },
  copyright: {
    year: new Date().getFullYear().toString(),
    brand: 'Wear Wine',
    text: 'All rights reserved.',
  },
}
