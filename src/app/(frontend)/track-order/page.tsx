'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { OrderTracker } from '@/app/components/OrderTracker'

interface Order {
  orderId: string
  status: 'placed' | 'shipped'
  trackingId?: string
  createdAt: string
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const performTracking = async (params: { emailOrPhone: string; orderId?: string }) => {
    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const response = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrPhone: params.emailOrPhone.trim(),
          orderId: params.orderId?.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to track order')
      }

      setOrders(data.docs || [])
      
      // Save last successful search
      if (data.docs?.length > 0) {
        localStorage.setItem('lastTrackEmail', params.emailOrPhone.trim())
      }
    } catch (err: any) {
      setError(err.message)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  // Auto-fill from localStorage or URL
  useEffect(() => {
    let currentEmailOrPhone = ''
    let currentOrderId = ''

    const saved = localStorage.getItem('lastTrackEmail')
    if (saved) currentEmailOrPhone = saved

    const urlEmail = searchParams.get('email')
    const urlPhone = searchParams.get('phone')
    if (urlEmail) currentEmailOrPhone = urlEmail
    else if (urlPhone) currentEmailOrPhone = urlPhone

    const urlOrder = searchParams.get('orderId')
    if (urlOrder) currentOrderId = urlOrder

    setEmailOrPhone(currentEmailOrPhone)
    setOrderId(currentOrderId)

    // Auto-trigger search if we have both
    if (currentEmailOrPhone && currentOrderId) {
      void performTracking({ emailOrPhone: currentEmailOrPhone, orderId: currentOrderId })
    }
  }, [searchParams])

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailOrPhone.trim()) {
      setError('Email or Phone is required')
      return
    }
    await performTracking({ emailOrPhone, orderId })
  }

  return (
    <OrderTracker
      emailOrPhone={emailOrPhone}
      orderId={orderId}
      setEmailOrPhone={setEmailOrPhone}
      setOrderId={setOrderId}
      loading={loading}
      error={error}
      orders={orders}
      hasSearched={hasSearched}
      handleTrack={handleTrack}
    />
  )
}
