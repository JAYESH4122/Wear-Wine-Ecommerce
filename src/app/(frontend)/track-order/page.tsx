'use client'

import React, { useState, useEffect } from 'react'
import { Package, Search, ExternalLink, Calendar, MapPin, Truck } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

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
    <div className="bg-[#FDFCFB] py-12 md:py-24">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="lg:text-6xl text-[40px] font-bold tracking-tight text-neutral-900 mb-4">
            Track your order
          </h1>
          <p className="text-neutral-500 lg:text-[17px] text-[12px]">
            Enter your details below to check your order status.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 mb-12">
          <form onSubmit={handleTrack} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700 ml-1">
                  Email or Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="e.g. hello@example.com or 9876543210"
                    className="w-full h-14 rounded-2xl border border-neutral-200 bg-neutral-50/50 px-5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700 ml-1">
                  Order ID <span className="text-neutral-400 font-normal ml-1">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. ORD-171354..."
                    className="w-full h-14 rounded-2xl border border-neutral-200 bg-neutral-50/50 px-5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-neutral-900 text-white rounded-2xl text-lg font-bold hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-neutral-900/10 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Track Order
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {hasSearched && !loading && orders.length === 0 && (
            <div className="text-center py-12 px-6 bg-white rounded-[2rem] border border-dashed border-neutral-200">
              <Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">No orders found</h3>
              <p className="text-neutral-500 max-w-sm mx-auto">
                Couldn&apos;t find any orders matching those details. Please check your information and try again.
              </p>
            </div>
          )}

          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-neutral-100 overflow-hidden relative group transition-all hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)]"
            >
              {/* Status Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold uppercase tracking-widest">
                    <Package className="w-3.5 h-3.5" />
                    Order ID
                  </div>
                  <p className="text-xl font-bold text-neutral-900">{order.orderId}</p>
                </div>
                
                <div className={`px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
                  order.status === 'shipped' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-orange-50 text-orange-600'
                }`}>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    order.status === 'shipped' ? 'bg-blue-600' : 'bg-orange-600'
                  }`} />
                  {order.status === 'shipped' ? 'Shipped' : 'Order Placed'}
                </div>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-t border-neutral-50 pt-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Order Date</p>
                    <p className="text-neutral-900 font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {order.status === 'shipped' && order.trackingId && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-400">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Tracking ID</p>
                      <p className="text-neutral-900 font-medium">{order.trackingId}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Message & Actions */}
              <div className={`p-6 rounded-2xl border ${
                order.status === 'shipped'
                ? 'bg-blue-50/30 border-blue-100'
                : 'bg-orange-50/30 border-orange-100'
              }`}>
                {order.status === 'shipped' ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-blue-900 font-bold mb-1">Your order is on the way!</h4>
                      <p className="text-blue-700/70 text-sm">
                        It has been handed over to our courier partner DTDC. Use the tracking ID above to see the live location.
                      </p>
                    </div>
                    {order.trackingId && (
                      <a
                        href={`https://www.dtdc.in/tracking.asp?strCnno=${order.trackingId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                      >
                        Track on DTDC
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ) : (
                  <div>
                    <h4 className="text-orange-900 font-bold mb-1">Order Confirmed</h4>
                    <p className="text-orange-700/70 text-sm">
                      Your order has been confirmed and is currently being prepared. We&apos;ll notify you once it&apos;s shipped.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
