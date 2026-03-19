'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, ArrowLeft, Trash2, ChevronRight, X } from 'lucide-react'
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
    <section className="relative min-h-screen py-20 bg-background overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between lg:mb-8 mb-4 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-secondary hover:text-text transition-colors mb-4 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase">Back to Store</span>
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <span className="w-12 h-px bg-primary" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-secondary">
                Saved Items
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text mb-4">
              My <span className="text-secondary/60 font-light italic">Wishlist</span>
            </h1>

            {wishlistCount > 0 && (
              <p className="text-secondary text-lg">
                {wishlistCount} {wishlistCount === 1 ? 'piece' : 'pieces'} in your collection
              </p>
            )}
          </motion.div>

          {wishlistCount > 0 && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                if (window.confirm('Remove all items from your wishlist?')) {
                  clearWishlist()
                }
              }}
              className="group flex items-center gap-2 text-sm font-semibold text-secondary hover:text-red-500 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Clear Wishlist
            </motion.button>
          )}
        </div>

        {/* Divider */}
        <div className="border-b border-neutral-200 mb-8 pb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-400 tracking-wider tabular-nums">
              <span className="text-neutral-700">{String(wishlistCount).padStart(2, '0')}</span>
              {' items'}
            </span>

            <Link
              href="/"
              className="group flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary transition-colors cursor-pointer"
            >
              Continue Shopping
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {wishlistCount === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="py-20 text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-100 mb-6">
                <Heart className="w-8 h-8 text-neutral-400" strokeWidth={1.5} />
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-text mb-3">
                Your wishlist is empty
              </h2>

              <p className="text-secondary max-w-md mx-auto mb-10">
                Start building your collection by saving pieces that inspire you.
              </p>

              <Link
                href="/"
                className="inline-flex items-center gap-3 bg-neutral-900 text-white px-8 py-4 font-semibold hover:bg-neutral-800 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                Explore Collection
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="items"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Products grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-20 pt-12 border-t border-neutral-200"
        >
          <div className="flex items-center gap-2 justify-center mb-10">
            <span className="w-12 h-px bg-neutral-300" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-secondary">
              Why Wishlist
            </span>
            <span className="w-12 h-px bg-neutral-300" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                title: 'Save Forever',
                description: 'Your selections persist across sessions.',
              },
              {
                icon: ShoppingBag,
                title: 'Quick Checkout',
                description: 'Add to bag instantly when ready.',
              },
              {
                icon: ChevronRight,
                title: 'Keep Exploring',
                description: 'Easily return to browsing anytime.',
              },
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="group p-8 bg-white border border-neutral-200 hover:border-neutral-400 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center mb-5 group-hover:bg-neutral-900 transition-colors duration-200">
                  <feature.icon
                    className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors duration-200"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="font-semibold text-text mb-2">{feature.title}</h3>
                <p className="text-sm text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
