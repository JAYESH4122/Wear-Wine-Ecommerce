import { WishlistPage } from '@/app/components/wishlist'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Wishlist | Wear Wine',
  description: 'View and manage your favorite items.',
}

export default function Page() {
  return <WishlistPage />
}
