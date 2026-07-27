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

  const performTracking = async (params: { emailOrPhone: string; orderId: string }) => {
    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const response = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrPhone: params.emailOrPhone.trim(),
          orderId: params.orderId.trim(),
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to track order')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  // Contact data stays out of the URL; only the opaque order reference may be prefilled.
  useEffect(() => {
    let currentEmailOrPhone = ''
    const saved = localStorage.getItem('lastTrackEmail')
    if (saved) currentEmailOrPhone = saved
    const currentOrderId = searchParams.get('orderId') || ''

    if (searchParams.has('email') || searchParams.has('phone')) {
      const sanitizedParams = new URLSearchParams()
      if (currentOrderId) sanitizedParams.set('orderId', currentOrderId)
      const sanitizedQuery = sanitizedParams.toString()
      window.history.replaceState(null, '', `/track-order${sanitizedQuery ? `?${sanitizedQuery}` : ''}`)
    }

    setEmailOrPhone(currentEmailOrPhone)
    setOrderId(currentOrderId)
  }, [searchParams])

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailOrPhone.trim() || !orderId.trim()) {
      setError('Exact Order ID and Email or Phone are required')
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
