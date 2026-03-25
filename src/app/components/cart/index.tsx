'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import type { Product } from '@/payload-types'
import { useCart, type CartProduct } from '@/providers/cart'
import { CartItemsList } from './components/CartItemsList'
import { CartRecommendations } from './components/CartRecommendations'
import { CartSummary } from './components/CartSummary'
import { EmptyCart } from './components/EmptyCart'
import { cn } from '@/lib/utils'

type Step = 1 | 2 | 3

interface AddressForm {
  fullName: string
  phone: string
  addressLine: string
  city: string
  state: string
  zip: string
}

interface AddressErrors {
  fullName?: string
  phone?: string
  addressLine?: string
  city?: string
  state?: string
  zip?: string
}

type PaymentMethod = 'card' | 'cod'

const STEPS = [
  { id: 1, label: 'Cart' },
  { id: 2, label: 'Address' },
  { id: 3, label: 'Payment' },
] as const

const INITIAL_ADDRESS: AddressForm = {
  fullName: '',
  phone: '',
  addressLine: '',
  city: '',
  state: '',
  zip: '',
}

const ADDRESS_FIELDS = [
  { field: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Jane Doe' },
  { field: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210' },
  {
    field: 'addressLine',
    label: 'Address Line',
    type: 'text',
    placeholder: '12 Park Street, Apt 4B',
  },
  { field: 'city', label: 'City', type: 'text', placeholder: 'Mumbai' },
  { field: 'state', label: 'State', type: 'text', placeholder: 'Maharashtra' },
  { field: 'zip', label: 'ZIP Code', type: 'text', placeholder: '400001' },
] as const

const PAYMENT_OPTIONS = [
  { value: 'card', label: 'Credit / Debit Card', desc: 'Pay securely with your card' },
  { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
] as const

const STEP_TITLES: Record<Step, string> = {
  1: 'Your Cart',
  2: 'Delivery Address',
  3: 'Payment',
}

export const CartPage = () => {
  const { cart, cartCount, removeItem, updateQuantity, subtotal, addItem } = useCart()
  const [recommendations, setRecommendations] = useState<CartProduct[]>([])
  const [step, setStep] = useState<Step>(1)
  const [address, setAddress] = useState<AddressForm>(INITIAL_ADDRESS)
  const [addressErrors, setAddressErrors] = useState<AddressErrors>({})
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
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
        const res = await fetch('/api/products?limit=12', { signal: controller.signal })
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
    if (!address.fullName.trim()) errors.fullName = 'Required'
    if (!address.phone.trim()) errors.phone = 'Required'
    if (!address.addressLine.trim()) errors.addressLine = 'Required'
    if (!address.city.trim()) errors.city = 'Required'
    if (!address.state.trim()) errors.state = 'Required'
    if (!address.zip.trim()) errors.zip = 'Required'
    setAddressErrors(errors)
    return Object.keys(errors).length === 0
  }, [address])

  const handleContinue = useCallback(() => {
    if (step === 1) transitionTo(2, 'forward')
    else if (step === 2 && validateAddress()) transitionTo(3, 'forward')
  }, [step, transitionTo, validateAddress])

  const handleBack = useCallback(() => {
    if (step === 2) transitionTo(1, 'back')
    else if (step === 3) transitionTo(2, 'back')
  }, [step, transitionTo])

  const handleAddressChange = useCallback(
    (field: keyof AddressForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setAddress((prev) => ({ ...prev, [field]: e.target.value }))
      setAddressErrors((prev) => ({ ...prev, [field]: undefined }))
    },
    [],
  )

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
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-700 transition-colors duration-150 mb-8 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-1" />
          <span className="text-xs font-medium tracking-widest uppercase">Continue Shopping</span>
        </Link>

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
                        <StepButton onClick={handleContinue} label="Continue to Address" />
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
                {ADDRESS_FIELDS.map(({ field, label, type, placeholder }) => (
                  <div key={field} className="space-y-1.5">
                    <label
                      htmlFor={field}
                      className="block text-xs font-medium tracking-widest uppercase text-neutral-500"
                    >
                      {label}
                    </label>
                    <input
                      id={field}
                      type={type}
                      value={address[field]}
                      onChange={handleAddressChange(field)}
                      placeholder={placeholder}
                      className={cn(
                        'w-full px-4 py-3.5 bg-transparent border text-sm text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:ring-1 transition-colors duration-150',
                        addressErrors[field]
                          ? 'border-red-400 focus:ring-red-400'
                          : 'border-neutral-200 focus:border-neutral-900 focus:ring-neutral-900',
                      )}
                    />
                    {addressErrors[field] && (
                      <p className="text-xs text-red-400">{addressErrors[field]}</p>
                    )}
                  </div>
                ))}

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
              <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-medium tracking-widest uppercase text-neutral-500 mb-4">
                    Payment Method
                  </p>
                  {PAYMENT_OPTIONS.map(({ value, label, desc }) => (
                    <button
                      key={value}
                      onClick={() => setPaymentMethod(value)}
                      className={cn(
                        'w-full flex items-center justify-between px-5 py-4 border text-left transition-all duration-150 cursor-pointer active:scale-[0.99]',
                        paymentMethod === value
                          ? 'border-neutral-900 bg-neutral-50'
                          : 'border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50/50',
                      )}
                    >
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{label}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">{desc}</p>
                      </div>
                      <div
                        className={cn(
                          'w-4 h-4 rounded-full border-2 transition-all duration-150 shrink-0 ml-4',
                          paymentMethod === value
                            ? 'border-neutral-900 bg-neutral-900'
                            : 'border-neutral-300',
                        )}
                      />
                    </button>
                  ))}
                </div>

                <NavButtons onBack={handleBack} continueLabel="Place Order" isPrimary />
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

const StepButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button
    onClick={onClick}
    className="w-full py-3.5 px-6 bg-neutral-900 text-white text-xs font-medium tracking-widest uppercase cursor-pointer hover:bg-neutral-700 active:scale-[0.98] transition-all duration-150"
  >
    {label}
  </button>
)

const NavButtons = ({
  onBack,
  onContinue,
  continueLabel,
  isPrimary = false,
}: {
  onBack: () => void
  onContinue?: () => void
  continueLabel: string
  isPrimary?: boolean
}) => (
  <div className="flex gap-3 pt-2">
    <button
      onClick={onBack}
      className="flex-1 min-w-0 py-3.5 px-4 border border-neutral-200 text-neutral-600 text-xs font-medium tracking-widest uppercase cursor-pointer hover:border-neutral-500 hover:text-neutral-900 active:scale-[0.98] transition-all duration-150"
    >
      Back
    </button>
    <button
      onClick={onContinue}
      className={cn(
        'flex-1 min-w-0 py-3.5 px-4 text-xs font-medium tracking-widest uppercase cursor-pointer active:scale-[0.98] transition-all duration-150',
        isPrimary
          ? 'bg-neutral-900 text-white hover:bg-neutral-700'
          : 'bg-neutral-900 text-white hover:bg-neutral-700',
      )}
    >
      {continueLabel}
    </button>
  </div>
)
