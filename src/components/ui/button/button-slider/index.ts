import { gsap } from 'gsap'
import type { RefObject } from 'react'

// Matches the CSS icon-enter animation from the SCSS spec:
// A colored fill slides in from the left on hover (orange fill sweeps in).
// On mobile: pointerdown → scale + brightness boost, pointerup → revert.
// Passive float animation runs continuously on mobile.

export function attachSliderAnimation(
  btnRef: RefObject<HTMLButtonElement | null>,
): (() => void) | undefined {
  const el = btnRef.current
  if (!el) return

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia()

    // ─── Desktop (pointer: fine) ──────────────────────────────────────────────
    mm.add('(pointer: fine)', () => {
      // Create a fill overlay that slides in from left
      const fill = document.createElement('span')
      fill.setAttribute('aria-hidden', 'true')
      fill.style.cssText = `
        position: absolute;
        inset: 0;
        background: var(--color-button-primary, #EB9532);
        transform: translateX(-100%);
        pointer-events: none;
        z-index: 0;
        border-radius: inherit;
      `
      el.style.overflow = 'hidden'
      el.prepend(fill)

      const enterAnim = gsap.to(fill, {
        xPercent: 0,
        duration: 0.28,
        ease: 'power2.out',
        paused: true,
      })

      // Icon color flip on hover
      const iconEl = el.querySelector<HTMLElement>('[data-slot="icon"], svg, i')

      const onEnter = () => {
        enterAnim.play()
        if (iconEl) gsap.to(iconEl, { color: '#fff', duration: 0.2, ease: 'power1.out' })
      }
      const onLeave = () => {
        enterAnim.reverse()
        if (iconEl) gsap.to(iconEl, { color: '', duration: 0.2, ease: 'power1.out' })
      }

      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)

      return () => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
        fill.remove()
      }
    })

    // ─── Mobile (pointer: coarse) ─────────────────────────────────────────────
    mm.add('(pointer: coarse)', () => {
      // Passive float
      const floatTween = gsap.to(el, {
        yPercent: -3,
        duration: 2.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      // Tap interaction
      const onDown = () => {
        gsap.to(el, {
          scale: 1.04,
          filter: 'brightness(1.15)',
          duration: 0.18,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
      const onUp = () => {
        gsap.to(el, {
          scale: 1,
          filter: 'brightness(1)',
          duration: 0.3,
          ease: 'elastic.out(1, 0.5)',
          overwrite: 'auto',
        })
      }

      el.addEventListener('pointerdown', onDown)
      el.addEventListener('pointerup', onUp)
      el.addEventListener('pointercancel', onUp)

      return () => {
        floatTween.kill()
        el.removeEventListener('pointerdown', onDown)
        el.removeEventListener('pointerup', onUp)
        el.removeEventListener('pointercancel', onUp)
      }
    })

    // ─── Reduced motion ───────────────────────────────────────────────────────
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(el, { clearProps: 'all' })
    })
  }, el)

  return () => ctx.revert()
}