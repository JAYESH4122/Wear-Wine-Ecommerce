'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, ShoppingBag, User, Heart, LogOut, Package } from 'lucide-react'
import { clsx } from 'clsx'
import { toast } from 'sonner'
import { IconBlack, WearWine } from 'assets'
import { useAuth } from '@/providers/auth'
import { useCart } from '@/providers/cart'
import { useWishlist } from '@/providers/wishlist'
import { Button } from '@/components/ui/button/Button'
import { getApiUrl } from '@/lib/api/getApiUrl'
import { AuthModal } from './AuthModal'

import type { Header as HeaderCMS, Media, Page, Product, SiteSetting } from '@/payload-types'

interface HeaderProps {
  cmsData?: HeaderCMS | null
  siteSettings?: SiteSetting | null
}

const AnimatedMenuIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.path
      animate={isOpen ? { d: 'M 5 5 L 19 19' } : { d: 'M 4 7 L 20 7' }}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      transition={{ duration: 0.3 }}
    />
    <motion.path
      d="M 4 12 L 20 12"
      animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      transition={{ duration: 0.2 }}
    />
    <motion.path
      animate={isOpen ? { d: 'M 5 19 L 19 5' } : { d: 'M 4 17 L 20 17' }}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      transition={{ duration: 0.3 }}
    />
  </svg>
)

export const Header = ({ cmsData, siteSettings }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const { cartCount, isHydrated: isCartHydrated } = useCart()
  const { wishlistCount, isHydrated: isWishlistHydrated } = useWishlist()
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus()
  }, [isSearchOpen])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([])
      return
    }
    const fetchResults = async () => {
      setIsSearching(true)
      try {
        const params = new URLSearchParams({ limit: '5', depth: '1' })
        params.set('where[or][0][name][contains]', debouncedQuery)
        params.set('where[or][1][description][contains]', debouncedQuery)
        const res = await fetch(`${getApiUrl()}/api/products?${params.toString()}`, {
          credentials: 'include',
        })
        if (res.ok) {
          const data = (await res.json()) as { docs?: Product[] }
          setSearchResults(data.docs ?? [])
        }
      } catch (err) {
        console.error('Error searching products:', err)
      } finally {
        setIsSearching(false)
      }
    }
    fetchResults()
  }, [debouncedQuery])

  const handleLogout = async (onComplete?: () => void) => {
    try {
      await logout()
      toast.success('Signed out successfully.')
    } catch {
      toast.error('Unable to sign out. Please try again.')
    } finally {
      onComplete?.()
    }
  }

  const closeMenu = () => setIsMenuOpen(false)

  const brandName = siteSettings?.siteName || 'Wear Wine'

  const navItems =
    cmsData?.navItems
      ?.map((item) => {
        if (!item?.label) return null
        
        const type = (item as any).type || 'page'
        if (type === 'section' && (item as any).section) {
          return { name: item.label, href: `/#${(item as any).section}`, isSection: true }
        }

        const href =
          item.link && typeof item.link === 'object' ? `/${(item.link as Page).slug}` : '/'
        return { name: item.label, href, isSection: false }
      })
      .filter((item): item is { name: string; href: string; isSection: boolean } => Boolean(item)) ?? []

  const trackOrderHref = user?.email ? `/track-order?email=${encodeURIComponent(user.email)}` : '/track-order'

  const navItemsWithTracking = navItems.some(
    (item) => item.href === '/track-order' || item.href.startsWith('/track-order?'),
  )
    ? navItems
    : [...navItems, { name: 'Track Order', href: trackOrderHref, isSection: false }]

  return (
    <>
      {/* Floating hamburger */}
      <div
        className={clsx(
          'fixed lg:hidden transition-all duration-500 z-[70]',
          isScrolled ? 'top-3 left-2' : 'top-5 left-2',
        )}
      >
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          variant="icon"
          size="icon"
          leftIcon={<AnimatedMenuIcon isOpen={isMenuOpen} />}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="h-10 w-10 bg-transparent text-text"
        />
      </div>

      <header
        className={clsx(
          'sticky top-0 z-40 transition-all duration-500',
          isScrolled
            ? 'backdrop-blur-xl shadow-sm border-b border-secondary/10 py-1'
            : 'bg-background py-3',
        )}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 lg:h-16">
            <div className="w-10 lg:hidden" aria-hidden="true" />

            <Link
              href="/"
              className="flex items-center absolute ms-10 lg:relative gap-2"
              aria-label={`${brandName} Home`}
            >
              <motion.div
                className="relative inline-block overflow-hidden"
                whileHover="hover"
                initial="initial"
              >
                <div className="relative z-10 flex items-center gap-2">
                  <Image
                    src={IconBlack}
                    alt={`${brandName} icon`}
                    width={30}
                    height={30}
                    className="w-4 h-4 lg:w-8 lg:h-6"
                  />
                  <Image
                    src={WearWine}
                    alt={brandName}
                    width={100}
                    height={50}
                    className="h-4 lg:h-5 w-full"
                  />
                </div>
                <motion.div
                  variants={{
                    initial: { x: '-120%', y: '-120%' },
                    hover: { x: '120%', y: '120%' },
                  }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  className="pointer-events-none absolute inset-0 z-20"
                >
                  <div className="w-2/3 h-full bg-gradient-to-br from-transparent via-white to-transparent opacity-100 blur-[2px]" />
                </motion.div>
              </motion.div>
            </Link>

            {/* Desktop nav */}
	            <nav className="hidden lg:flex items-center gap-2">
	              {navItemsWithTracking.map((item) => {
	                const isActive = item.isSection ? false : pathname === item.href
	                return (
	                  <Link
	                    key={item.name}
	                    href={item.href}
                    onClick={(e) => {
                      if (item.isSection && pathname === '/') {
                        e.preventDefault()
                        document.getElementById(item.href.split('#')[1])?.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className={clsx(
                      'px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 relative group',
                      isActive ? 'text-primary' : 'text-secondary hover:text-text',
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.name}
                    <span
                      className={clsx(
                        'absolute bottom-1 left-4 right-4 h-px bg-primary transition-transform duration-300 origin-left',
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                      )}
                    />
                  </Link>
                )
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                onClick={() => setIsSearchOpen((prev) => !prev)}
                variant="icon"
                size="icon"
                leftIcon={<Search className="w-5 h-5" />}
                aria-label={isSearchOpen ? 'Close search' : 'Open search'}
                aria-expanded={isSearchOpen}
                className="h-9 w-9 bg-transparent text-secondary hover:text-text cursor-pointer"
              />

              <Link
                href="/wishlist"
                className="hidden sm:flex p-2 text-secondary hover:text-text transition-colors relative cursor-pointer"
                aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ''}`}
              >
                <Heart className="w-5 h-5" />
                {isWishlistHydrated && wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] bg-icon-red text-[10px] font-bold text-white rounded-full px-1 shadow-sm border-2 border-background">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <div className="relative">
                <Button
                  onClick={() => {
                    if (user) {
                      setIsAccountDropdownOpen(!isAccountDropdownOpen)
                    } else {
                      setIsAuthModalOpen(true)
                    }
                  }}
                  variant="icon"
                  size="icon"
                  leftIcon={<User className="w-5 h-5" />}
                  aria-label="Account"
                  className="hidden md:flex h-9 w-9 bg-transparent text-secondary hover:text-text cursor-pointer"
                />

                {user && isAccountDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[-1]"
                      onClick={() => setIsAccountDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-secondary/10 overflow-hidden py-2">
                      <div className="px-4 py-3 border-b border-secondary/5 mb-2">
                        <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-0.5">
                          Signed in as
                        </p>
                        <p className="text-sm font-bold text-text truncate">
                          {user.name || user.email}
                        </p>
                      </div>

                      <Link
                        href="/account"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:text-text hover:bg-secondary/5 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>

                      <Link
                        href="/account/orders"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:text-text hover:bg-secondary/5 transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        My Orders
                      </Link>

                      <div className="h-px bg-secondary/5 my-2" />

                      <Button
                        onClick={() => {
                          void handleLogout(() => setIsAccountDropdownOpen(false))
                        }}
                        variant="text"
                        size="sm"
                        leftIcon={<LogOut className="w-4 h-4" />}
                        className="w-full justify-start px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </>
                )}
              </div>

              <Link
                href="/cart"
                className="p-2 text-secondary hover:text-text transition-colors relative"
                aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
              >
                <ShoppingBag className="w-5 h-5 cursor-pointer" />
                {isCartHydrated && cartCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-4 h-4 bg-icon-red text-white text-[10px] font-bold flex items-center justify-center rounded-full px-1">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Search bar */}
          <div
            className={clsx(
              'transition-all duration-300 relative',
              isSearchOpen
                ? 'max-h-[500px] pb-4 opacity-100 z-50 overflow-visible'
                : 'max-h-0 opacity-0 -z-10 overflow-hidden pointer-events-none',
            )}
          >
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative max-w-xl mx-auto flex flex-col"
            >
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-white border text-text border-neutral-200 px-5 py-3 pr-12 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors"
                />
                <Button
                  type="submit"
                  variant="icon"
                  size="icon"
                  leftIcon={<Search className="w-4 h-4" />}
                  aria-label="Search"
                  className="absolute right-0 top-0 h-full w-12 rounded-none bg-transparent text-neutral-500 hover:text-neutral-900"
                />
              </div>

              {searchQuery.trim() && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 right-0 bg-white border border-neutral-200 shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-[100] max-h-[60vh] overflow-y-auto"
                >
                  {isSearching ? (
                    <div className="py-10 flex flex-col items-center justify-center">
                      <div className="w-4 h-4 border border-neutral-200 border-t-black animate-spin mb-2" />
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                        Searching...
                      </span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="flex flex-col">
                      <div className="px-4 py-2 bg-neutral-50 border-b border-neutral-100 flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-400">
                          Results
                        </span>
                        <span className="text-[9px] font-medium text-neutral-500 uppercase tracking-widest">
                          {searchResults.length} Products Found
                        </span>
                      </div>

                      <div className="divide-y divide-neutral-50">
                        {searchResults.map((product) => {
                          const firstImage = product.images?.[0]?.image
                          const imageUrl =
                            firstImage && typeof firstImage === 'object'
                              ? ((firstImage as Media).url ?? null)
                              : null
                          const categoryName =
                            product.category && typeof product.category === 'object'
                              ? product.category.name
                              : null

                          return (
                            <Link
                              key={product.id}
                              href={`/product/${product.slug}`}
                              onClick={() => {
                                setIsSearchOpen(false)
                                setSearchQuery('')
                                setDebouncedQuery('')
                                setSearchResults([])
                              }}
                              className="flex items-center gap-4 px-4 py-2.5 hover:bg-neutral-50 transition-colors group"
                            >
                              <div className="relative w-10 h-14 bg-neutral-100 flex-shrink-0 overflow-hidden border border-neutral-100">
                                {imageUrl ? (
                                  <Image
                                    src={imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ShoppingBag className="w-3 h-3 text-neutral-300" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                  <h4 className="text-[12px] font-medium text-black truncate tracking-tight group-hover:text-neutral-500 transition-colors uppercase">
                                    {product.name}
                                  </h4>
                                  {categoryName && (
                                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-neutral-400 mt-0.5">
                                      {categoryName}
                                    </p>
                                  )}
                                </div>

                                <div className="flex flex-col items-end shrink-0">
                                  {product.salePrice ? (
                                    <div className="flex flex-col items-end">
                                      <span className="text-[11px] font-bold text-black">
                                        ₹{product.salePrice}
                                      </span>
                                      <span className="text-[9px] font-medium text-neutral-400 line-through decoration-neutral-300">
                                        ₹{product.price}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-[11px] font-bold text-black">
                                      ₹{product.price}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                      </div>

                      <div className="border-t border-neutral-100 px-4 py-3 bg-white">
                        <Button
                          variant="text"
                          size="sm"
                          className="w-full text-[9px] font-black uppercase tracking-[0.3em] text-black hover:opacity-50"
                        >
                          View all collections
                        </Button>
                      </div>
                    </div>
                  ) : debouncedQuery ? (
                    <div className="py-16 flex flex-col items-center justify-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black">
                        No Matches Found
                      </p>
                      <p className="text-[9px] text-neutral-400 mt-2 uppercase tracking-widest">
                        Try a different keyword
                      </p>
                    </div>
                  ) : null}
                </div>
              )}
            </form>
          </div>
        </div>
      </header>

      {/* Mobile backdrop */}
      <div
        className={clsx(
          'fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] lg:hidden transition-opacity duration-300',
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={clsx(
          'fixed top-0 left-0 bottom-0 z-[60] w-[85vw] max-w-xs bg-background lg:hidden flex flex-col',
          'transition-transform duration-300 ease-out',
          isMenuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex-1 overflow-y-auto overscroll-contain">
	          <nav className="px-3 py-4 pt-16">
	            {navItemsWithTracking.map((item) => {
	              const isActive = item.isSection ? false : pathname === item.href
	              return (
	                <Link
	                  key={item.name}
	                  href={item.href}
                  onClick={(e) => {
                    if (item.isSection && pathname === '/') {
                      e.preventDefault()
                      document.getElementById(item.href.split('#')[1])?.scrollIntoView({ behavior: 'smooth' })
                    }
                    closeMenu()
                  }}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-colors',
                    isActive ? 'text-primary' : 'text-text hover:bg-secondary/5',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="mx-5 border-t border-secondary/10" />

          <div className="px-3 py-4 space-y-1">
            <p className="px-3 py-1 text-[10px] font-bold text-secondary/50 uppercase tracking-widest">
              Account
            </p>
            {user ? (
              <>
                <Link
                  href="/account"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-text hover:bg-secondary/5 transition-colors"
                >
                  <User className="w-4 h-4 text-secondary" />
                  My Account
                </Link>
                <Button
                  onClick={() => {
                    void handleLogout(closeMenu)
                  }}
                  variant="text"
                  size="sm"
                  leftIcon={<LogOut className="w-4 h-4" />}
                  className="w-full justify-start gap-3 px-3 py-3 rounded-xl text-sm text-rose-500 hover:bg-rose-50"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  setIsAuthModalOpen(true)
                  closeMenu()
                }}
                variant="text"
                size="sm"
                leftIcon={<User className="w-4 h-4 text-secondary" />}
                className="w-full justify-start gap-3 px-3 py-3 rounded-xl text-sm text-text hover:bg-secondary/5"
              >
                Sign In
              </Button>
            )}
            <Link
              href="/wishlist"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-text hover:bg-secondary/5 transition-colors"
            >
              <Heart className="w-4 h-4 text-secondary" />
              Wishlist
              {isWishlistHydrated && wishlistCount > 0 && (
                <span className="ml-auto text-xs bg-icon-red text-white font-semibold px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-text hover:bg-secondary/5 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-secondary" />
              Cart
              {isCartHydrated && cartCount > 0 && (
                <span className="ml-auto text-xs bg-icon-red text-white font-semibold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}
