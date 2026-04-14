'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OrderItem {
  product: string | any
  name: string
  price: number
  quantity: number
}

interface OrderSummaryProps {
  items: OrderItem[]
  total: number
  className?: string
}

export const OrderSummary = ({ items, total, className }: OrderSummaryProps) => {
  return (
    <div className={cn("bg-white/50 backdrop-blur-md border border-neutral-200 rounded-2xl p-6 shadow-sm", className)}>
      <h3 className="text-xl font-medium mb-6 text-neutral-900 leading-tight">Order Summary</h3>
      
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4 group">
            <div className="relative w-24 h-24 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
              {/* Note: Product image would normally be here. Using a placeholder for now since items in order are simplified */}
              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <div className="flex flex-col justify-between py-1 flex-grow">
              <div>
                <h4 className="font-medium text-neutral-900 leading-snug">{item.name}</h4>
                <p className="text-sm text-neutral-500 mt-1">Qty: {item.quantity}</p>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-neutral-900 font-semibold tracking-tight">₹{item.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-neutral-200">
        <div className="flex justify-between items-center">
          <span className="text-neutral-500 font-medium">Order Total</span>
          <span className="text-2xl font-bold text-neutral-900 tracking-tighter">₹{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
