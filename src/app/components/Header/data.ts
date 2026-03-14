import { Store, ShoppingBag, Sparkles, User, Clock, LucideIcon } from 'lucide-react'

export type HeaderType = {
  navItems?: {
    link: {
      type?: 'reference' | 'custom' | null
      newTab?: boolean | null
      reference?: {
        relationTo: 'pages'
        value: string | number
      } | null
      url?: string | null
      label: string
    }
  }[]
}

export const headerData: HeaderType = {
  navItems: [
    {
      link: {
        type: 'custom',
        url: '/shop',
        label: 'Shop',
      },
    },
    {
      link: {
        type: 'custom',
        url: '/categories',
        label: 'Categories',
      },
    },
    {
      link: {
        type: 'custom',
        url: '/about',
        label: 'About',
      },
    },
    {
      link: {
        type: 'custom',
        url: '/contact',
        label: 'Contact',
      },
    },
  ],
}

export type NavigationItem = {
  name: string
  href: string
  icon: LucideIcon
}

export const navigation: NavigationItem[] = [
  { name: 'Home', href: '/', icon: Store },
  { name: 'Shop', href: '/shop', icon: ShoppingBag },
  { name: 'New', href: '/new-arrivals', icon: Sparkles },
  { name: 'About', href: '/about', icon: User },
  { name: 'Contact', href: '/contact', icon: Clock },
]

export type CategoryItem = {
  name: string
  href: string
  count: number
}

