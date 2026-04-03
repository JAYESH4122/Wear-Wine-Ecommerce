'use client'

import { X } from 'lucide-react'
import Image from 'next/image'

interface Props {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
}

export const SizeChartModal = ({ isOpen, onClose, imageUrl }: Props) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 bg-white w-full sm:max-w-md sm:mx-4 shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-900">
            Size Guide
          </h3>
          <button
            onClick={onClose}
            aria-label="Close size guide"
            className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">
          {imageUrl ? (
            <div className="relative w-full aspect-[4/5]">
              <Image
                src={imageUrl}
                alt="Size chart"
                fill
                sizes="(max-width: 640px) 100vw, 400px"
                className="object-contain"
              />
            </div>
          ) : (
            <p className="text-sm text-neutral-500">Size chart unavailable.</p>
          )}
        </div>
        <div className="p-5 border-t border-neutral-100">
          <button
            onClick={onClose}
            className="w-full h-11 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-[0.18em] hover:bg-neutral-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
