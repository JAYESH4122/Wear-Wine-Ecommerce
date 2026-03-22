'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingBag, User, Menu, X, Heart, ChevronDown, ChevronRight } from 'lucide-react'
import { navigation, type CategoryItem } from './data'
import { useWishlist } from '@/providers/wishlist'
import { useCart } from '@/providers/cart'
import Image from 'next/image'
import { IconBlack, WearWine } from 'assets'
import { useAuth } from '@/providers/auth'
import { AuthModal } from './AuthModal'
import { LogOut, User as UserIcon, Settings, Package } from 'lucide-react'

interface HeaderProps {
  categories?: CategoryItem[]
}

export const Header = ({ categories = [] }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const [searchQuery, setSearchQuery] = useState('')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false)
  const [isLogoHovered, setIsLogoHovered] = useState(false)
  const [wordmarkVisible, setWordmarkVisible] = useState(true)
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current)
    }
  }, [])

  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  // Scroll handler with useCallback to avoid recreation
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
    setIsCategoriesOpen(false)
  }, [pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery)
    }
  }

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch search results
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([])
      return
    }

    const fetchResults = async () => {
      setIsSearching(true)
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(debouncedQuery)}&limit=5`)
        if (res.ok) {
          const data = await res.json()
          setSearchResults(data.docs || [])
        }
      } catch (err) {
        console.error('Error searching products:', err)
      } finally {
        setIsSearching(false)
      }
    }

    fetchResults()
  }, [debouncedQuery])

  const closeMenu = () => {
    setIsMenuOpen(false)
    setIsCategoriesOpen(false)
  }

  return (
    <>
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
            {/* Burger - mobile only */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-text"
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link
              href="/"
              className="flex items-center relative w-100"
              onMouseEnter={() => {
                if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current)
                if (!isLogoHovered) {
                  setIsLogoHovered(true)
                  setWordmarkVisible(false)
                }
              }}
              onMouseLeave={() => {
                leaveTimerRef.current = setTimeout(() => {
                  setIsLogoHovered(false)
                  setWordmarkVisible(true)
                }, 10)
              }}
            >
              <motion.div
                key={isLogoHovered ? 'hover' : 'rest'}
                className="flex-shrink-0 flex items-center justify-center"
                initial={isLogoHovered ? { scale: 0.08 } : false}
                animate={{ scale: 1 }}
                transition={
                  isLogoHovered ? { type: 'spring', stiffness: 1000, damping: 40 } : { duration: 0 }
                }
                onAnimationComplete={() => {
                  if (isLogoHovered) setWordmarkVisible(true)
                }}
              >
                <Image
                  src={IconBlack}
                  alt=""
                  width={50}
                  height={50}
                  className="object-contain"
                  priority
                />
              </motion.div>

              <AnimatePresence>
                {wordmarkVisible && (
                  <motion.div
                    key="wordmark"
                    className="overflow-hidden"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: 'spring', stiffness: 1500, damping: 40 }}
                  >
                    <Image
                      src={WearWine}
                      alt="Wear Wine"
                      width={100}
                      height={50}
                      className="w-auto object-contain"
                      priority
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
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
              <button
                onClick={() => setIsSearchOpen((prev) => !prev)}
                className="p-2 text-secondary hover:text-text transition-colors"
                aria-label={isSearchOpen ? 'Close search' : 'Open search'}
                aria-expanded={isSearchOpen}
              >
                <Search className="w-5 h-5 cursor-pointer" />
              </button>

              <Link
                href="/wishlist"
                className="hidden sm:flex p-2 text-secondary hover:text-text transition-colors relative group/wishlist"
                aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ''}`}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] bg-primary text-[10px] font-bold text-white rounded-full px-1 shadow-sm border-2 border-background">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <div className="relative">
                <button
                  onClick={() => {
                    if (user) {
                      setIsAccountDropdownOpen(!isAccountDropdownOpen)
                    } else {
                      setIsAuthModalOpen(true)
                    }
                  }}
                  className="hidden md:flex p-2 text-secondary hover:text-text transition-colors"
                  aria-label="Account"
                >
                  <User className="w-5 h-5 cursor-pointer" />
                </button>

                {/* Desktop Account Dropdown */}
                <AnimatePresence>
                  {user && isAccountDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-[-1]"
                        onClick={() => setIsAccountDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-secondary/10 overflow-hidden py-2"
                      >
                        <div className="px-4 py-3 border-b border-secondary/5 mb-2">
                          <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-0.5">
                            Signed in as
                          </p>
                          <p className="text-sm font-bold text-text truncate">
                            {(user as any).name || user.email}
                          </p>
                        </div>

                        <Link
                          href="/account"
                          onClick={() => setIsAccountDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:text-text hover:bg-secondary/5 transition-colors"
                        >
                          <UserIcon className="w-4 h-4" />
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

                        <button
                          onClick={() => {
                            logout()
                            setIsAccountDropdownOpen(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/cart"
                className="p-2 text-secondary hover:text-text transition-colors relative"
                aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-4 h-4 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full px-1">
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
            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto flex flex-col">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-white border text-text border-neutral-200 px-5 py-3 pr-12 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 text-neutral-500 hover:text-neutral-900 transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Dropdown for search results */}
              {searchQuery.trim() && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 right-0 bg-white border border-neutral-200 shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-[100] max-h-[60vh] overflow-y-auto rounded-none"
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
                      {/* Compact Header */}
                      <div className="px-4 py-2 bg-neutral-50 border-b border-neutral-100 flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-400">
                          Results
                        </span>
                        <span className="text-[9px] font-medium text-neutral-500 uppercase tracking-widest">
                          {searchResults.length} Products Found
                        </span>
                      </div>

                      <div className="divide-y divide-neutral-50">
                        {searchResults.map((product) => (
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
                            {/* Architectural Sharp Image */}
                            <div className="relative w-10 h-14 bg-neutral-100 flex-shrink-0 overflow-hidden rounded-none border border-neutral-100">
                              {product.images?.[0]?.image?.url ? (
                                <Image
                                  src={product.images[0].image.url}
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

                            {/* Minimalist Info Section */}
                            <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                              <div className="min-w-0">
                                <h4 className="text-[12px] font-medium text-black truncate tracking-tight group-hover:text-neutral-500 transition-colors uppercase">
                                  {product.name}
                                </h4>
                                {product.category?.name && (
                                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-neutral-400 mt-0.5">
                                    {product.category.name}
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
                        ))}
                      </div>

                      {/* Action Call to Action */}
                      <div className="border-t border-neutral-100 px-4 py-3 bg-white">
                        <button className="w-full text-[9px] font-black uppercase tracking-[0.3em] text-black hover:opacity-50 transition-opacity">
                          View all collections
                        </button>
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

      {/* Mobile drawer */}
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300',
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        id="mobile-menu"
        className={clsx(
          'fixed top-0 left-0 bottom-0 z-50 w-[85vw] max-w-xs bg-background lg:hidden',
          'flex flex-col',
          'transition-transform duration-300 ease-out',
          isMenuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!isMenuOpen}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-secondary/10">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 bg-primary rounded-full">
              <span className="text-white font-bold text-xs">W</span>
            </div>
            <span className="font-bold tracking-wider text-base uppercase text-text">
              Wear Wine
            </span>
          </Link>
          <button
            onClick={closeMenu}
            className="p-2 -mr-2 text-secondary hover:text-text transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Main nav links */}
          <nav className="px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMenu}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-colors',
                    isActive ? 'text-primary bg-primary/5' : 'text-text hover:bg-secondary/5',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {isActive && <span className="w-1 h-1 rounded-full bg-primary" />}
                  {item.name}
                </Link>
              )
            })}

            {/* Shop / Categories accordion */}
            <div>
              <button
                onClick={() => setIsCategoriesOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider text-text hover:bg-secondary/5 transition-colors"
                aria-expanded={isCategoriesOpen}
              >
                Shop
                <ChevronDown
                  className={clsx(
                    'w-4 h-4 text-secondary transition-transform duration-300',
                    isCategoriesOpen && 'rotate-180',
                  )}
                />
              </button>

              <div
                className={clsx(
                  'overflow-hidden transition-all duration-300',
                  isCategoriesOpen ? 'max-h-96' : 'max-h-0',
                )}
              >
                <div className="mx-3 mb-2 rounded-xl bg-secondary/5 overflow-hidden">
                  {categories.map((category, i) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      onClick={closeMenu}
                      className={clsx(
                        'flex items-center justify-between px-4 py-3 text-sm text-secondary hover:text-text hover:bg-secondary/5 transition-colors',
                        i !== categories.length - 1 && 'border-b border-secondary/10',
                      )}
                    >
                      <span>{category.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-secondary/60">{category.count}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-secondary/40" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Divider */}
          <div className="mx-5 border-t border-secondary/10" />

          {/* Account links */}
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
                <button
                  onClick={() => {
                    logout()
                    closeMenu()
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true)
                  closeMenu()
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-text hover:bg-secondary/5 transition-colors"
              >
                <User className="w-4 h-4 text-secondary" />
                Sign In / Join
              </button>
            )}
            <Link
              href="/wishlist"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-text hover:bg-secondary/5 transition-colors"
            >
              <Heart className="w-4 h-4 text-secondary" />
              Wishlist
              {wishlistCount > 0 && (
                <span className="ml-auto text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
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
              {cartCount > 0 && (
                <span className="ml-auto text-xs bg-accent/10 text-accent font-semibold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-secondary/10" />

          {/* Utility links */}
          <div className="px-3 py-4 space-y-1">
            {['Track Order', 'Help', 'Support'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(' ', '-')}`}
                onClick={closeMenu}
                className="flex items-center px-3 py-2.5 rounded-xl text-sm text-secondary hover:text-text hover:bg-secondary/5 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}
