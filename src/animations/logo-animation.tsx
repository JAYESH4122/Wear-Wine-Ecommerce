import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export const LogoAnimation = ({ onComplete }: { onComplete?: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (hasAnimated || !svgRef.current) return

    const paths = svgRef.current.querySelectorAll('.draw-path')
    const fills = svgRef.current.querySelectorAll('.fill-path')
    const brandLetters = brandRef.current ? brandRef.current.querySelectorAll('.brand-letter') : []
    const taglineWords = taglineRef.current ? taglineRef.current.querySelectorAll('.tagline-word') : []

    // Set up stroke dash for path drawing
    paths.forEach((path) => {
      const length = (path as SVGPathElement).getTotalLength()
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1,
      })
    })

    gsap.set(fills, { opacity: 0 })
    if (brandLetters.length > 0) gsap.set(brandLetters, { opacity: 0, y: 50, rotateX: -90 })
    if (taglineWords.length > 0) gsap.set(taglineWords, { opacity: 0, y: 20 })
    gsap.set(containerRef.current, { opacity: 1 })

    const tl = gsap.timeline({
      onComplete: () => {
        setHasAnimated(true)
        if (onComplete) onComplete()
      },
    })

    // Phase 1: Draw icon paths
    tl.to(paths, {
      strokeDashoffset: 0,
      duration: 2.2,
      stagger: 0.2,
      ease: 'power2.inOut',
    })
      // Phase 2: Fill in the icon
      .to(
        fills,
        {
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
        },
        '-=0.8',
      )
      // Phase 3: Animate brand letters one by one
      .to(
        brandLetters,
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'back.out(1.7)',
        },
        '-=0.3',
      )
      // Phase 4: Animate tagline words
      .to(
        taglineWords,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
        },
        '-=0.2',
      )
      // Hold for a moment
      .to({}, { duration: 1.5 })
      // Phase 5: Fade out everything
      .to(containerRef.current, {
        opacity: 0,
        scale: 0.95,
        filter: 'blur(10px)',
        duration: 1,
        ease: 'power2.inOut',
      })
  }, [hasAnimated])

  const brandName = 'WEARVINE'
  const tagline = ['Where', 'drip', 'takes', 'root']

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-6"
      style={{ opacity: 0 }}
    >
      {/* Logo Icon */}
      <svg
        ref={svgRef}
        viewBox="140 40 170 150"
        className="w-[100px] h-[85px] lg:w-[160px] lg:h-[135px] mb-8"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Draw paths (strokes) */}
        <path
          className="draw-path"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M189.8,124.75l-.09-.42a52.17,52.17,0,0,0-11.11-20,39,39,0,0,0-10-7.73,14.83,14.83,0,0,0-9.84-2.26,17.72,17.72,0,0,0-7.2,2.61A19.42,19.42,0,0,0,143,114.52a94.19,94.19,0,0,0,12.17,39.77,91.39,91.39,0,0,0,11.58,15.83c9.73,10,21.2,15,28.09,12.12a26.26,26.26,0,0,0,9.42-6.37c.49-.59,2.23-2.75,4.92-5.51.67-.68,1.23-1.23,1.59-1.59a157,157,0,0,0,13.18-21.86,158.8,158.8,0,0,0,14.48-45.18,21.45,21.45,0,0,0-2.32-14.63c-4-6.79-11.82-10.76-20.32-10.42a319.79,319.79,0,0,1-10.37,40.54,320.58,320.58,0,0,1-14.77,37.07c-1,2.12-4.56,9.42-11.15,10.43a11.53,11.53,0,0,1-2.58.05c-8.81-.94-17.42-21.11-18.42-23.51A59,59,0,0,1,154.7,120c.09-6.56.17-12.71,4.35-15.35a8.72,8.72,0,0,1,5.27-1.17,13.61,13.61,0,0,1,8.31,3.79A87.66,87.66,0,0,1,180,114.9,95.82,95.82,0,0,0,189.8,124.75Z"
        />
        <path
          className="draw-path"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M273.49,60.46a279.21,279.21,0,0,1-6.25,44.18c-3.1,13.78-7.15,31.27-17.83,51.68-3.25,6.19-6.32,11.15-8.55,14.57-3.38,5.78-8.8,9.3-13.75,8.6-4.1-.59-7.08-4-8.84-5.94a28.08,28.08,0,0,1-4.8-8.7c-1,1-1.71,3-2.73,3.92a62.53,62.53,0,0,0,12.88,19.13,61,61,0,0,0,8.43,7.11,21.43,21.43,0,0,0,9,2.29c11.93.3,20.94-10.36,27.36-18a79.71,79.71,0,0,0,11.3-17.66,211.27,211.27,0,0,0,12.45-30.85,212.4,212.4,0,0,0,9.21-47.93,20.73,20.73,0,0,0-2.26-9.55C294.82,65.1,284.85,60.32,273.49,60.46Z"
        />
        <path
          className="draw-path"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M225.27,53.18a15.07,15.07,0,0,0-1.91,8.3c.1,1.43.5,7,5,9.89,5.47,3.53,12,0,12.52-.32,4.76-2.69,6.18-7.47,6.7-9.25.46-1.54,1.92-6.49-.63-11.49-.55-1.07-3.05-6-7.74-6.56-3.56-.45-6.42,1.82-9.17,4A17.09,17.09,0,0,0,225.27,53.18Z"
        />

        {/* Fill paths */}
        <path
          className="fill-path"
          fill="white"
          d="M189.8,124.75l-.09-.42a52.17,52.17,0,0,0-11.11-20,39,39,0,0,0-10-7.73,14.83,14.83,0,0,0-9.84-2.26,17.72,17.72,0,0,0-7.2,2.61A19.42,19.42,0,0,0,143,114.52a94.19,94.19,0,0,0,12.17,39.77,91.39,91.39,0,0,0,11.58,15.83c9.73,10,21.2,15,28.09,12.12a26.26,26.26,0,0,0,9.42-6.37c.49-.59,2.23-2.75,4.92-5.51.67-.68,1.23-1.23,1.59-1.59a157,157,0,0,0,13.18-21.86,158.8,158.8,0,0,0,14.48-45.18,21.45,21.45,0,0,0-2.32-14.63c-4-6.79-11.82-10.76-20.32-10.42a319.79,319.79,0,0,1-10.37,40.54,320.58,320.58,0,0,1-14.77,37.07c-1,2.12-4.56,9.42-11.15,10.43a11.53,11.53,0,0,1-2.58.05c-8.81-.94-17.42-21.11-18.42-23.51A59,59,0,0,1,154.7,120c.09-6.56.17-12.71,4.35-15.35a8.72,8.72,0,0,1,5.27-1.17,13.61,13.61,0,0,1,8.31,3.79A87.66,87.66,0,0,1,180,114.9,95.82,95.82,0,0,0,189.8,124.75Z"
        />
        <path
          className="fill-path"
          fill="white"
          d="M273.49,60.46a279.21,279.21,0,0,1-6.25,44.18c-3.1,13.78-7.15,31.27-17.83,51.68-3.25,6.19-6.32,11.15-8.55,14.57-3.38,5.78-8.8,9.3-13.75,8.6-4.1-.59-7.08-4-8.84-5.94a28.08,28.08,0,0,1-4.8-8.7c-1,1-1.71,3-2.73,3.92a62.53,62.53,0,0,0,12.88,19.13,61,61,0,0,0,8.43,7.11,21.43,21.43,0,0,0,9,2.29c11.93.3,20.94-10.36,27.36-18a79.71,79.71,0,0,0,11.3-17.66,211.27,211.27,0,0,0,12.45-30.85,212.4,212.4,0,0,0,9.21-47.93,20.73,20.73,0,0,0-2.26-9.55C294.82,65.1,284.85,60.32,273.49,60.46Z"
        />
        <path
          className="fill-path"
          fill="white"
          d="M225.27,53.18a15.07,15.07,0,0,0-1.91,8.3c.1,1.43.5,7,5,9.89,5.47,3.53,12,0,12.52-.32,4.76-2.69,6.18-7.47,6.7-9.25.46-1.54,1.92-6.49-.63-11.49-.55-1.07-3.05-6-7.74-6.56-3.56-.45-6.42,1.82-9.17,4A17.09,17.09,0,0,0,225.27,53.18Z"
        />
      </svg>

      {/* Brand Name */}
      <div ref={brandRef} className="mb-3" style={{ perspective: '1000px' }}>
        <h1 className="font-serif text-[clamp(32px,7vw,64px)] font-light tracking-[0.12em] text-white leading-none flex">
          {brandName.split('').map((letter, i) => (
            <span
              key={i}
              className="brand-letter inline-block"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {letter}
            </span>
          ))}
        </h1>
      </div>

      {/* Tagline */}
      <div ref={taglineRef} className="flex gap-2">
        {tagline.map((word, i) => (
          <span
            key={i}
            className="tagline-word text-[clamp(9px,1.8vw,13px)] tracking-[0.3em] text-white/50 uppercase font-light"
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  )
}
