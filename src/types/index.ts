export interface Category {
  id: string
  name: string
  slug: string
}

export interface ProductImage {
  url: string
  alt?: string
}

export interface ProductVariant {
  color: Color
  size: Size
  sku: string
  stock: number
}

export interface Color {
  id: string
  name: string
  hex?: string
}

export interface Size {
  id: string
  label: string
  value: string
}

export interface Product {
  id: string
  name: string
  title?: string // Alignment with some components using 'title'
  price: number
  salePrice?: number
  description: string
  category: Category
  images: ProductImage[]
  variants?: ProductVariant[]
  slug: string
  tags?: { name: string }[]
}

export interface HeroSlide {
  id: string
  url: string
  alt: string
}

export type CategoryNavItem = {
  name: string
  href: string
  count: number
}

export interface CarouselCard {
  src: string
  title: string
  description: string
}

export interface User {
  id: string
  email: string
  name?: string
  isVerified?: boolean
}

export type AuthProvider = 'google'

export type AuthLoginInput =
  | {
      type: 'credentials'
      email: string
      password: string
    }
  | {
      type: 'provider'
      provider: AuthProvider
    }

export type AuthSignupInput = {
  email: string
  password: string
  name: string
}
