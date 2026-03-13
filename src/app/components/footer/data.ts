import type { FooterType } from './index'

export const footerData: FooterType = {
  logo: {
    image: {
      url: '/logo.svg',
      alt: 'Wear Wine',
      width: 120,
      height: 36,
    },
    tagline: 'Premium Fashion & Lifestyle',
    description:
      'Discover curated collections of premium wine and fashion products, crafted for those who appreciate the finer things in life.',
  },
  policies: {
    title: 'Policies',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'Return Policy', href: '/return-policy' },
      { label: 'Shipping Info', href: '/shipping-info' },
      { label: 'Cookie Policy', href: '/cookie-policy' },
    ],
  },
  socials: [
    { name: 'Facebook', href: 'https://facebook.com' },
    { name: 'Instagram', href: 'https://instagram.com' },
    { name: 'Twitter', href: 'https://twitter.com' },
    { name: 'YouTube', href: 'https://youtube.com' },
  ],
  contact: {
    title: 'Contact',
    email: 'hello@wearwine.com',
    phone: '+1 (800) 123 4567',
    hours: ['Mon – Fri: 9am – 6pm EST', 'Sat: 10am – 4pm EST'],
  },
  copyright: {
    year: '2024',
    brand: 'Wear Wine',
  },
}
