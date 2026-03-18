'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react'
import { useWishlist } from '@/providers/wishlist'
import { ProductCard } from '@/app/components/product-card'
import type { WishlistItem } from '@/providers/wishlist'

const getWishlistImageURL = (product: WishlistItem): string => {
  const image = product.images?.[0]?.image
  if (!image) return '/logo.svg'
  if (typeof image === 'string') return image || '/logo.svg'
  if (typeof image === 'number') return '/logo.svg'
  if (typeof image === 'object') return image.url ?? '/logo.svg'
  return '/logo.svg'
}

export default function WishlistPage() {
  const { wishlist, wishlistCount, clearWishlist } = useWishlist()

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 pt-24 sm:pt-32">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-neutral-500 mb-4 hover:text-neutral-900 transition-colors w-fit">
              <Link href="/" className="flex items-center gap-1.5 text-sm font-medium">
                <ArrowLeft className="w-4 h-4" />
                Back to Shopping
              </Link>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight">
              My Wishlist
              {wishlistCount > 0 && (
                <span className="ml-4 text-2xl sm:text-3xl text-neutral-400 font-medium">
                  ({wishlistCount})
                </span>
              )}
            </h1>
          </div>

          {wishlistCount > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your wishlist?')) {
                  clearWishlist()
                }
              }}
              className="flex items-center gap-2 group text-neutral-500 hover:text-rose-600 transition-colors py-2 px-1"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm font-medium">Clear Wishlist</span>
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {wishlistCount === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-3xl border border-neutral-100 shadow-sm text-center"
            >
              <div className="w-20 h-20 rounded-full bg-neutral-50 flex items-center justify-center mb-6">
                <Heart className="w-10 h-10 text-neutral-300" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-3">Your wishlist is empty</h2>
              <p className="text-neutral-500 max-w-sm mb-10 leading-relaxed">
                Items added to your wishlist will be saved here even after you leave our store.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-neutral-800 transition-all active:scale-95 shadow-lg shadow-neutral-200"
              >
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
            >
              {wishlist.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative group"
                >
                  <ProductCard
                    product={product}
                    id={String(product.id)}
                    title={product.name}
                    price={product.price}
                    image={getWishlistImageURL(product)}
                    slug={product.slug}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Section */}
        <div className="mt-20 py-12 border-t border-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-neutral-100 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-neutral-900" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">Save for Later</h3>
              <p className="text-sm text-neutral-500">
                Pick up where you left off. Your wishlist is saved locally.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-neutral-100 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-neutral-900" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">Easy Checkout</h3>
              <p className="text-sm text-neutral-500">
                Move items to your bag with a single click when you&apos;re ready.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-neutral-100 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center mb-4">
                <ArrowLeft className="w-6 h-6 text-neutral-900" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">Keep Browsing</h3>
              <p className="text-sm text-neutral-500">
                Easily find your way back to our collection and continue exploring.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
