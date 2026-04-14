'use client'

import React, { createContext, useContext } from 'react'
import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react'
import type { Session } from 'next-auth'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { getApiUrl } from '@/lib/api/getApiUrl'

type AuthUser = Session['user']

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isHydrated: boolean
  login: (data: { email: string; password: string }) => Promise<void>
  loginWithGoogleCredential: (credential: string) => Promise<void>
  signup: (data: { email: string; password: string; name: string }) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  if (googleClientId) {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        <SessionProvider>
          <AuthContextWrapper>{children}</AuthContextWrapper>
        </SessionProvider>
      </GoogleOAuthProvider>
    )
  }

  return (
    <SessionProvider>
      <AuthContextWrapper>{children}</AuthContextWrapper>
    </SessionProvider>
  )
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthContextWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession()
  const [isHydrated, setIsHydrated] = React.useState(false)
  const user = session?.user ?? null
  const isLoading = status === 'loading'

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  const mergeGuestState = React.useCallback(async (): Promise<void> => {
    if (typeof window === 'undefined') return

    const API_URL = getApiUrl()
    const parseArray = (raw: string | null): unknown[] => {
      if (!raw) return []
      try {
        const parsed = JSON.parse(raw) as unknown
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }

    const localCart = parseArray(window.localStorage.getItem('cart'))
    const localWishlist = parseArray(window.localStorage.getItem('wishlist-items-v2'))

    const [cartMergeResponse, wishlistMergeResponse] = await Promise.all([
      fetch(`${API_URL}/api/cart/merge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: localCart.map((item) => ({
            productId:
              typeof item === 'object' && item && 'product' in item
                ? (item as { product?: { id?: string | number } }).product?.id
                : undefined,
            quantity:
              typeof item === 'object' && item && 'quantity' in item
                ? (item as { quantity?: number }).quantity
                : undefined,
          })),
        }),
      }),
      fetch(`${API_URL}/api/wishlist/merge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: localWishlist.map((item: any) => ({
            productId: item.productId,
            size: item.sizeId,
            color: item.colorId
          })),
        }),
      }),
    ])

    if (!cartMergeResponse.ok || !wishlistMergeResponse.ok) return

    window.localStorage.removeItem('cart')
    window.localStorage.removeItem('wishlist-items-v2')
    // Also remove the old one just in case
    window.localStorage.removeItem('wishlist-items')
    window.dispatchEvent(new CustomEvent('commerce:merged'))
  }, [])

  const login = async (data: { email: string; password: string }) => {
    const res = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    })

    if (res?.error || !res?.ok) {
      throw new Error(res?.error || 'Invalid email or password')
    }

    await mergeGuestState()
  }

  const loginWithGoogleCredential = async (credential: string) => {
    const API_URL = getApiUrl()
    const response = await fetch(`${API_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ credential }),
    })

    const data = (await response.json().catch(() => null)) as { exchangeToken?: string; error?: string } | null
    if (!response.ok || !data?.exchangeToken) {
      throw new Error(data?.error || 'Google sign-in failed')
    }

    const res = await signIn('credentials', {
      redirect: false,
      googleExchangeToken: data.exchangeToken,
    })

    if (res?.error || !res?.ok) {
      throw new Error(res?.error || 'Google sign-in failed')
    }

    await mergeGuestState()
  }

  const signup = async (data: { email: string; password: string; name: string }) => {
    const API_URL = getApiUrl()
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = (await response.json().catch(() => null)) as
        | {
            error?: string
            errors?: Array<{ message?: string }>
          }
        | null
      throw new Error(errorData?.error || errorData?.errors?.[0]?.message || 'Signup failed')
    }

    await login({ email: data.email, password: data.password })
  }

  const logout = async () => {
    await signOut({ redirect: false })
  }

  const refreshUser = async () => {}

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isHydrated, login, loginWithGoogleCredential, signup, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
