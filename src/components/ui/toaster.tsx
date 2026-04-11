'use client'

import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'

export const AppToaster = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <Toaster
      position={isMobile ? 'bottom-center' : 'top-right'}
      richColors
      closeButton
      expand={false}
      visibleToasts={3}
      gap={10}
      offset={isMobile ? 12 : 20}
      mobileOffset={12}
      toastOptions={{
        duration: 3200,
        classNames: {
          toast:
            'group rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-[0_14px_30px_rgba(0,0,0,0.08)] px-3 py-3 sm:px-4 sm:py-3',
          title: 'text-[12px] sm:text-[13px] font-semibold tracking-tight text-neutral-900',
          description: 'text-[11px] sm:text-[12px] text-neutral-500 mt-0.5',
          actionButton:
            'bg-neutral-900 text-white text-[11px] px-3 py-1.5 rounded-md hover:bg-neutral-800 transition-colors',
          cancelButton:
            'bg-neutral-100 text-neutral-700 text-[11px] px-3 py-1.5 rounded-md hover:bg-neutral-200 transition-colors',
          closeButton:
            'border border-neutral-200 bg-white text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50',
          success:
            'border-emerald-200/80 bg-emerald-50/40 text-emerald-900 [&_[data-icon]]:text-emerald-600',
          error: 'border-rose-200/80 bg-rose-50/35 text-rose-900 [&_[data-icon]]:text-rose-600',
          warning:
            'border-amber-200/80 bg-amber-50/40 text-amber-900 [&_[data-icon]]:text-amber-600',
          info: 'border-blue-200/80 bg-blue-50/35 text-blue-900 [&_[data-icon]]:text-blue-600',
        },
        style: {
          width: isMobile ? 'min(92vw, 420px)' : '380px',
          maxWidth: '92vw',
        },
      }}
    />
  )
}
