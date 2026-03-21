'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Search, ChevronRight, Clock, User, Shield, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth'

// Placeholder orders data for demonstration
const MOCK_ORDERS = [
  { id: 'ORD-2023-010', date: 'Oct 24, 2023', total: 129.99, status: 'Delivered', items: 2 },
  { id: 'ORD-2023-089', date: 'Nov 12, 2023', total: 84.50, status: 'Processing', items: 1 },
]

export default function OrdersPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login')
    }
  }, [user, isAuthLoading, router])

  const navItems = [
    { name: 'Profile Overview', href: '/account', icon: User },
    { name: 'My Orders', href: '/account/orders', icon: Clock },
    { name: 'Security', href: '/account/security', icon: Shield },
    { name: 'Settings', href: '/account/settings', icon: Settings },
  ]

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  }

  if (isAuthLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
      {/* Sidebar - Reusable component should ideally be extracted, but placed here for flow sync */}
      <motion.aside 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-64 shrink-0"
      >
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 sticky top-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xl uppercase">
              {user.name?.[0] || user.email?.[0] || 'U'}
            </div>
            <div>
              <h2 className="font-bold text-neutral-900 truncate">{user.name || 'User'}</h2>
              <p className="text-xs text-neutral-500 truncate">{user.email}</p>
            </div>
          </div>
          
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive 
                    ? 'bg-black text-white shadow-md' 
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 block w-full bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-100"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">Order History</h1>
            <p className="text-neutral-500 text-sm">Check the status of recent orders, manage returns, and discover similar products.</p>
          </div>
          
          {/* Mock Search Bar */}
          <div className="relative group w-full sm:w-64">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-black transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="w-full bg-neutral-50 border border-neutral-100 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-black transition-all"
            />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[40vh] flex flex-col items-center justify-center gap-4 bg-white rounded-2xl border border-neutral-100"
            >
              <div className="w-8 h-8 mx-auto border-4 border-neutral-200 border-t-black rounded-full animate-spin"></div>
              <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest text-center">Loading Orders</p>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {MOCK_ORDERS.length > 0 ? (
                MOCK_ORDERS.map((order) => (
                  <motion.div 
                    key={order.id} 
                    variants={itemVariants}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 hover:border-neutral-300 transition-colors cursor-pointer group"
                  >
                    <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
                      
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-neutral-50 flex items-center justify-center rounded-xl border border-neutral-100 group-hover:scale-105 transition-transform">
                          <Package className="w-5 h-5 text-neutral-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900">{order.id}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">Placed on {order.date} • {order.items} item{order.items !== 1 && 's'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100">
                        <div className="flex-1 md:flex-none text-left md:text-right">
                          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Total</p>
                          <p className="text-sm font-bold text-neutral-900">${order.total.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex-1 md:flex-none">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        
                        <div className="hidden sm:flex text-neutral-300 group-hover:text-black transition-colors group-hover:translate-x-1 duration-300">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-12 text-center shadow-sm border border-neutral-100">
                  <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-100">
                    <Package className="w-6 h-6 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight mb-2">No orders yet</h3>
                  <p className="text-sm text-neutral-500 mb-6 max-w-sm mx-auto">When you place orders, they will appear here. Ready to find something you'll love?</p>
                  <Link href="/category/all" className="inline-flex items-center justify-center px-6 py-3 bg-black text-white text-sm font-bold rounded-xl hover:bg-neutral-800 transition-colors">
                    Start Shopping
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
