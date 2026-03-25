'use client'

import React from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button/Button'

export const EmptyCart = React.memo(function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
        <ShoppingBag className="w-8 h-8 text-neutral-400" />
      </div>
      <h2 className="text-2xl font-light text-neutral-900 mb-3">Your cart is empty</h2>
      <p className="text-neutral-500 max-w-sm mb-8">
        Explore our collection and find something you&apos;ll love.
      </p>
      <Button asChild variant="primary" size="lg" className="px-10 py-4 rounded-sm">
        <Link href="/">Start Shopping</Link>
      </Button>
    </div>
  )
})
