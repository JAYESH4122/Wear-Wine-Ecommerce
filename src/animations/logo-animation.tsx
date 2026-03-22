import { useEffect, useRef, useState } from "react"

export const LogoAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<SVGSVGElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const lineLeftRef = useRef<HTMLDivElement>(null)
  const lineRightRef = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (hasAnimated || !iconRef.current) return

    const paths = iconRef.current.querySelectorAll('.draw-path')
    const fills = iconRef.current.querySelectorAll('.fill-path')

    gsap.set(paths, { drawSVG: '0%', opacity: 1 })
    gsap.set(fills, { opacity: 0 })
    gsap.set(nameRef.current, { opacity: 0, y: 30 })
    gsap.set(taglineRef.current, { opacity: 0, y: 20 })
    gsap.set([lineLeftRef.current, lineRightRef.current], { scaleX: 0 })

    const tl = gsap.timeline({
      onComplete: () => setHasAnimated(true),
    })

    tl.to(paths, {
      drawSVG: '100%',
      duration: 1.8,
      stagger: 0.2,
      ease: 'power2.inOut',
    })
      .to(
        fills,
        {
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        },
        '-=0.8'
      )
      .to(
        [lineLeftRef.current, lineRightRef.current],
        {
          scaleX: 1,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.3'
      )
      .to(
        nameRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.5'
      )
      .to(
        taglineRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
        },
        '-=0.4'
      )
  }, [hasAnimated])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-6"
    >
      <svg
        ref={iconRef}
        viewBox="140 40 170 150"
        className="w-[120px] h-[100px] lg:w-[180px] lg:h-[150px] mb-6"
        xmlns="http://www.w3.org/2000/svg"
      >
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

      <div className="flex items-center gap-4 mb-4">
        <div ref={lineLeftRef} className="w-12 h-[1px] bg-white/50 origin-right" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
        <div ref={lineRightRef} className="w-12 h-[1px] bg-white/50 origin-left" />
      </div>

      <div ref={nameRef}>
        <h1 className="font-serif text-[clamp(36px,8vw,72px)] font-light tracking-[0.08em] text-white leading-none">
          WEARVINE
        </h1>
      </div>

      <div ref={taglineRef} className="mt-4">
        <p className="text-[clamp(10px,2vw,14px)] tracking-[0.35em] text-white/60 uppercase font-light">
          Where drip takes root
        </p>
      </div>
    </div>
  )
}