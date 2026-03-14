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
  Truck,
  Store,
  Sparkles,
  Clock
} from 'lucide-react'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(3)
  const [wishlistCount, setWishlistCount] = useState(2)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/', icon: Store },
    { name: 'Shop', href: '/shop', icon: ShoppingBag },
    { name: 'New', href: '/new-arrivals', icon: Sparkles },
    { name: 'About', href: '/about', icon: User },
    { name: 'Contact', href: '/contact', icon: Clock },
  ]

  const categories = [
    { name: 'Electronics', href: '/category/electronics', count: 124 },
    { name: 'Fashion', href: '/category/fashion', count: 89 },
    { name: 'Home & Living', href: '/category/home-living', count: 56 },
    { name: 'Sports', href: '/category/sports', count: 42 },
    { name: 'Books', href: '/category/books', count: 78 },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  return (
    <header className={clsx(
      "sticky top-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white"
    )}>
      <div className={clsx(
        "hidden lg:block transition-all duration-300 overflow-hidden",
        isScrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
      )}>
        <div className="bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-2">
            <div className="flex justify-end items-center">
              <div className="flex items-center gap-6">
                {['Track Order', 'Help', 'Support'].map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-xs text-gray-300 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors group"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
              )}
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 lg:w-10 lg:h-10">
                <div className="absolute inset-0 bg-gray-900 rounded-lg group-hover:bg-gray-800 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">W</span>
                </div>
              </div>
              <span className="font-bold text-xl lg:text-2xl text-gray-900 group-hover:text-gray-700 transition-colors">
                WEAR WINE
              </span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                      isActive
                        ? "text-gray-900 bg-gray-100"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:scale-105"
                    )}
                  >
                    <Icon className={clsx(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-gray-900" : "text-gray-500"
                    )} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}

              <div className="relative group">
                <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:scale-105 transition-all duration-200 flex items-center gap-1">
                  <Store className="w-4 h-4 text-gray-500" />
                  Categories
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                </button>
                
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[240px] overflow-hidden">
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</h3>
                    </div>
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors group/category"
                      >
                        <span className="group-hover/category:translate-x-1 transition-transform duration-200">
                          {category.name}
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={clsx(
                  "relative w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-xl transition-all duration-200 hover:scale-110",
                  isSearchOpen 
                    ? "bg-gray-900 text-white hover:bg-gray-800" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="/wishlist"
                className="hidden sm:flex relative w-10 h-10 lg:w-12 lg:h-12 items-center justify-center rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:scale-110 transition-all duration-200 group"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-rose-500 text-white text-xs font-medium flex items-center justify-center rounded-full px-1.5 shadow-md ring-2 ring-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/account"
                className="hidden md:flex w-10 h-10 lg:w-12 lg:h-12 items-center justify-center rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:scale-110 transition-all duration-200 group"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>

              <Link
                href="/cart"
                className="relative w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:scale-110 transition-all duration-200 group"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-blue-600 text-white text-xs font-medium flex items-center justify-center rounded-full px-1.5 shadow-md ring-2 ring-white animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <div className={clsx(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isSearchOpen ? "max-h-20 pb-5" : "max-h-0"
          )}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-5 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200 transition-all duration-200 hover:border-gray-300 hover:bg-gray-100 text-black"
                autoFocus={isSearchOpen}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              {searchQuery && (
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 hover:scale-105 transition-all duration-200 shadow-md"
                >
                  Search
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className={clsx(
        "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
        isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
      )}>
        <div className="absolute inset-0" onClick={() => setIsMenuOpen(false)} />
        <div className={clsx(
          "absolute top-0 left-0 bottom-0 w-72 bg-white shadow-2xl transition-transform duration-300 ease-out",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-5">
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold text-gray-900 text-lg">Menu</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={clsx(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:pl-6"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
                Categories
              </h3>
              <div className="space-y-1 mb-4">
                {categories.slice(0, 3).map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <span>{category.name}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="space-y-1">
                <Link
                  href="/wishlist"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5" />
                    <span>Wishlist</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                
                <Link
                  href="/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Account</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}