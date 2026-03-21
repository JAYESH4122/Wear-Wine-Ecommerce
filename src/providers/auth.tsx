'use client'

import React, { createContext, useContext } from 'react'
import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react'
import type { User } from '@/payload-types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (data: any) => Promise<void>
  signup: (data: any) => Promise<void>
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
  const user = (session?.user as User) || null
  const isLoading = status === 'loading'

  const login = async (data: any) => {
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

  const signup = async (data: any) => {
    // Utilize the native Payload local API route for creation since NextAuth only does sign IN.
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, refreshUser }}>
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
