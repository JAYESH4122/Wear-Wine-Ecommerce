'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'
import { useAuth } from '@/providers/auth'
import Image from 'next/image'
import { IconBlack } from 'assets'
import type { AuthLoginInput, AuthSignupInput } from '@/types'
import { authModalUi } from '@/data/ui'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

type AuthMode = 'login' | 'signup'

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login, signup } = useAuth()

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (mode === 'login') {
        const input: AuthLoginInput = {
          type: 'credentials',
          email: formData.email,
          password: formData.password,
        }
        await login(input)
      } else {
        const input: AuthSignupInput = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
        }
        await signup(input)
      }
      onClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : authModalUi.errors.generic
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
    setError(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors z-10"
        >
          <X className="w-4 h-4 text-neutral-600" />
        </button>

        <div className="p-8">
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8">
             <div className="w-12 h-12 mb-4 relative flex items-center justify-center bg-black rounded-xl p-2.5">
               <Image src={IconBlack} alt="Logo" width={24} height={24} className="invert object-contain" />
             </div>
             <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
               {mode === 'login' ? authModalUi.header.loginTitle : authModalUi.header.signupTitle}
             </h2>
             <p className="text-neutral-500 text-sm mt-1">
               {mode === 'login' ? authModalUi.header.loginSubtitle : authModalUi.header.signupSubtitle}
             </p>
          </div>

          {/* Social Auth with NextAuth */}
          <div className="grid grid-cols-1 gap-3 mb-8">
            <button
              onClick={() => {
                const input: AuthLoginInput = { type: 'provider', provider: 'google' }
                setIsLoading(true)
                setError(null)
                login(input)
                  .then(() => onClose())
                  .catch((err: unknown) => {
                    const message = err instanceof Error ? err.message : authModalUi.errors.generic
                    setError(message)
                  })
                  .finally(() => setIsLoading(false))
              }}
              className="flex items-center justify-center gap-3 w-full py-3 px-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors font-semibold text-sm text-neutral-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.25.81-.59z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {authModalUi.social.googleCta}
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="bg-white px-4 text-neutral-400">{authModalUi.social.divider}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1">
                  {authModalUi.fields.fullNameLabel}
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-black transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={authModalUi.fields.fullNamePlaceholder}
                    className="w-full bg-neutral-50 border border-neutral-100 px-11 py-3.5 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-black transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1">
                {authModalUi.fields.emailLabel}
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-black transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={authModalUi.fields.emailPlaceholder}
                  className="w-full bg-neutral-50 border border-neutral-100 px-11 py-3.5 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-black transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  {authModalUi.fields.passwordLabel}
                </label>
                {mode === 'login' && (
                  <button type="button" className="text-[10px] font-bold text-neutral-400 hover:text-black transition-colors uppercase tracking-widest">
                    {authModalUi.fields.forgot}
                  </button>
                )}
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-black transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={authModalUi.fields.passwordPlaceholder}
                  className="w-full bg-neutral-50 border border-neutral-100 px-11 py-3.5 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-black transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-lg border border-rose-100"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-black text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? authModalUi.actions.signIn : authModalUi.actions.createAccount}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500">
              {mode === 'login'
                ? authModalUi.actions.footerLoginPrompt
                : authModalUi.actions.footerSignupPrompt}{' '}
              <button
                onClick={toggleMode}
                className="text-black font-bold hover:underline underline-offset-4"
              >
                {mode === 'login' ? authModalUi.actions.footerSignupCta : authModalUi.actions.footerSigninCta}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
