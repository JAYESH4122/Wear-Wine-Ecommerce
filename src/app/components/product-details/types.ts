import type { Product, Media, Color, Size } from '@/payload-types'

export interface ProductDetailsProps {
  product: Product
  relatedProducts?: Product[]
}

export interface NormalizedColor {
  id: string
  name: string | null
  hex: string
}

export interface NormalizedSize {
  id: string
  label: string | null
}

export type { Product, Media, Color, Size }