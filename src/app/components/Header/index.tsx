'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { Search, ShoppingBag, User, Menu, X, Heart, ChevronDown, ChevronRight } from 'lucide-react'
import { navigation, type CategoryItem } from './data'
import { useWishlist } from '@/providers/wishlist'
import { useCart } from '@/providers/cart'

interface HeaderProps {
  categories?: CategoryItem[]
}

export const Header = ({ categories: initialCategories = [] }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()

  const categories = initialCategories

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

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
        {/* Top utility bar */}
        <div
          className={clsx(
            'hidden lg:block transition-all duration-300 overflow-hidden border-b border-secondary/5',
            isScrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100',
          )}
        >
          <div className="container mx-auto px-6 py-2">
            <div className="flex justify-end items-center text-xs uppercase tracking-wider font-medium text-secondary">
              <div className="flex items-center gap-6">
                {['Track Order', 'Help', 'Support'].map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="hover:text-text transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Burger - mobile only */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-text"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-8 h-8 bg-primary rounded-full transition-transform duration-500 group-hover:rotate-180">
                <span className="text-white font-bold text-sm tracking-tight">W</span>
              </div>
              <span className="font-bold text-lg lg:text-xl tracking-wider text-text uppercase">
                Wear Wine
              </span>
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

              {/* Shop dropdown */}
              <div className="relative group ml-2">
                <button className="flex items-center gap-1 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-secondary hover:text-text transition-colors">
                  Shop
                  <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className="bg-background shadow-2xl border border-secondary/10 p-6 min-w-72 rounded-2xl">
                    <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">
                      Collections
                    </h3>
                    <div className="grid gap-y-3">
                      {categories.map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          className="flex items-center justify-between group/item"
                        >
                          <span className="text-sm text-secondary group-hover/item:text-text transition-colors">
                            {category.name}
                          </span>
                          <span className="text-xs bg-secondary/5 px-2 py-0.5 rounded text-secondary">
                            {category.count}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-secondary hover:text-text transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="/wishlist"
                className="hidden sm:flex p-2 text-secondary hover:text-text transition-colors relative group/wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] bg-primary text-[10px] font-bold text-white rounded-full px-1 shadow-sm border-2 border-background">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/account"
                className="hidden md:flex p-2 text-secondary hover:text-text transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>

              <Link
                href="/cart"
                className="p-2 text-secondary hover:text-text transition-colors relative"
                aria-label="Cart"
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
              'overflow-hidden transition-all duration-500 ease-in-out',
              isSearchOpen ? 'max-h-24 pb-4 opacity-100' : 'max-h-0 opacity-0',
            )}
          >
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full bg-secondary/5 border-none rounded-full px-6 py-3 text-sm focus:ring-1 focus:ring-primary transition-all placeholder:text-secondary/60 outline-none"
                autoFocus={isSearchOpen}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:opacity-90 transition-opacity"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile drawer — rendered outside header to avoid z-index conflicts */}
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
        className={clsx(
          'fixed top-0 left-0 bottom-0 z-50 w-[85vw] max-w-xs bg-background lg:hidden',
          'flex flex-col',
          'transition-transform duration-300 ease-out',
          isMenuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
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
                >
                  {isActive && <span className="w-1 h-1 rounded-full bg-primary" />}
                  {item.name}
                </Link>
              )
            })}

            {/* Shop / Categories accordion */}
            <div>
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider text-text hover:bg-secondary/5 transition-colors"
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
            <Link
              href="/account"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-text hover:bg-secondary/5 transition-colors"
            >
              <User className="w-4 h-4 text-secondary" />
              My Account
            </Link>
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
    </>
  )
}
