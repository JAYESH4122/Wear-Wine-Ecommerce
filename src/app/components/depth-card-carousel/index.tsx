'use client'
import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const AUTOPLAY_INTERVAL = 5000

const SPRING = { stiffness: 120, damping: 14, mass: 1.2 }

const CONSTANTS = {
  CARD_WIDTH_DESKTOP: 480,
  CARD_WIDTH_MOBILE: '75%',
  CARD_HEIGHT_DESKTOP: 650,
  CARD_HEIGHT_MOBILE: 450,
  STK_X_SPREAD_DESKTOP: 320,
  STK_X_SPREAD_MOBILE_RIGHT: 45,
  STK_X_SPREAD_MOBILE_LEFT: 20,
  BORDER_RADIUS: '10px',
  BLUR_INTENSITY: 0.8,
  PERSPECTIVE: '2000px',
}

export interface CarouselCard {
  src: string
  title?: string
  description?: string
}

export interface DepthDeckCarouselProps {
  cards: CarouselCard[]
  className?: string
}

export const DepthDeckCarousel = ({ cards, className }: DepthDeckCarouselProps) => {
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const goTo = useCallback(
    (dir: number) => {
      setActive((prev) => (prev + dir + cards.length) % cards.length)
    },
    [cards.length],
  )

  useEffect(() => {
    const interval = setInterval(() => {
      goTo(1)
    }, AUTOPLAY_INTERVAL)
    return () => clearInterval(interval)
  }, [goTo])

  return (
    <div
      className={cn(
        'relative w-full bg-background select-none overflow-hidden flex flex-col items-center justify-center pb-10 lg:py-15',
        className,
      )}
    >
      <div className="relative w-full flex flex-col items-center">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, i) => (i.offset.x > 50 ? goTo(-1) : i.offset.x < -50 && goTo(1))}
          className="relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{
            height: isMobile
              ? CONSTANTS.CARD_HEIGHT_MOBILE + 100
              : CONSTANTS.CARD_HEIGHT_DESKTOP + 100,
            perspective: CONSTANTS.PERSPECTIVE,
            transformStyle: 'preserve-3d',
          }}
        >
          {cards.map((card, i) => {
            const rel = ((i - active + cards.length) % cards.length) - Math.floor(cards.length / 2)
            const abs = Math.abs(rel)
            const isCenter = rel === 0

            const xSpread = isMobile
              ? rel >= 0
                ? rel * CONSTANTS.STK_X_SPREAD_MOBILE_RIGHT
                : rel * CONSTANTS.STK_X_SPREAD_MOBILE_LEFT
              : rel * CONSTANTS.STK_X_SPREAD_DESKTOP

            return (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  x: xSpread,
                  z: -abs * 200,
                  rotateY: rel * -10,
                  scale: 1 - abs * 0.08,
                  opacity: abs > 2 ? 0 : 1,
                  filter: `blur(${abs * CONSTANTS.BLUR_INTENSITY}px) brightness(${1 - abs * 0.1})`,
                }}
                transition={{ type: 'spring', ...SPRING }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  'absolute overflow-hidden shadow-2xl bg-white',
                  isCenter ? 'z-50' : 'z-10',
                )}
                style={{
                  width: isMobile ? CONSTANTS.CARD_WIDTH_MOBILE : CONSTANTS.CARD_WIDTH_DESKTOP,
                  height: isMobile ? CONSTANTS.CARD_HEIGHT_MOBILE : CONSTANTS.CARD_HEIGHT_DESKTOP,
                  borderRadius: CONSTANTS.BORDER_RADIUS,
                  backfaceVisibility: 'hidden',
                }}
              >
                <motion.img
                  src={card.src}
                  animate={{ scale: hovered === i ? 1.05 : 1 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )
          })}
        </motion.div>

        <div className="flex items-center gap-10 hidden md:flex">
          <div className="flex gap-3">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-1000 ease-out',
                  i === active ? 'w-12 bg-black' : 'w-2 bg-gray-200',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
