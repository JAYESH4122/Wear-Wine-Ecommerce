// 'use client'

// import { useState, useEffect } from 'react'
// import { LogoAnimation } from '@/animations/logo-animation'
// import { motion, AnimatePresence } from 'framer-motion'

// interface HomeClientProps {
//   children: React.ReactNode
// }

// export const HomeClient = ({ children }: HomeClientProps) => {
//   const [showIntro, setShowIntro] = useState(true)
//   const [isAnimationComplete, setIsAnimationComplete] = useState(false)
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   const handleAnimationComplete = () => {
//     setIsAnimationComplete(true)
//     setTimeout(() => setShowIntro(false), 100)
//   }

//   if (!mounted) {
//     return <div className="opacity-0">{children}</div>
//   }

//   return (
//     <>
//       <AnimatePresence mode="wait">
//         {showIntro && (
//           <motion.div
//             key="intro"
//             initial={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.5, ease: 'easeInOut' }}
//             className="fixed inset-0 z-[100] bg-black"
//           >
//             <LogoAnimation onComplete={handleAnimationComplete} />
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: isAnimationComplete ? 1 : 0 }}
//         transition={{ duration: 0.8, ease: 'easeOut' }}
//       >
//         {children}
//       </motion.div>
//     </>
//   )
// }
