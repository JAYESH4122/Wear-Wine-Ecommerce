import { CartPage } from '@/app/components/cart'
import type { Metadata } from 'next'
import { cartPageMetadata } from '@/data/site'

export const metadata: Metadata = cartPageMetadata

export default function Page() {
  return <CartPage />
}
