'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { X, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '@/providers/auth'
import { Button } from '@/components/ui/button/Button'
import Image from 'next/image'
import { IconBlack } from 'assets'
import { clsx } from 'clsx'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

type AuthMode = 'login' | 'signup'

const PANEL_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: 12,
    scale: 0.98,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

const SLIDE_VARIANTS: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 24 }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -24,
    transition: { duration: 0.18, ease: 'easeIn' },
  }),
}

interface FloatLabelInputProps {
  id: string
  label: string
  type: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  autoComplete?: string
  required?: boolean
  inputRef?: React.Ref<HTMLInputElement>
  rightSlot?: React.ReactNode
}

const FloatLabelInput = ({
  id,
  label,
  type,
  name,
  value,
  onChange,
  autoComplete,
  required,
  inputRef,
  rightSlot,
}: FloatLabelInputProps) => {
  const [focused, setFocused] = useState(false)
  const lifted = focused || value.length > 0

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={clsx(
          'absolute left-4 pointer-events-none transition-all duration-200 z-10',
          lifted
            ? 'top-2 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400'
            : 'top-1/2 -translate-y-1/2 text-[13px] font-medium text-neutral-400',
        )}
      >
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={autoComplete}
        required={required}
        className={clsx(
          'w-full h-14 bg-neutral-50 border px-4 pt-5 pb-2 text-sm text-neutral-900 outline-none transition-all duration-200',
          rightSlot ? 'pr-12' : '',
          focused ? 'border-neutral-900 bg-white' : 'border-neutral-100 hover:border-neutral-200',
        )}
      />
      {rightSlot && <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightSlot}</div>}
    </div>
  )
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>('login')
  const [dir, setDir] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const { login, signup } = useAuth()

  const switchMode = (next: AuthMode) => {
    setDir(next === 'login' ? -1 : 1)
    setMode(next)
    setError(null)
    setFormData({ name: '', email: '', password: '' })
    setShowPassword(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError(null)
  }

  useEffect(() => {
    if (isOpen) {
      setMode('login')
      setError(null)
      setFormData({ name: '', email: '', password: '' })
      setShowPassword(false)
      setTimeout(() => firstInputRef.current?.focus(), 380)
    }
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (mode === 'login') {
        await login({ email: formData.email, password: formData.password })
      } else {
        await signup({ email: formData.email, password: formData.password, name: formData.name })
      }
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      const { signIn } = await import('next-auth/react')
      await signIn('google', { callbackUrl: '/' })
    } catch {
      setError('Google sign-in failed. Please try again.')
      setIsGoogleLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] bg-black/65 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Centering shell — not pointer-events blocking */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="modal"
              variants={PANEL_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="exit"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.4}
              onDragEnd={(_e, info) => {
                if (info.offset.y > 100) onClose()
              }}
              className="relative w-full max-w-[400px] bg-white pointer-events-auto overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label={mode === 'login' ? 'Sign in to your account' : 'Create your account'}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-neutral-900" />

              {/* Close button */}
              <button
                type="button"
                className="absolute top-4 right-4 z-10 text-neutral-900 transition-colors hover:text-red-500"
                onClick={onClose}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* ── Header ── */}
              <div className="px-8 pt-9 pb-6 border-b border-neutral-100">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 bg-neutral-900 flex items-center justify-center flex-shrink-0">
                    <Image
                      src={IconBlack}
                      alt="WEARVINE"
                      width={16}
                      height={16}
                      className="invert object-contain"
                    />
                  </div>
                  <div className="flex-1 h-px bg-neutral-100" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-400">
                    WEARVINE
                  </span>
                </div>

                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div
                    key={mode + '-header'}
                    custom={dir}
                    variants={SLIDE_VARIANTS}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    <h2 className="text-[22px] font-black tracking-tight text-neutral-900 leading-none">
                      {mode === 'login' ? 'Welcome back' : 'Create account'}
                    </h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mt-1.5">
                      {mode === 'login'
                        ? 'Sign in to continue shopping'
                        : 'Join the WEARVINE family'}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ── Body ── */}
              <div className="px-8 py-7">
                {/* Google */}
                <Button
                  asChild
                  variant="outlined"
                  fullWidth
                  loading={isGoogleLoading}
                  onClick={handleGoogleSignIn}
                  leftIcon={
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.25.81-.59z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  }
                  className="h-11 text-[10px] uppercase tracking-[0.15em] font-black"
                >
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                  >
                    Continue with Google
                  </motion.button>
                </Button>

                {/* Divider */}
                <div className="relative flex items-center my-6">
                  <div className="flex-1 h-px bg-neutral-100" />
                  <span className="px-4 text-[9px] font-black uppercase tracking-[0.25em] text-neutral-300">
                    or
                  </span>
                  <div className="flex-1 h-px bg-neutral-100" />
                </div>

                {/* Form — slides in/out between modes */}
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.form
                    key={mode}
                    custom={dir}
                    variants={SLIDE_VARIANTS}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-3"
                  >
                    {mode === 'signup' && (
                      <FloatLabelInput
                        id="name"
                        label="Full name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        autoComplete="name"
                        required
                        inputRef={firstInputRef}
                      />
                    )}

                    <FloatLabelInput
                      id="email"
                      label="Email address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      autoComplete="email"
                      required
                      inputRef={mode === 'login' ? firstInputRef : undefined}
                    />

                    <FloatLabelInput
                      id="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      required
                      rightSlot={
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className="text-neutral-400"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      }
                    />

                    {mode === 'login' && (
                      <div className="flex justify-end">
                        <Button
                          asChild
                          variant="text"
                          className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-neutral-900 active:text-neutral-900 transition-colors"
                        >
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                          >
                            Forgot password?
                          </motion.button>
                        </Button>
                      </div>
                    )}

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-[11px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-4 py-3">
                            {error}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit CTA */}
                    <Button
                      asChild
                      variant="primary"
                      fullWidth
                      loading={isLoading}
                      rightIcon={
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                      }
                      className="group h-12 px-5 text-[10px] font-black uppercase tracking-[0.25em] mt-1"
                    >
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                      >
                        {mode === 'login' ? 'Sign in' : 'Create account'}
                      </motion.button>
                    </Button>
                  </motion.form>
                </AnimatePresence>
              </div>

              {/* ── Footer ── */}
              <div className="px-8 pb-7 pt-0">
                <div className="h-px bg-neutral-100 mb-5" />
                <p className="text-[11px] text-neutral-400 text-center">
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <Button
                    asChild
                    variant="link"
                    onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                    className="font-black text-neutral-900 uppercase tracking-wider hover:opacity-50 active:opacity-50 transition-opacity ml-1"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                    >
                      {mode === 'login' ? 'Sign up' : 'Sign in'}
                    </motion.button>
                  </Button>
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
