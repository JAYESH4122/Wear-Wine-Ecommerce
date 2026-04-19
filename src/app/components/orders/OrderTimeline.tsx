'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'

type OrderStatus = 'placed' | 'shipped'

interface OrderTimelineProps {
  status: OrderStatus
  className?: string
}

const steps: { label: string; value: OrderStatus }[] = [
  { label: 'Order Placed', value: 'placed' },
  { label: 'Shipped', value: 'shipped' },
]

export const OrderTimeline = ({ status, className }: OrderTimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const currentIndex = steps.findIndex(step => step.value === status)

  useEffect(() => {
    if (!containerRef.current) return

    const dots = containerRef.current.querySelectorAll('.status-dot')
    const lines = containerRef.current.querySelectorAll('.status-line')

    // Initial state: hidden
    gsap.set([dots, lines], { opacity: 0, scale: 0.8 })

    // Animation timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.6 } })

    tl.to(dots, {
      opacity: 1,
      scale: 1,
      stagger: 0.1,
    })
    .to(lines, {
      opacity: 1,
      scaleX: 1,
      stagger: 0.1,
    }, '-=0.4')

  }, [status])



  return (
    <div ref={containerRef} className={cn("w-full py-8", className)}>
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex
          const isCurrent = index === currentIndex
          
          return (
            <div key={step.value} className="flex flex-col items-center flex-1 relative z-10">
              {/* Dot */}
              <div 
                className={cn(
                  "status-dot w-5 h-5 rounded-full border-2 transition-colors duration-500 flex items-center justify-center",
                  isCompleted ? "bg-black border-black" : "bg-white border-neutral-300",
                  isCurrent && "ring-4 ring-black/10 scale-125"
                )}
              >
                {isCompleted && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              
              {/* Label */}
              <span 
                className={cn(
                  "mt-4 text-[10px] md:text-sm font-medium transition-colors duration-500 text-center px-1",
                  isCompleted ? "text-neutral-900" : "text-neutral-400"
                )}
              >
                {step.label}
              </span>

              {/* Connecting Line (except for last item) */}
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    "status-line absolute top-2.5 left-1/2 w-full h-[2px] -z-10 origin-left transition-colors duration-500",
                    index < currentIndex ? "bg-black" : "bg-neutral-200"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
