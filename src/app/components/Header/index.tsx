'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { Search, ShoppingBag, User, Menu, X, Heart, ChevronDown } from 'lucide-react'
import { navigation, type CategoryItem } from './data'

interface HeaderProps {
  categories?: CategoryItem[]
}

export const Header = ({ categories: initialCategories = [] }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartCount] = useState(3)
  const [wishlistCount] = useState(2)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()

  const categories = initialCategories

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 transition-all duration-500',
        isScrolled
          ? 'backdrop-blur-xl shadow-sm border-b border-secondary/10 py-1'
          : 'bg-background py-3',
      )}
    >
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
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 -ml-2 text-text"
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-8 h-8 bg-primary rounded-full transition-transform duration-500 group-hover:rotate-180">
              <span className="text-white font-bold text-sm tracking-tight">W</span>
            </div>
            <span className="font-bold text-lg lg:text-xl tracking-wider text-text uppercase">
              Wear Wine
            </span>
          </Link>

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

          <div className="flex items-center gap-1 sm:gap-3">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-secondary hover:text-text transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/wishlist"
              className="hidden sm:block p-2 text-secondary hover:text-text transition-colors relative"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border border-white" />
              )}
            </Link>

            <Link
              href="/account"
              className="hidden md:block p-2 text-secondary hover:text-text transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>

            <Link
              href="/cart"
              className="p-2 text-secondary hover:text-text transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 bg-accent text-white text-xs font-bold flex items-center justify-center rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div
          className={clsx(
            'overflow-hidden transition-all duration-500 ease-in-out',
            isSearchOpen ? 'max-h-24 pb-6 opacity-100' : 'max-h-0 opacity-0',
          )}
        >
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full bg-secondary/5 border-none rounded-full px-6 py-3 text-sm focus:ring-1 focus:ring-primary transition-all placeholder:text-secondary/60"
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

      <div
        className={clsx(
          'fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-500',
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
        )}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={clsx(
            'absolute top-0 left-0 bottom-0 w-10/12 max-w-sm bg-background p-8 transition-transform duration-500 ease-out shadow-2xl',
            isMenuOpen ? 'translate-x-0' : '-translate-x-full',
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-12">
            <span className="font-bold tracking-wider text-lg uppercase">Menu</span>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 -mr-2">
              <X className="w-6 h-6 text-secondary" />
            </button>
          </div>

          <nav className="space-y-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-2xl font-medium text-text hover:translate-x-2 transition-transform duration-300"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="mt-12 pt-12 border-t border-secondary/10">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-6">
              Popular Categories
            </h3>
            <div className="space-y-4">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex justify-between items-center text-text"
                >
                  <span className="text-lg">{category.name}</span>
                  <span className="text-xs text-secondary">({category.count})</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
