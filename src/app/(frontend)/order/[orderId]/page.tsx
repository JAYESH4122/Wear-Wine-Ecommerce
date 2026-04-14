import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { OrderSummary } from '@/app/components/orders/OrderSummary'
import { OrderTimeline } from '@/app/components/orders/OrderTimeline'
import { ShipmentCard } from '@/app/components/orders/ShipmentCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Tracking | Wear Wine',
}

interface PageProps {
  params: Promise<{
    orderId: string
  }>
  searchParams: Promise<{
    email?: string
  }>
}

export default async function OrderTrackingPage({ params, searchParams }: PageProps) {
  const { orderId } = await params
  const { email } = await searchParams

  if (!email) {
    // We need an email to view the order securely
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Secure Tracking</h1>
        <p className="text-neutral-500 mb-8 max-w-md">
          Please provide the email address used for this order to track its status.
        </p>
        <form className="flex w-full max-w-sm items-center space-x-2">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            required
          />
          <button type="submit" className="h-10 px-4 py-2 bg-neutral-900 text-white rounded-md text-sm font-medium transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2">
            Track
          </button>
        </form>
      </div>
    )
  }

  const payload = await getPayload({ config: configPromise })
  const orders = await payload.find({
    collection: 'orders',
    where: {
      orderId: {
        equals: orderId,
      },
      email: {
        equals: email.toLowerCase().trim(),
      },
    },
    overrideAccess: true,
    limit: 1,
    depth: 1,
  })

  const order = orders.docs[0]

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Order Not Found</h1>
        <p className="text-neutral-600 mb-8 max-w-md">
          We could not find an order with this ID and email combination. Please check your details and try again.
        </p>
      </div>
    )
  }

  // Format items for OrderSummary
  const summaryItems = (order.items || []).map((item: any) => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    product: item.product,
  }))

  return (
    <div className="min-h-screen bg-neutral-50 py-12 md:py-24">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-2">Order Tracking</h1>
          <p className="text-neutral-500">Order #{order.orderId}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-neutral-100 mb-8">
          <OrderTimeline status={order.status as any} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <OrderSummary items={summaryItems} total={order.total} />
          </div>

          <div className="space-y-8">
            {order.awbNumber && order.trackingUrl && (
              <ShipmentCard 
                courier={order.courier || 'DTDC'} 
                awbNumber={order.awbNumber} 
                trackingUrl={order.trackingUrl} 
              />
            )}
            
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-100">
              <h3 className="text-lg font-semibold mb-4 text-neutral-900">Shipping Details</h3>
              <div className="text-sm text-neutral-600 space-y-1">
                <p className="font-medium text-neutral-900">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.addressLine1}</p>
                {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress?.addressLine2}</p>}
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
                <p>{order.shippingAddress?.country}</p>
                <p className="mt-4 pt-4 border-t border-neutral-100">
                  <span className="font-medium text-neutral-900 text-xs tracking-wider uppercase">Contact:</span><br/>
                  {order.phone}<br/>
                  {order.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
