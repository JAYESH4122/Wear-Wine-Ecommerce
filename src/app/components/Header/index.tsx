'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { 
  Search, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Heart,
  ChevronDown,
  Store,
} from 'lucide-react'
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

  // Use the provided categories prop
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
    <header className={clsx(
      "sticky top-0 z-50 transition-all duration-500",
      isScrolled 
        ? "bg-[var(--color-background)]/80 backdrop-blur-xl shadow-sm border-b border-[var(--color-secondary)]/10 py-1" 
        : "bg-[var(--color-background)] py-3"
    )}>
      {/* Top Utility Bar */}
      <div className={clsx(
        "hidden lg:block transition-all duration-300 overflow-hidden border-b border-[var(--color-secondary)]/5",
        isScrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
      )}>
        <div className="container mx-auto px-6 py-2">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.15em] font-medium text-[var(--color-secondary)]">
            <p>Free Express Shipping on orders over $150</p>
            <div className="flex items-center gap-6">
              {['Track Order', 'Help', 'Support'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(' ', '-')}`}
                  className="hover:text-[var(--color-text)] transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 lg:h-16">
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 -ml-2 text-[var(--color-text)]"
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-8 h-8 bg-[var(--color-primary)] rounded-full transition-transform duration-500 group-hover:rotate-[360deg]">
              <span className="text-white font-bold text-sm tracking-tighter">W</span>
            </div>
            <span className="font-bold text-lg lg:text-xl tracking-[0.1em] text-[var(--color-text)] uppercase">
              Wear Wine
            </span>
          </Link>

          {/* Desktop Desktop Links */}
          <nav className="hidden lg:flex items-center gap-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    "px-4 py-2 text-[13px] font-semibold uppercase tracking-widest transition-all duration-300 relative group",
                    isActive ? "text-[var(--color-primary)]" : "text-[var(--color-secondary)] hover:text-[var(--color-text)]"
                  )}
                >
                  {item.name}
                  <span className={clsx(
                    "absolute bottom-1 left-4 right-4 h-[1.5px] bg-[var(--color-primary)] transition-transform duration-300 origin-left",
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </Link>
              )
            })}

            {/* Categories Dropdown */}
            <div className="relative group ml-2">
              <button className="flex items-center gap-1 px-4 py-2 text-[13px] font-semibold uppercase tracking-widest text-[var(--color-secondary)] hover:text-[var(--color-text)] transition-colors">
                Shop
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              
              <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <div className="bg-[var(--color-background)] shadow-2xl border border-[var(--color-secondary)]/10 p-6 min-w-[280px] rounded-2xl">
                  <h3 className="text-[10px] font-bold text-[var(--color-secondary)] uppercase tracking-[0.2em] mb-4">Collections</h3>
                  <div className="grid gap-y-3">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="flex items-center justify-between group/item"
                      >
                        <span className="text-[14px] text-[var(--color-secondary)] group-hover/item:text-[var(--color-text)] transition-colors">
                          {category.name}
                        </span>
                        <span className="text-[10px] bg-[var(--color-secondary)]/5 px-2 py-0.5 rounded text-[var(--color-secondary)]">
                          {category.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-3">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-[var(--color-secondary)] hover:text-[var(--color-text)] transition-colors"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            <Link href="/wishlist" className="hidden sm:block p-2 text-[var(--color-secondary)] hover:text-[var(--color-text)] transition-colors relative">
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-primary)] rounded-full border border-white" />
              )}
            </Link>

            <Link href="/account" className="hidden md:block p-2 text-[var(--color-secondary)] hover:text-[var(--color-text)] transition-colors">
              <User className="w-5 h-5 stroke-[1.5]" />
            </Link>

            <Link href="/cart" className="p-2 text-[var(--color-secondary)] hover:text-[var(--color-text)] transition-colors relative">
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-0.5 min-w-[16px] h-4 bg-[var(--color-accent)] text-white text-[9px] font-bold flex items-center justify-center rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Expandable */}
        <div className={clsx(
          "overflow-hidden transition-all duration-500 ease-in-out",
          isSearchOpen ? "max-h-24 pb-6 opacity-100" : "max-h-0 opacity-0"
        )}>
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full bg-[var(--color-secondary)]/5 border-none rounded-full px-6 py-3 text-sm focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder:text-[var(--color-secondary)]/60"
              autoFocus={isSearchOpen}
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--color-primary)] text-white p-2 rounded-full hover:opacity-90 transition-opacity">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div className={clsx(
        "fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-500",
        isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
      )} onClick={() => setIsMenuOpen(false)}>
        <div 
          className={clsx(
            "absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-[var(--color-background)] p-8 transition-transform duration-500 ease-out shadow-2xl",
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-12">
            <span className="font-bold tracking-widest text-lg uppercase">Menu</span>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 -mr-2">
              <X className="w-6 h-6 text-[var(--color-secondary)]" />
            </button>
          </div>

          <nav className="space-y-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-2xl font-medium text-[var(--color-text)] hover:translate-x-2 transition-transform duration-300"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="mt-12 pt-12 border-t border-[var(--color-secondary)]/10">
            <h3 className="text-[10px] font-bold text-[var(--color-secondary)] uppercase tracking-[0.2em] mb-6">Popular Categories</h3>
            <div className="space-y-4">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex justify-between items-center text-[var(--color-text)]"
                >
                  <span className="text-lg">{category.name}</span>
                  <span className="text-xs text-[var(--color-secondary)]">({category.count})</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}