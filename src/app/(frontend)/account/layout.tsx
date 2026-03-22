import React from 'react'

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <div className="flex-1 container mx-auto px-4 lg:px-6 py-12 pb-24">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-12">
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  )
}

