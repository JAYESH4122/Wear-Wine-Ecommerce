'use client'

import { useState } from 'react'
import { LogoAnimation } from '@/animations/logo-animation'
import { motion, AnimatePresence } from 'framer-motion'

interface HomeClientProps {
  children: React.ReactNode
}

export const HomeClient = ({ children }: HomeClientProps) => {
  const [showIntro, setShowIntro] = useState(true)
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)

  // Use a small delay after animation complete for better transition
  const handleAnimationComplete = () => {
    setTimeout(() => {
      setIsAnimationComplete(true)
      // Fade out the intro overlay
      setTimeout(() => {
        setShowIntro(false)
      }, 800)
    }, 500)
  }

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed inset-0 z-[100] bg-black"
          >
            <LogoAnimation onComplete={handleAnimationComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isAnimationComplete ? 1 : 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </>
  )
}
