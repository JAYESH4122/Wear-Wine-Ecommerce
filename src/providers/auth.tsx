'use client'

import React, { createContext, useContext } from 'react'
import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react'
import type { Session } from 'next-auth'
import { getApiUrl } from '@/lib/api/getApiUrl'

type AuthUser = Session['user']

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isHydrated: boolean
  login: (data: { email: string; password: string }) => Promise<void>
  signup: (data: { email: string; password: string; name: string }) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const login = async (data: { email: string; password: string }) => {
    const res = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    })
    
    // next-auth returns false or error if it fails
    if (res?.error) {
      throw new Error(res.error)
    }
  }

  const signup = async (data: { email: string; password: string; name: string }) => {
    // Utilize the native Payload local API route for creation since NextAuth only does sign IN.
    const API_URL = getApiUrl()
    const response = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        ...data,
        collection: 'users',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.errors?.[0]?.message || 'Signup failed')
    }

    // After signup, automatically login using NextAuth credentials fallback
    await login({ email: data.email, password: data.password })
  }

  const logout = async () => {
    await signOut({ redirect: false })
  }

  const refreshUser = async () => {}

  return (
    <AuthContext.Provider value={{ user, isLoading, isHydrated, login, signup, logout, refreshUser }}>
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
