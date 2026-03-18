'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface CartHeaderProps {
  itemCount: number
}

export function CartHeader({ itemCount }: CartHeaderProps) {
  return (
    <div className="mb-12">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-medium">Continue Shopping</span>
      </Link>
      
      <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
        Your Cart
        {itemCount > 0 && (
          <span className="ml-4 text-2xl md:text-3xl text-muted-foreground">
            ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
        )}
      </h1>
    </div>
  )
}
