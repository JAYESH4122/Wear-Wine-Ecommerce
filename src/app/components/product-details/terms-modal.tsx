'use client'

import { X, FileText } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const TermsModal = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 bg-white w-full sm:max-w-lg sm:mx-4 shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-neutral-900" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-900">
              Terms & Conditions
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 max-h-[50vh] overflow-y-auto space-y-4 text-sm text-neutral-500 leading-relaxed">
          <p className="font-semibold text-neutral-900">1. Shipping Policy</p>
          <p>Standard delivery takes 3–5 business days. International shipping may vary based on location.</p>
          <p className="font-semibold text-neutral-900">2. Returns & Exchanges</p>
          <p>Items must be returned in original condition within 30 days. Sale items are final purchase.</p>
          <p className="font-semibold text-neutral-900">3. Privacy & Security</p>
          <p>Your data is encrypted. We do not store full credit card details on our servers.</p>
        </div>
        <div className="p-5 border-t border-neutral-100">
          <button
            onClick={onClose}
            className="w-full h-11 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-[0.18em] hover:bg-neutral-700 transition-colors duration-200"
          >
            Accept and Close
          </button>
        </div>
      </div>
    </div>
  )
}