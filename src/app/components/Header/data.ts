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
        url: '/',
        label: 'Home',
      },
    },
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
        url: '/new-arrivals',
        label: 'New',
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

export const navigation: NavigationItem[] =
  headerData.navItems?.map((item, index) => {
    const link = item.link

    const href =
      link.type === 'custom'
        ? link.url ?? '/'
        : link.reference
        ? `/${link.reference.value}`
        : '/'

    const icons: LucideIcon[] = [Store, ShoppingBag, Sparkles, User, Clock]

    return {
      name: link.label,
      href,
      icon: icons[index] ?? Store,
    }
  }) ?? []

export type CategoryItem = {
  name: string
  href: string
  count: number
}