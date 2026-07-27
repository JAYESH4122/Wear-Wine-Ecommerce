'use client'

import React from 'react'
import { Package, Search, Calendar, MapPin, History, ShoppingCart, Truck } from 'lucide-react'

interface Order {
  orderId: string
  status: 'placed' | 'shipped'
  trackingId?: string
  createdAt: string
}

interface OrderTrackerProps {
  emailOrPhone: string
  orderId: string
  setEmailOrPhone: (val: string) => void
  setOrderId: (val: string) => void
  loading: boolean
  error: string | null
  orders: Order[]
  hasSearched: boolean
  handleTrack: (e: React.FormEvent) => void
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  emailOrPhone,
  orderId,
  setEmailOrPhone,
  setOrderId,
  loading,
  error,
  orders,
  hasSearched,
  handleTrack,
}) => {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-[1440px] mx-auto px-6 md:px-12 py-20 min-h-screen">
        {/* Hero Section */}
        <section className="mb-16 md:mb-24">
          <h1 className="font-anton text-6xl md:text-9xl uppercase leading-[0.9] tracking-tighter text-text mb-6">
            Track your order
          </h1>
          <p className="font-primary text-xl md:text-2xl text-content-tertiary max-w-xl font-light">
            Enter your details below to check your order status. We believe the wait is part of the vintage.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Search Form Card */}
          <aside className="lg:col-span-5 bg-background-primary rounded-lg p-8 md:p-12 shadow-[0_20px_50px_rgba(28,27,27,0.03)] border border-border-secondary">
            <form onSubmit={handleTrack} className="space-y-8">
              <div className="space-y-2">
                <label className="block font-primary text-sm uppercase tracking-widest text-text font-semibold">
                  Email or Phone Number
                </label>
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full h-14 px-6 rounded-lg bg-background-secondary border-none focus:ring-2 focus:ring-primary/20 text-text placeholder:text-content-placeholder font-medium transition-all font-primary"
                  placeholder="vintage@wearwine.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block font-primary text-sm uppercase tracking-widest text-text font-semibold">
                  Order ID (Optional)
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full h-14 px-6 rounded-lg bg-background-secondary border-none focus:ring-2 focus:ring-primary/20 text-text placeholder:text-content-placeholder font-medium transition-all font-primary"
                  placeholder="WW-2024-XXXX"
                />
              </div>

              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 text-icon-red text-xs font-primary font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-primary text-background-primary rounded-full flex items-center justify-center gap-3 font-primary uppercase tracking-widest text-sm font-bold hover:bg-text transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-background-primary/30 border-t-background-primary rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Track Order
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 pt-12 border-t border-background-secondary">
              <h3 className="font-anton text-xl uppercase mb-4 text-text">Need help?</h3>
              <p className="text-content-tertiary text-sm mb-6 leading-relaxed font-primary">
                Our digital concierge is available to assist with shipping inquiries or change of heart.
              </p>
              <a
                href="#"
                className="text-surface-brick font-bold uppercase text-xs tracking-widest border-b border-surface-brick pb-1 hover:border-b-2 transition-all font-primary"
              >
                Contact Sommelier
              </a>
            </div>
          </aside>

          {/* Results Canvas */}
          <div className="lg:col-span-7 space-y-12">
            {!hasSearched && !loading && (
              <div className="border-2 border-dashed border-border-secondary rounded-lg p-16 flex flex-col items-center justify-center text-center opacity-60">
                <Package className="w-12 h-12 text-content-placeholder mb-6" />
                <h3 className="font-anton text-2xl uppercase text-text">Awaiting search</h3>
                <p className="font-primary text-content-tertiary max-w-xs mt-2">
                  Enter your order details to see your status.
                </p>
              </div>
            )}

            {loading && (
              <div className="space-y-12 animate-pulse">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-background-primary rounded-lg h-64 border border-border-secondary" />
                ))}
              </div>
            )}

            {hasSearched && !loading && orders.length === 0 && (
              <div className="border-2 border-dashed border-border-secondary rounded-lg p-16 flex flex-col items-center justify-center text-center opacity-60">
                <Package className="w-12 h-12 text-content-placeholder mb-6" />
                <h3 className="font-anton text-2xl uppercase text-text">No vintage found</h3>
                <p className="font-primary text-content-tertiary max-w-xs mt-2">
                We couldn&apos;t find any orders matching those details.
                </p>
              </div>
            )}

            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-background-primary rounded-lg overflow-hidden border border-border-secondary transition-transform hover:-translate-y-1 duration-500 shadow-[0_20px_50px_rgba(28,27,27,0.03)]"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between p-8 border-b border-background-secondary bg-background-primary">
                  <div>
                    <span className="font-primary text-xs uppercase tracking-[0.2em] text-content-tertiary font-bold">
                      Order #{order.orderId}
                    </span>
                    <h2 className="text-3xl font-anton uppercase text-text mt-1">Napa Valley Collection</h2>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span
                      className={`inline-flex items-center px-4 py-1 rounded-full font-primary text-xs font-bold uppercase tracking-widest ${
                        order.status === 'shipped'
                          ? 'bg-surface-purple text-text'
                          : 'bg-surface-brick/10 text-surface-brick'
                      }`}
                    >
                      {order.status === 'shipped' ? (
                        <>
                          <Truck className="w-3.5 h-3.5 mr-1.5" />
                          Shipped
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                          Placed
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="p-8 md:p-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-background-secondary flex items-center justify-center text-surface-brick">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-content-tertiary font-bold font-primary">
                            Estimated Delivery
                          </p>
                          <p className="text-lg font-primary text-text font-semibold">
                            {order.status === 'shipped' ? 'October 24, 2024' : 'Processing'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-background-secondary flex items-center justify-center text-surface-brick">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-content-tertiary font-bold font-primary">
                            Shipping Address
                          </p>
                          <p className="text-lg font-primary text-text font-semibold leading-snug">
                            721 Sommelier Blvd, Suite 4<br />
                            Oakville, CA 94562
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background-secondary rounded-lg p-6 relative overflow-hidden group">
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <p className="text-xs uppercase tracking-widest text-content-tertiary font-bold font-primary">
                          Tracking Number
                        </p>
                        <p className="text-2xl font-anton text-text tracking-tighter">
                          {order.trackingId || 'WW-PENDING-XXXX'}
                        </p>
                        {order.trackingId && (
                          <button className="text-left font-primary text-sm underline decoration-surface-brick underline-offset-4 text-surface-brick font-bold hover:decoration-2">
                            View Tracking Details
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {order.status === 'placed' && (
                    <div className="mt-10 flex flex-col md:flex-row items-center gap-10 pt-10 border-t border-background-secondary">
                      <div className="w-24 h-24 bg-background-secondary rounded-lg flex-shrink-0 flex items-center justify-center">
                        <Package className="w-12 h-12 text-content-placeholder" />
                      </div>
                      <div className="flex-grow text-center md:text-left">
                        <p className="font-primary text-lg text-text font-medium leading-relaxed">
                          We&apos;ve received your order and are currently selecting the finest fabrics for your piece.
                          Anticipated processing: 2-3 business days.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {hasSearched && !loading && orders.length > 0 && (
              <div className="border-2 border-dashed border-border-secondary rounded-lg p-16 flex flex-col items-center justify-center text-center opacity-60">
                <History className="w-12 h-12 text-content-placeholder mb-6" />
                <h3 className="font-anton text-2xl uppercase text-text">No other active orders</h3>
                <p className="font-primary text-content-tertiary max-w-xs mt-2">
                  Looking for an older vintage? Check your order history in your profile.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
