'use client'

import React, { createContext, useContext } from 'react'
import type { AuthLoginInput, AuthSignupInput, User } from '@/types'
import { authStorageKey, createUserFromProvider } from '@/data/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isHydrated: boolean
  login: (data: AuthLoginInput) => Promise<void>
  signup: (data: AuthSignupInput) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AuthContextWrapper>{children}</AuthContextWrapper>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthContextWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHydrated, setIsHydrated] = React.useState(false)
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const saved = localStorage.getItem(authStorageKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as unknown
        if (parsed && typeof parsed === 'object') {
          const candidate = parsed as Partial<User>
          if (typeof candidate.id === 'string' && typeof candidate.email === 'string') {
            setUser({
              id: candidate.id,
              email: candidate.email,
              name: typeof candidate.name === 'string' ? candidate.name : undefined,
              isVerified: typeof candidate.isVerified === 'boolean' ? candidate.isVerified : undefined,
            })
          }
        }
      } catch {
        // ignore corrupt storage
      }
    }
    setIsHydrated(true)
    setIsLoading(false)
  }, [])

  const persistUser = (nextUser: User | null) => {
    if (!nextUser) {
      localStorage.removeItem(authStorageKey)
      return
    }
    localStorage.setItem(authStorageKey, JSON.stringify(nextUser))
  }

  const login = async (data: AuthLoginInput) => {
    const nextUser =
      data.type === 'provider'
        ? createUserFromProvider(data.provider)
        : {
            id: `${authStorageKey}:${data.email}`,
            email: data.email,
            name: undefined,
            isVerified: true,
          }

    setUser(nextUser)
    persistUser(nextUser)
  }

  const signup = async (data: AuthSignupInput) => {
    const nextUser: User = {
      id: `${authStorageKey}:${data.email}`,
      email: data.email,
      name: data.name,
      isVerified: true,
    }
    setUser(nextUser)
    persistUser(nextUser)
  }

  const logout = async () => {
    setUser(null)
    persistUser(null)
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
