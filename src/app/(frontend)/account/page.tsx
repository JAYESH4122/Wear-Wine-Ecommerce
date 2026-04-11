'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/providers/auth'
import { User, Mail, Clock } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button/Button'

const ProfilePage = () => {
  const { user, isLoading, isHydrated } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (user) {
      const initialName = user.name || ''
      setDisplayName(initialName)
      setDraftName(initialName)
    }
  }, [user])

  useEffect(() => {
    if (isHydrated && !isLoading && !user) {
      router.replace('/')
    }
  }, [user, isLoading, isHydrated, router])

  const navItems = [
    { name: 'Profile Overview', href: '/account', icon: User },
    { name: 'My Orders', href: '/account/orders', icon: Clock },
  ]

  const onEditToggle = () => {
    if (isEditing) {
      setDraftName(displayName)
      setSaveError('')
      setIsEditing(false)
      return
    }

    setSaveError('')
    setIsEditing(true)
  }

  const onSave = async () => {
    const trimmed = draftName.trim()
    if (!trimmed) {
      setSaveError('Name is required')
      return
    }

    setIsSaving(true)
    setSaveError('')

    try {
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name: trimmed }),
      })

      const data = (await response.json().catch(() => null)) as
        | {
            error?: string
            user?: { name?: string | null }
          }
        | null

      if (!response.ok) {
        setSaveError(data?.error || 'Unable to update profile')
        return
      }

      const nextName = data?.user?.name?.trim() || trimmed
      setDisplayName(nextName)
      setDraftName(nextName)
      setIsEditing(false)
    } catch {
      setSaveError('Unable to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const sidebar = (
    <motion.aside className="w-full md:w-64 shrink-0">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 sticky top-24">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xl uppercase">
            {isHydrated && user ? displayName?.[0] || user.email?.[0] || 'U' : '?'}
          </div>
          <div>
            <h2 className="font-bold text-neutral-900 truncate">
              {isHydrated && user ? displayName || 'User' : 'Loading...'}
            </h2>
            <p className="text-xs text-neutral-500 truncate">
              {isHydrated && user ? user.email : 'Please wait'}
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-black text-white shadow-md'
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </motion.aside>
  )

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
      {/* Sidebar */}
      {sidebar}

      {/* Main Content */}
      <motion.div className="flex-1 space-y-6">
        {!isHydrated || isLoading ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100 animate-pulse">
            <div className="h-8 bg-neutral-100 w-48 mb-4 rounded" />
            <div className="h-4 bg-neutral-100 w-64 mb-8 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-20 bg-neutral-50 rounded-xl" />
              <div className="h-20 bg-neutral-50 rounded-xl" />
            </div>
          </div>
        ) : !user ? null : (
          <motion.div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

            <h1 className="text-2xl font-bold tracking-tight mb-2 relative z-10">
              Personal Information
            </h1>
            <p className="text-neutral-500 text-sm mb-8 relative z-10">
              Manage your personal details and how we can reach you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  Full Name
                </label>
                <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-100 rounded-xl p-4">
                  <User className="w-4 h-4 text-neutral-400" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={draftName}
                      onChange={(event) => setDraftName(event.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-neutral-900 focus:outline-none"
                      aria-label="Full Name"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-neutral-900">
                      {displayName || 'Not provided'}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  Email Address
                </label>
                <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-100 rounded-xl p-4">
                  <Mail className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm font-semibold text-neutral-900">{user.email}</span>
                  {user.isVerified && (
                    <span className="ml-auto text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Verified
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2 mt-4">
                <Button
                  variant="link"
                  size="sm"
                  className="text-sm font-bold text-primary hover:text-black underline underline-offset-4"
                  onClick={isEditing ? onSave : onEditToggle}
                  loading={isSaving}
                >
                  {isEditing ? 'Save Profile Information' : 'Edit Profile Information'}
                </Button>
                {isEditing ? (
                  <Button
                    variant="link"
                    size="sm"
                    className="ml-3 text-sm font-bold text-neutral-500 hover:text-black underline underline-offset-4"
                    onClick={onEditToggle}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                ) : null}
                {saveError ? (
                  <p className="text-xs font-medium text-red-600 mt-2">{saveError}</p>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default ProfilePage
