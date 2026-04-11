'use client'

import React, { useCallback, useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import type { Product } from '@/payload-types'
import { useCart, type CartProduct } from '@/providers/cart'
import { useAuth } from '@/providers/auth'
import { CartItemsList } from './components/CartItemsList'
import { CartRecommendations } from './components/CartRecommendations'
import { CartSummary } from './components/CartSummary'
import { EmptyCart } from './components/EmptyCart'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button/Button'
import { getApiUrl } from '@/lib/api/getApiUrl'

type Step = 1 | 2 | 3

interface AddressForm {
  email: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  zip: string
  landmark: string
}

interface AddressErrors {
  email?: string
  fullName?: string
  phone?: string
  addressLine1?: string
  city?: string
  state?: string
  zip?: string
  country?: string
}



const STEPS = [
  { id: 1, label: 'Cart' },
  { id: 2, label: 'Address' },
  { id: 3, label: 'Payment' },
] as const

const INITIAL_ADDRESS: AddressForm = {
  email: '',
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  country: 'India',
  zip: '',
  landmark: '',
}

interface AddressField {
  field: keyof AddressForm
  label: string
  type: string
  placeholder?: string
  required: boolean
  options?: string[]
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 
  'Dadra and Nagar Haveli', 'Daman and Diu', 'Lakshadweep', 'National Capital Territory of Delhi', 
  'Puducherry'
].sort()

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'United Arab Emirates']

const ADDRESS_FIELDS = [
  { field: 'email', label: 'Email Address', type: 'email', placeholder: 'jane@example.com', required: true },
  { field: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Jane Doe', required: true },
  { field: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210', required: true },
  {
    field: 'addressLine1',
    label: 'Address Line 1',
    type: 'text',
    placeholder: '12 Park Street, Apt 4B',
    required: true,
  },
  {
    field: 'addressLine2',
    label: 'Address Line 2 (Optional)',
    type: 'text',
    placeholder: 'Near Landmark or Floor',
    required: false,
  },
  { field: 'city', label: 'City', type: 'text', placeholder: 'Mumbai', required: true },
  { field: 'landmark', label: 'Landmark (Optional)', type: 'text', placeholder: 'Near Mall', required: false },
  { field: 'country', label: 'Country', type: 'select', options: COUNTRIES, required: true },
  { field: 'state', label: 'State', type: 'select', options: INDIAN_STATES, required: true },
  { field: 'zip', label: 'PIN Code', type: 'text', placeholder: '400001', required: true },
] satisfies AddressField[]



const STEP_TITLES: Record<Step, string> = {
  1: 'Your Cart',
  2: 'Delivery Address',
  3: 'Payment',
}

export const CartPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <CartPageContent />
    </Suspense>
  )
}

const CartPageContent = () => {
  const { cart, cartCount, removeItem, updateQuantity, subtotal, addItem, clearCart } = useCart()
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const stepParam = searchParams.get('step')
  const initialStep = (stepParam && ['1', '2', '3'].includes(stepParam)) ? Number(stepParam) as Step : 1

  const [recommendations, setRecommendations] = useState<CartProduct[]>([])
  const [step, setStep] = useState<Step>(initialStep)
  const [address, setAddress] = useState<AddressForm>(INITIAL_ADDRESS)
  const [addressErrors, setAddressErrors] = useState<AddressErrors>({})

  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null)
  const [visible, setVisible] = useState(true)
  const [slideDir, setSlideDir] = useState<'forward' | 'back'>('forward')

  const handleQuickAdd = useCallback((product: CartProduct) => addItem(product, 1), [addItem])

  const handleUpdateQuantity = useCallback(
    (id: string, qty: number) => {
      if (qty >= 1) updateQuantity(id, qty)
    },
    [updateQuantity],
  )

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      try {
        const API_URL = getApiUrl()
        const res = await fetch(`${API_URL}/api/products?limit=12`, {
          signal: controller.signal,
          credentials: 'include',
        })
        if (!res.ok) return
        const data = (await res.json()) as { docs?: Product[] }
        const docs = data?.docs ?? []
        const cartProductIds = new Set(cart.map((item) => item.product.id))
        const mapped: CartProduct[] = docs
          .filter(
            (p) => p?.id && p?.name && typeof p?.price === 'number' && !cartProductIds.has(p.id),
          )
          .slice(0, 8)
          .map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug ?? null,
            price: p.price,
            salePrice: p.salePrice ?? null,
            category: p.category ?? null,
            images: p.images?.map((img) => ({ image: img?.image, id: img?.id ?? null })) ?? [],
          }))
        setRecommendations(mapped)
      } catch {
        // ignore aborted requests
      }
    }
    load()
    return () => controller.abort()
  }, [cart])

  const transitionTo = useCallback((next: Step, dir: 'forward' | 'back') => {
    setSlideDir(dir)
    setVisible(false)
    setTimeout(() => {
      setStep(next)
      setVisible(true)
    }, 180)
  }, [])

  const validateAddress = useCallback((): boolean => {
    const errors: AddressErrors = {}
    if (!address.email.trim()) errors.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) errors.email = 'Invalid email'
    if (!address.fullName.trim()) errors.fullName = 'Required'
    if (!address.phone.trim()) errors.phone = 'Required'
    else if (!/^\+?[\d\s-]{10,}$/.test(address.phone)) errors.phone = 'Invalid phone'
    
    if (!address.addressLine1.trim()) errors.addressLine1 = 'Required'
    if (!address.city.trim()) errors.city = 'Required'
    if (!address.country.trim()) errors.country = 'Required'
    if (!address.state.trim()) errors.state = 'Required'
    if (!address.zip.trim()) errors.zip = 'Required'
    else if (address.zip.trim().length < 5) errors.zip = 'Invalid code'
    
    setAddressErrors(errors)
    return Object.keys(errors).length === 0
  }, [address])

  useEffect(() => {
    if (!user?.email) return
    setAddress((prev) => ({ ...prev, email: prev.email || user.email || '' }))
  }, [user?.email])

  const handleContinue = useCallback(() => {
    if (step === 1) transitionTo(2, 'forward')
    else if (step === 2 && validateAddress()) transitionTo(3, 'forward')
  }, [step, transitionTo, validateAddress])

  const handleBack = useCallback(() => {
    if (step === 2) transitionTo(1, 'back')
    else if (step === 3) transitionTo(2, 'back')
  }, [step, transitionTo])

  const handleAddressChange = useCallback(
    (field: keyof AddressForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setAddress((prev) => ({ ...prev, [field]: e.target.value }))
      setAddressErrors((prev) => ({ ...prev, [field]: undefined }))
      setOrderError(null)
    },
    [],
  )

  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }, [])

  const handlePlaceOrder = useCallback(async () => {
    if (!validateAddress() || cart.length === 0) return

    setIsPlacingOrder(true)
    setOrderError(null)
    setOrderSuccess(null)

    const API_URL = getApiUrl()

    try {
      const sdkLoaded = await loadRazorpayScript()
      if (!sdkLoaded) {
        throw new Error('Razorpay SDK failed to load. Are you online?')
      }

        // 1. Create order on server
        const response = await fetch(`${API_URL}/api/create-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email: address.email,
            phone: address.phone,
            shippingAddress: {
              fullName: address.fullName,
              addressLine1: address.addressLine1,
              addressLine2: address.addressLine2,
              city: address.city,
              state: address.state,
              country: address.country,
              postalCode: address.zip,
              landmark: address.landmark,
            },
            items: cart.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
            })),
          }),
        })

        const orderData = await response.json()
        if (!response.ok) {
          throw new Error(orderData.error || 'Failed to create order')
        }

        // 2. Options for Razorpay
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Wear Wine',
          description: 'Payment for your order',
          order_id: orderData.razorpayOrderId,
          handler: async (response: any) => {
            try {
              // 3. Verify payment on server
              const verifyRes = await fetch(`${API_URL}/api/verify-payment`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  internal_order_id: orderData.id,
                }),
              })

              const verifyData = await verifyRes.json()
              if (!verifyRes.ok) {
                throw new Error(verifyData.error || 'Payment verification failed')
              }

              clearCart()
              setOrderSuccess('Payment successful! Your order has been placed.')
              transitionTo(1, 'back')
            } catch (err) {
              setOrderError(err instanceof Error ? err.message : 'Verification failed')
              setIsPlacingOrder(false)
            }
          },
          prefill: {
            name: address.fullName,
            email: address.email,
            contact: address.phone,
          },
          theme: {
            color: '#171717',
          },
          modal: {
            ondismiss: () => {
              setIsPlacingOrder(false)
            },
          },
        }

        const rzp = new (window as any).Razorpay(options)
        rzp.open()
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : 'Failed to place order')
    } finally {
      // NOTE: For Razorpay, we keep isPlacingOrder true until verification completes or modal closes
    }
  }, [
    address.email,
    address.fullName,
    address.phone,
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.country,
    address.zip,
    address.landmark,
    cart,
    clearCart,
    transitionTo,
    validateAddress,
    loadRazorpayScript,
  ])

  const contentClass = cn(
    'will-change-transform',
    visible
      ? 'opacity-100 translate-x-0 transition-all duration-200 ease-out'
      : cn(
          'opacity-0 transition-all duration-180 ease-in',
          slideDir === 'forward' ? '-translate-x-3' : 'translate-x-3',
        ),
  )

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-16 max-w-7xl">
        {/* Back link */}
        <Button
          asChild
          variant="back"
          size="sm"
          leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          className="mb-8 text-neutral-400 hover:text-neutral-700"
        >
          <Link href="/">Continue Shopping</Link>
        </Button>

        {/* Progress indicator */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center mb-8">
            {STEPS.map((s, i) => {
              const isCompleted = step > s.id
              const isActive = step === s.id
              return (
                <React.Fragment key={s.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all duration-300',
                        isCompleted || isActive
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-200 text-neutral-400',
                      )}
                    >
                      {isCompleted ? <Check className="w-3 h-3" /> : s.id}
                    </div>
                    <span
                      className={cn(
                        'text-xs font-medium tracking-widest uppercase transition-colors duration-300',
                        isActive
                          ? 'text-neutral-900'
                          : isCompleted
                            ? 'text-neutral-500'
                            : 'text-neutral-300',
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={cn(
                        'h-px mx-3 w-8 md:w-14 transition-colors duration-300',
                        step > s.id ? 'bg-neutral-900' : 'bg-neutral-200',
                      )}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>

          <div className="flex items-baseline justify-between border-b border-neutral-200 pb-6">
            <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 tracking-tight">
              {STEP_TITLES[step]}
            </h1>
            {step === 1 && cartCount > 0 && (
              <span className="text-xs font-medium tracking-widest uppercase text-neutral-400 self-end pb-1">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
        </div>

        {/* Step content */}
        <div className={contentClass}>
          {/* Step 1: Cart */}
          {step === 1 && (
            <>
              {cartCount === 0 ? (
                <>
                  <EmptyCart />
                  <CartRecommendations products={recommendations} onQuickAdd={handleQuickAdd} />
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <div className="lg:col-span-7 xl:col-span-8">
                      <CartItemsList
                        items={cart}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={removeItem}
                      />
                    </div>
                    <div className="lg:col-span-5 xl:col-span-4">
                      <div className="lg:sticky lg:top-8 space-y-3">
                        <CartSummary subtotal={subtotal} itemCount={cartCount} />
                        <Button
                          onClick={handleContinue}
                          variant="primary"
                          size="lg"
                          fullWidth
                          className="px-6 text-xs tracking-widest uppercase"
                        >
                          Continue to Address
                        </Button>
                      </div>
                    </div>
                  </div>
                  <CartRecommendations products={recommendations} onQuickAdd={handleQuickAdd} />
                </>
              )}
            </>
          )}

          {/* Step 2: Address */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-7 xl:col-span-8 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  {ADDRESS_FIELDS.map(({ field, label, type, placeholder, options }) => {
                    const isFullWidth = ['addressLine1', 'addressLine2', 'email', 'fullName'].includes(field as string)
                    
                    return (
                      <div key={field} className={cn('space-y-1.5', isFullWidth ? 'md:col-span-2' : '')}>
                        <label
                          htmlFor={field}
                          className="block text-xs font-medium tracking-widest uppercase text-neutral-500"
                        >
                          {label}
                        </label>
                        
                        {type === 'select' ? (
                          <select
                            id={field}
                            value={address[field as keyof AddressForm]}
                            onChange={handleAddressChange(field as keyof AddressForm)}
                            className={cn(
                              'w-full px-4 py-3.5 bg-transparent border text-sm text-neutral-900 focus:outline-none focus:ring-1 transition-colors duration-150 appearance-none',
                              addressErrors[field as keyof AddressErrors]
                                ? 'border-red-400 focus:ring-red-400'
                                : 'border-neutral-200 focus:border-neutral-900 focus:ring-neutral-900',
                            )}
                          >
                            <option value="">Select {label}</option>
                            {options?.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            id={field}
                            type={type}
                            value={address[field as keyof AddressForm]}
                            onChange={handleAddressChange(field as keyof AddressForm)}
                            placeholder={placeholder}
                            className={cn(
                              'w-full px-4 py-3.5 bg-transparent border text-sm text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:ring-1 transition-colors duration-150',
                              addressErrors[field as keyof AddressErrors]
                                ? 'border-red-400 focus:ring-red-400'
                                : 'border-neutral-200 focus:border-neutral-900 focus:ring-neutral-900',
                            )}
                          />
                        )}
                        
                        {addressErrors[field as keyof AddressErrors] && (
                          <p className="text-xs text-red-400">{addressErrors[field as keyof AddressErrors]}</p>
                        )}
                      </div>
                    )
                  })}
                </div>

                <NavButtons
                  onBack={handleBack}
                  onContinue={handleContinue}
                  continueLabel="Continue to Payment"
                />
              </div>

              <div className="lg:col-span-5 xl:col-span-4">
                <div className="lg:sticky lg:top-8">
                  <CartSummary subtotal={subtotal} itemCount={cartCount} />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                <div className="p-8 border border-neutral-100 bg-neutral-50/50 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-widest">
                        Secure Checkout
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1">
                        Professional encryption by Razorpay
                      </p>
                    </div>
                    <Image 
                      src="https://razorpay.com/assets/razorpay-glyph.svg" 
                      alt="Razorpay" 
                      width={24}
                      height={24}
                      className="h-6 w-auto opacity-80"
                    />
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
                      By proceeding, you will be redirected to Razorpay&apos;s secure payment portal. 
                      We support all major payment methods including Cards, UPI, Netbanking, 
                      and Wallets.
                    </p>
                    
                    <div className="flex flex-wrap gap-4 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-300">
                      {/* Using text labels as placeholders for premium icons if actual assets aren't available */}
                      <span className="text-[10px] font-bold tracking-tighter uppercase border border-neutral-300 px-2 py-1">UPI</span>
                      <span className="text-[10px] font-bold tracking-tighter uppercase border border-neutral-300 px-2 py-1">VISA</span>
                      <span className="text-[10px] font-bold tracking-tighter uppercase border border-neutral-300 px-2 py-1">MASTER</span>
                      <span className="text-[10px] font-bold tracking-tighter uppercase border border-neutral-300 px-2 py-1">AMEX</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-200">
                    <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50/50 p-4 border border-emerald-100/50">
                      <Check className="w-4 h-4" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">
                        Your payment is 100% secure and encrypted
                      </p>
                    </div>
                  </div>
                </div>

                {orderError && (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1 h-1 bg-red-600 rounded-full" />
                    {orderError}
                  </div>
                )}
                
                {orderSuccess && (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1 h-1 bg-emerald-600 rounded-full" />
                    {orderSuccess}
                  </div>
                )}

                <NavButtons
                  onBack={handleBack}
                  onContinue={handlePlaceOrder}
                  continueLabel={isPlacingOrder ? 'Processing...' : 'Pay Securely via Razorpay'}
                />
              </div>

              <div className="lg:col-span-5 xl:col-span-4">
                <div className="lg:sticky lg:top-8">
                  <CartSummary subtotal={subtotal} itemCount={cartCount} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

// ── Shared button components ────────────────────────────────────────────────

const NavButtons = ({
  onBack,
  onContinue,
  continueLabel,
}: {
  onBack: () => void
  onContinue?: () => void
  continueLabel: string
}) => (
  <div className="flex gap-3 pt-2 lg:flex-row flex-col">
    <Button
      onClick={onBack}
      variant="secondary"
      size="lg"
      className="flex-1 min-w-0 lg:px-4 py-4 text-xs tracking-widest uppercase"
    >
      Back
    </Button>
    <Button
      onClick={onContinue}
      variant="primary"
      size="lg"
      className="flex-1 min-w-0 lg:px-4 py-4 text-xs tracking-widest uppercase"
    >
      {continueLabel}
    </Button>
  </div>
)
