import { useEffect, useState } from 'react'

const BREAKPOINTS = {
  isMobile: '(max-width: 768px)',
  isTablet: '(min-width: 768px) and (max-width: 1023px)',
  isDesktop: '(min-width: 1024px)',
}

type BreakpointKey = keyof typeof BREAKPOINTS

type BreakpointFlags = {
  [key in BreakpointKey]: boolean
}

export const useResponsive = () => {
  const [state, setState] = useState<BreakpointFlags>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQueries = Object.entries(BREAKPOINTS).map<[BreakpointKey, MediaQueryList]>(
      ([key, query]) => [key as BreakpointKey, window.matchMedia(query)],
    )

    const update = () => {
      setState((prev) => {
        const updatedState: Partial<BreakpointFlags> = {}
        let isChanged = false

        for (const [key, mq] of mediaQueries) {
          updatedState[key] = mq.matches

          if (updatedState[key] !== prev[key]) {
            isChanged = true
          }
        }

        return isChanged ? (updatedState as BreakpointFlags) : prev
      })
    }

    update()

    mediaQueries.forEach(([, mq]) => {
      mq.addEventListener('change', update)
    })

    return () => {
      mediaQueries.forEach(([, mq]) => {
        mq.removeEventListener('change', update)
      })
    }
  }, [])

  return state
}
