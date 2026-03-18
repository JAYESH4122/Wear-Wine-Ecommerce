import { CartPage } from '@/app/components/cart'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Cart | Wear Wine',
  description: 'View and manage items in your shopping cart.',
}

export default function Page() {
  return <CartPage />
}
