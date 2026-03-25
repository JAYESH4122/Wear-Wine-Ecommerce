'use client'

import { type RefObject } from 'react'
import gsap from 'gsap'
import { cn } from '@/lib/utils'

export interface OverlayStripsProps {
  topRef: RefObject<HTMLSpanElement | null>
  bottomRef: RefObject<HTMLSpanElement | null>
  fillClass: string
}

export const OverlayStrips = ({ topRef, bottomRef, fillClass }: OverlayStripsProps) => (
  <>
    <span
      ref={topRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-x-0 top-0 z-0 h-0', fillClass)}
      style={{ willChange: 'height' }}
    />
    <span
      ref={bottomRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-x-0 bottom-0 z-0 h-0', fillClass)}
      style={{ willChange: 'height' }}
    />
  </>
)

// Each strip grows to 55% so they overlap at centre with no gap.
// expo.inOut = sharp, premium feel.
function animIn(top: HTMLSpanElement, bottom: HTMLSpanElement): void {
  gsap.to([top, bottom], { height: '55%', duration: 0.48, ease: 'expo.inOut', overwrite: true })
}

function animOut(top: HTMLSpanElement, bottom: HTMLSpanElement): void {
  gsap.to([top, bottom], { height: 0, duration: 0.42, ease: 'expo.inOut', overwrite: true })
}

// Returns cleanup fn for useEffect. Zero button movement — strips only.
export function attachOverlayAnimation(
  btnRef: RefObject<HTMLButtonElement | null>,
  topRef: RefObject<HTMLSpanElement | null>,
  bottomRef: RefObject<HTMLSpanElement | null>,
): () => void {
  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia()

    mm.add('(pointer: fine)', () => {
      const btn    = btnRef.current
      const top    = topRef.current
      const bottom = bottomRef.current
      if (!btn || !top || !bottom) return

      const onEnter = () => animIn(top, bottom)
      const onLeave = () => animOut(top, bottom)

      btn.addEventListener('mouseenter', onEnter)
      btn.addEventListener('mouseleave', onLeave)

      return () => {
        btn.removeEventListener('mouseenter', onEnter)
        btn.removeEventListener('mouseleave', onLeave)
      }
    })

    mm.add('(pointer: coarse)', () => {
      const btn    = btnRef.current
      const top    = topRef.current
      const bottom = bottomRef.current
      if (!btn || !top || !bottom) return

      const onDown = () => animIn(top, bottom)
      const onUp   = () => animOut(top, bottom)

      btn.addEventListener('pointerdown',   onDown, { passive: true })
      btn.addEventListener('pointerup',     onUp,   { passive: true })
      btn.addEventListener('pointercancel', onUp,   { passive: true })

      return () => {
        btn.removeEventListener('pointerdown',   onDown)
        btn.removeEventListener('pointerup',     onUp)
        btn.removeEventListener('pointercancel', onUp)
      }
    })
  }, btnRef)

  return () => ctx.revert()
}