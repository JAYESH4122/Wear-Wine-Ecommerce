'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center">
      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
        <ShoppingBag className="w-8 h-8 text-muted-foreground" />
      </div>
      
      <h2 className="text-2xl font-light text-foreground mb-3">
        Your cart is empty
      </h2>
      
      <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
        Looks like you haven&apos;t added anything yet. Explore our collection and find something you&apos;ll love.
      </p>
      
      <Link
        href="/"
        className="inline-flex items-center justify-center bg-foreground text-background px-8 py-3.5 text-sm font-medium uppercase tracking-wider rounded-sm hover:bg-foreground/90 transition-colors"
      >
        Start Shopping
      </Link>
    </div>
  )
}
