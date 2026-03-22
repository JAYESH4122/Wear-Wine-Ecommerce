'use client'

import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { clsx } from 'clsx'
import { Heart, ShoppingBag, Star, Eye, Check, Truck, HeartIcon, HeartOff } from 'lucide-react'

import { useWishlist } from '@/providers/wishlist'
import { useCart } from '@/providers/cart'
import type { CartProduct } from '@/providers/cart'
import type { WishlistItem } from '@/providers/wishlist'

type ProductCardProps = {
  id: string
  title: string
  price: number
  image: StaticImageData | string
  hoverImage?: StaticImageData | string
  badge?: string
  originalPrice?: number
  rating?: number
  reviews?: number
  slug?: string | null
  isNew?: boolean
  isInStock?: boolean
  product?: WishlistItem | CartProduct // Optional full product object (or minimal wishlist/cart-safe shape)
  onAddToCart?: (id: string) => void
  onFavorite?: (id: string) => void
  onQuickView?: (id: string) => void
}

export const ProductCard = ({
  id,
  title,
  price,
  image,
  hoverImage,
  badge,
  originalPrice,
  rating,
  reviews,
  slug,
  isInStock = true,
  product,
  onAddToCart,
  onFavorite,
  onQuickView,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { cart, addItem } = useCart()

  const stockPercentage = (Number(id.replace(/\D/g, '')) || 1) * 7
  const stockLeft = ((Number(id.replace(/\D/g, '')) || 1) % 21) + 10

  const isInCart = cart.some((item) => String(item.product.id) === String(id))
  const isFavorite = isInWishlist(id)
  const [isLoading, setIsLoading] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)

  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const productToWishlist: WishlistItem =
      product ??
      ({
        id,
        name: title,
        slug: slug ?? null,
        price,
        salePrice: originalPrice ?? null,
        images: [
          {
            image: typeof image === 'string' ? image : image.src,
          },
        ],
      } satisfies WishlistItem)

    toggleWishlist(productToWishlist)
    onFavorite?.(id)
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLoading(true)

    if (onAddToCart) {
      await onAddToCart(id)
    } else {
      const cartProduct: CartProduct = {
        id,
        name: title,
        slug: slug ?? null,
        price: originalPrice ?? price,
        salePrice: originalPrice ? price : null,
        images: [
          {
            image: typeof image === 'string' ? image : image.src,
          },
        ],
      }
      addItem(cartProduct, 1)
    }

    setIsLoading(false)
    setIsAddedToCart(true)

    setTimeout(() => setIsAddedToCart(false), 3000)
  }

  return (
    <div
      className="group relative bg-white rounded-none overflow-hidden transition-all duration-500 hover:shadow-sm hover:-translate-y-2 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${slug || id}`} className="block cursor-pointer">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={clsx(
              'object-cover transition-all duration-700 ease-out',
              hoverImage && isHovered ? 'opacity-0 scale-110' : 'opacity-100 scale-100',
            )}
            priority={false}
          />

          {hoverImage && (
            <Image
              src={hoverImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={clsx(
                'object-cover transition-all duration-700 ease-out',
                isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-100',
              )}
            />
          )}

          <div
            className={clsx(
              'absolute inset-0 bg-black/5 transition-opacity duration-500',
              isHovered ? 'opacity-100' : 'opacity-0',
            )}
          />

          <div className="absolute left-4 top-4 flex flex-col gap-2 z-10">
            {badge && (
              <span className="px-3 py-1.5 bg-white text-gray-900 text-xs font-semibold shadow-lg">
                {badge}
              </span>
            )}

            {discountPercentage > 0 && (
              <span className="px-3 py-1.5 bg-gray-800 text-white text-xs font-semibold shadow-lg">
                -{discountPercentage}% OFF
              </span>
            )}
          </div>

          {!isInStock && (
            <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20">
              <span className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-full shadow-lg">
                Out of Stock
              </span>
            </div>
          )}

          <div
            className={clsx(
              'absolute right-4 top-4 flex flex-col gap-2 transition-all duration-500 z-10',
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4',
            )}
          >
            <div className="relative group/btn">
              <button
                onClick={handleFavoriteClick}
                className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110',
                  isFavorite
                    ? 'bg-black text-white shadow-lg shadow-black/30'
                    : 'bg-white/90 text-gray-700 hover:bg-white hover:shadow-lg',
                )}
                aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={clsx('w-5 h-5 transition-all', isFavorite && 'fill-current')} />
              </button>
              <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {isFavorite ? 'Remove' : 'Wishlist'}
              </span>
            </div>

            {/* <div className="relative group/btn">
              <button
                onClick={handleQuickView}
                className="w-10 h-10 rounded-full bg-white/90 text-gray-700 flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110 hover:shadow-lg"
                aria-label="Quick view"
              >
                <Eye className="w-5 h-5" />
              </button>
              <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Quick view
              </span>
            </div> */}
          </div>

          <div
            className={clsx(
              'absolute bottom-4 left-4 right-4 transition-all duration-500 z-10',
              isAddedToCart || (isHovered && !isInCart)
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4 pointer-events-none',
            )}
          >
            <button
              onClick={handleAddToCart}
              disabled={!isInStock || isLoading || isAddedToCart}
              className={clsx(
                'w-full py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group/add',
                isInStock && !isAddedToCart && !isInCart
                  ? 'bg-black text-white hover:bg-gray-800 hover:shadow-xl hover:shadow-black/25'
                  : isAddedToCart || isInCart
                    ? 'bg-white text-black'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed',
                isLoading && 'opacity-75 cursor-wait',
              )}
            >
              <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/add:translate-x-full transition-transform duration-700" />

              {isAddedToCart || isInCart ? (
                <>
                  <Check className="w-4 h-4 animate-bounce" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingBag
                    className={clsx(
                      'w-4 h-4 transition-transform duration-300 group-hover/add:-translate-y-0.5 group-hover/add:translate-x-0.5',
                      isLoading && 'animate-spin',
                    )}
                  />
                  {isLoading ? 'Adding...' : 'Add'}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-3 space-y-2">
          <h3
            className={clsx(
              'text-base font-medium line-clamp-2 transition-all duration-300',
              isHovered ? 'text-black translate-x-0.5' : 'text-gray-900',
            )}
          >
            {title}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-gray-900">${price}</span>
              {originalPrice && (
                <span className="text-xs text-gray-400 line-through">${originalPrice}</span>
              )}
            </div>

            {rating && (
              <div
                className={clsx(
                  'flex items-center gap-0.5 transition-all duration-300',
                  isHovered && 'scale-105',
                )}
              >
                <Star
                  className={clsx(
                    'w-3.5 h-3.5 fill-yellow-400 text-yellow-400 transition-all duration-300',
                    isHovered && 'rotate-12',
                  )}
                />
                <span className="text-xs font-medium text-gray-600">{rating}</span>
                {reviews && <span className="text-xs text-gray-400">({reviews})</span>}
              </div>
            )}
          </div>

          <div className="min-h-[20px]">
            {isInStock ? (
              <>
                {!isHovered && (
                  <div className="flex items-center gap-1.5 group/stock">
                    <div className="flex-1 max-w-[60px]">
                      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-800 rounded-full transition-all duration-500 group-hover/stock:bg-green-500"
                          style={{ width: `${stockPercentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {stockLeft} left
                    </span>
                  </div>
                )}

                {isHovered && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 animate-fadeIn group/shipping">
                    <Truck
                      className={clsx(
                        'w-3.5 h-3.5 transition-all duration-300',
                        isHovered && 'translate-x-0.5 -translate-y-0.5',
                      )}
                    />
                    <span className="relative">
                      Free shipping
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-gray-600 group-hover/shipping:w-full transition-all duration-300" />
                    </span>
                  </div>
                )}
              </>
            ) : (
              <span className="text-xs text-red-500">Out of stock</span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5">
              <span className={clsx('relative flex h-2 w-2', isInStock && 'group/status')}>
                <span
                  className={clsx(
                    'absolute inline-flex h-full w-full rounded-full',
                    isInStock ? 'bg-green-500' : 'bg-red-500',
                  )}
                />
                {isInStock && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 animate-ping opacity-75 group-hover/status:animate-none" />
                )}
              </span>
              <span
                className={clsx(
                  'font-medium transition-colors duration-300',
                  isInStock ? (isHovered ? 'text-green-600' : 'text-gray-500') : 'text-red-500',
                )}
              >
                {isInStock ? 'In stock' : 'Sold out'}
              </span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}
