'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { X, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { toast } from 'sonner'
import { clsx } from 'clsx'
import { IconBlack } from 'assets'
import { useAuth } from '@/providers/auth'
import { Button } from '@/components/ui/button/Button'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

type AuthMode = 'login' | 'signup'
type FormField = 'name' | 'email' | 'password'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

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
  disabled?: boolean
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  error?: string
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
  disabled,
  onBlur,
  error,
}: FloatLabelInputProps) => {
  const [focused, setFocused] = useState(false)
  const lifted = focused || value.length > 0

  return (
    <div>
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
          onBlur={(e) => {
            setFocused(false)
            onBlur?.(e)
          }}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={clsx(
            'w-full h-14 bg-neutral-50 border px-4 pt-5 pb-2 text-sm text-neutral-900 outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:bg-neutral-100',
            rightSlot ? 'pr-12' : '',
            error
              ? 'border-rose-300 bg-rose-50'
              : focused
                ? 'border-neutral-900 bg-white'
                : 'border-neutral-100 hover:border-neutral-200',
          )}
        />
        {rightSlot && <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightSlot}</div>}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-[11px] font-bold text-rose-500">
          {error}
        </p>
      )}
    </div>
  )
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const hasGoogleClient = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
  const [mode, setMode] = useState<AuthMode>('login')
  const [dir, setDir] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FormField, string>>>({})
  const firstInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const { login, signup, loginWithGoogleCredential } = useAuth()

  const isAuthenticating = isLoading || isGoogleLoading

  const normalizeEmail = (email: string) => email.trim().toLowerCase()

  const validateField = (field: FormField, value: string): string | null => {
    if (field === 'name') {
      if (mode === 'signup' && !value.trim()) return 'Name is required'
      return null
    }

    if (field === 'email') {
      const normalizedEmail = normalizeEmail(value)
      if (!normalizedEmail) return 'Email is required'
      if (!EMAIL_REGEX.test(normalizedEmail)) return 'Please enter a valid email address'
      return null
    }

    const trimmedPassword = value.trim()
    if (!trimmedPassword) return 'Password is required'
    if (trimmedPassword.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
    }
    return null
  }

  const validateForm = () => {
    const fieldsToValidate: FormField[] =
      mode === 'signup' ? ['name', 'email', 'password'] : ['email', 'password']
    const nextErrors: Partial<Record<FormField, string>> = {}

    for (const field of fieldsToValidate) {
      const error = validateField(field, formData[field])
      if (error) nextErrors[field] = error
    }

    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const mapLoginError = (rawMessage: unknown): string => {
    const message = typeof rawMessage === 'string' ? rawMessage.toLowerCase() : ''

    if (
      message.includes('no account') ||
      message.includes('user not found') ||
      message.includes('email not found') ||
      message.includes('not found')
    ) {
      return 'No account found with this email'
    }

    if (
      message.includes('incorrect password') ||
      message.includes('invalid password') ||
      message.includes('wrong password') ||
      message.includes('invalid email or password')
    ) {
      return 'Incorrect password'
    }

    return 'Something went wrong. Please try again'
  }

  const mapSignupError = (rawMessage: unknown): string => {
    const message = typeof rawMessage === 'string' ? rawMessage.toLowerCase() : ''

    if (
      message.includes('already exists') ||
      message.includes('already registered') ||
      message.includes('email already') ||
      message.includes('duplicate')
    ) {
      return 'An account with this email already exists'
    }

    if (
      message.includes('invalid') ||
      message.includes('required') ||
      message.includes('weak') ||
      message.includes('password')
    ) {
      return 'Please check your details and try again'
    }

    return 'Something went wrong. Please try again'
  }

  const switchMode = (next: AuthMode) => {
    setDir(next === 'login' ? -1 : 1)
    setMode(next)
    setAuthError(null)
    setSuccessMessage(null)
    setFieldErrors({})
    setFormData({ name: '', email: '', password: '' })
    setShowPassword(false)
    setTimeout(() => firstInputRef.current?.focus(), 260)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name as FormField
    const value = e.target.value

    setFormData((prev) => ({ ...prev, [fieldName]: value }))
    setFieldErrors((prev) => {
      if (!prev[fieldName]) return prev
      const next = { ...prev }
      delete next[fieldName]
      return next
    })
    if (authError) setAuthError(null)
    if (successMessage) setSuccessMessage(null)
  }

  const handleFieldBlur = (field: FormField) => {
    const error = validateField(field, formData[field])
    setFieldErrors((prev) => {
      if (!error && !prev[field]) return prev
      const next = { ...prev }
      if (error) next[field] = error
      else delete next[field]
      return next
    })
  }

  useEffect(() => {
    if (isOpen) {
      setMode('login')
      setAuthError(null)
      setSuccessMessage(null)
      setFieldErrors({})
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
    if (isAuthenticating) return
    if (!validateForm()) {
      setAuthError(null)
      return
    }

    const email = normalizeEmail(formData.email)
    const password = formData.password.trim()
    const name = formData.name.trim()

    setIsLoading(true)
    setAuthError(null)
    setSuccessMessage(null)

    try {
      if (mode === 'login') {
        await login({ email, password })
        toast.success('Signed in successfully.')
        onClose()
      } else {
        await signup({ email, password, name })
        setSuccessMessage('Account created successfully')
        toast.success('Account created successfully.')
        setTimeout(() => onClose(), 650)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : ''
      setAuthError(mode === 'login' ? mapLoginError(message) : mapSignupError(message))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async (credential?: string) => {
    if (isAuthenticating) return
    if (!credential) {
      setAuthError('Google sign-in failed. Please try again.')
      return
    }

    setIsGoogleLoading(true)
    setAuthError(null)
    setSuccessMessage(null)
    try {
      await loginWithGoogleCredential(credential)
      toast.success('Signed in with Google.')
      onClose()
    } catch {
      setAuthError('Google sign-in failed. Please try again.')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleContinueAsGuest = () => {
    toast.message('Continuing as guest.')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
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

          <div className="fixed inset-0 z-[201] flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
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
              className="relative w-full sm:max-w-[400px] bg-white pointer-events-auto overflow-hidden rounded-t-2xl sm:rounded-none"
              role="dialog"
              aria-modal="true"
              aria-label={mode === 'login' ? 'Sign in to your account' : 'Create your account'}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle — mobile only */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-neutral-200" />
              </div>

              {/* Top accent line — desktop only */}
              <div className="hidden sm:block absolute top-0 left-0 right-0 h-[2px] bg-neutral-900" />

              <button
                type="button"
                className="absolute top-4 right-4 z-10 text-neutral-900 transition-colors hover:text-red-500"
                onClick={onClose}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="px-6 sm:px-8 pt-5 sm:pt-9 pb-5 sm:pb-6 border-b border-neutral-100">
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
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
                    <h2 className="text-[20px] sm:text-[22px] font-black tracking-tight text-neutral-900 leading-none">
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

              {/* Body */}
              <div className="px-6 sm:px-8 py-5 sm:py-7">
                {/* Google loading indicator — only shown during Google sign-in */}
                <AnimatePresence>
                  {isGoogleLoading && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mb-4 flex items-center gap-2 border border-neutral-200 bg-neutral-50 px-3 py-2.5">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-neutral-500" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                          Signing in with Google...
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  {hasGoogleClient ? (
                    <GoogleLogin
                      text="continue_with"
                      shape="rectangular"
                      width="100%"
                      onSuccess={(credentialResponse) => {
                        if (isAuthenticating) return
                        void handleGoogleSignIn(credentialResponse.credential)
                      }}
                      onError={() => setAuthError('Google sign-in failed. Please try again.')}
                    />
                  ) : (
                    <Button
                      variant="outlined"
                      fullWidth
                      className="h-10 text-[10px] uppercase tracking-[0.15em] font-black"
                      disabled
                    >
                      Google Login Unavailable
                    </Button>
                  )}
                  <Button
                    onClick={handleContinueAsGuest}
                    variant="text"
                    fullWidth
                    className="h-10 text-[10px] uppercase tracking-[0.15em] font-black text-neutral-500 hover:text-neutral-900"
                    disabled={isAuthenticating}
                  >
                    Continue as Guest
                  </Button>
                </div>

                <div className="relative flex items-center my-5 sm:my-6">
                  <div className="flex-1 h-px bg-neutral-100" />
                  <span className="px-4 text-[9px] font-black uppercase tracking-[0.25em] text-neutral-300">
                    or
                  </span>
                  <div className="flex-1 h-px bg-neutral-100" />
                </div>

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
                        onBlur={() => handleFieldBlur('name')}
                        autoComplete="name"
                        required
                        inputRef={firstInputRef}
                        disabled={isAuthenticating}
                        error={fieldErrors.name}
                      />
                    )}

                    <FloatLabelInput
                      id="email"
                      label="Email address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('email')}
                      autoComplete="email"
                      required
                      inputRef={mode === 'login' ? firstInputRef : undefined}
                      disabled={isAuthenticating}
                      error={fieldErrors.email}
                    />

                    <FloatLabelInput
                      id="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('password')}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      required
                      disabled={isAuthenticating}
                      error={fieldErrors.password}
                      rightSlot={
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className="text-neutral-400"
                          disabled={isAuthenticating}
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
                          disabled={isAuthenticating}
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

                    <AnimatePresence>
                      {(authError || successMessage) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          {authError && (
                            <p className="text-[11px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-4 py-3">
                              {authError}
                            </p>
                          )}
                          {successMessage && (
                            <p className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-3">
                              {successMessage}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button
                      asChild
                      variant="primary"
                      fullWidth
                      loading={isLoading}
                      rightIcon={
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                      }
                      className="group h-12 px-5 text-[10px] font-black uppercase tracking-[0.25em] mt-1"
                      disabled={isAuthenticating}
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

              {/* Footer */}
              <div className="px-6 sm:px-8 pb-6 sm:pb-7 pt-0">
                <div className="h-px bg-neutral-100 mb-4 sm:mb-5" />
                <p className="text-[11px] text-neutral-400 text-center">
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <Button
                    asChild
                    variant="link"
                    onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                    className="font-black text-neutral-900 uppercase tracking-wider hover:opacity-50 active:opacity-50 transition-opacity ml-1"
                    disabled={isAuthenticating}
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
