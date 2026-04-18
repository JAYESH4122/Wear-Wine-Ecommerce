'use client'

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, Info } from 'lucide-react'
import { Button } from './button/Button'
import { cn } from '@/lib/utils'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

const variantConfig = {
  danger: {
    bar: 'bg-red-500',
    icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
    confirmClass: 'bg-red-500 hover:bg-red-600 text-white',
  },
  warning: {
    bar: 'bg-amber-400',
    icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    confirmClass: 'bg-amber-500 hover:bg-amber-600 text-white',
  },
  info: {
    bar: 'bg-blue-500',
    icon: <Info className="w-5 h-5 text-blue-500" />,
    confirmClass: 'bg-blue-500 hover:bg-blue-600 text-white',
  },
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const config = variantConfig[variant]

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-[1px]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[420px] bg-white shadow-2xl pointer-events-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top accent bar */}
              <div className={cn('h-[3px] w-full', config.bar)} />

              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    {config.icon}
                    <h3 className="text-sm font-black uppercase tracking-[0.18em] text-neutral-900">
                      {title}
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 -mr-1 text-neutral-400 hover:text-neutral-900 active:text-neutral-900 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Divider */}
                <div className="h-px bg-neutral-100 mb-5" />

                {/* Message */}
                <p className="text-[14px] text-neutral-600 leading-relaxed mb-7">
                  {message}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={onClose}
                    className="h-10 px-5 text-[11px] font-black uppercase tracking-[0.15em] text-neutral-600 border border-neutral-200 hover:border-neutral-400 hover:text-neutral-900 active:border-neutral-400 active:text-neutral-900 transition-colors"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={() => {
                      onConfirm()
                      onClose()
                    }}
                    className={cn(
                      'h-10 px-5 text-[11px] font-black uppercase tracking-[0.15em] transition-colors',
                      config.confirmClass
                    )}
                  >
                    {confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}