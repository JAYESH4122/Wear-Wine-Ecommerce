'use client'

import React, { useRef } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'

interface ShipmentCardProps {
  courier: string
  awbNumber: string
  trackingUrl: string
  className?: string
}

export const ShipmentCard = ({ courier, awbNumber, trackingUrl, className }: ShipmentCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const onMouseEnter = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -4,
        boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)',
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  }

  const onMouseLeave = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  }

  const handleTrack = () => {
    window.open(trackingUrl, '_blank')
  }

  return (
    <div 
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "bg-neutral-900 text-white rounded-2xl p-6 shadow-sm transition-shadow duration-300 border border-neutral-800",
        className
      )}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-neutral-400 text-sm font-medium mb-1">Shipping via</p>
          <h3 className="text-xl font-bold uppercase tracking-wider">{courier}</h3>
        </div>
        <div className="bg-neutral-800 p-2 rounded-lg">
          <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
      </div>
      
      <div className="bg-neutral-800/50 rounded-xl p-4 mb-6 border border-neutral-700">
        <p className="text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">AWB Number</p>
        <p className="text-lg font-mono tracking-tighter text-white">{awbNumber}</p>
      </div>
      
      <button 
        ref={buttonRef}
        onClick={handleTrack}
        className="w-full bg-white text-black py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all active:scale-95 flex items-center justify-center gap-2 group"
      >
        Track Shipment
        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  )
}
