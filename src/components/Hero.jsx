import { useRef, Suspense } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import HeroCanvas from './HeroCanvas'
import profile from '../data/profile.json'
import profilePortrait from '../assets/images/profile-portrait.jpg'

const { personal, heroStats } = profile

const lineVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.4 + i * 0.12, duration: 1, ease: [0.22, 1, 0.36, 1] },
  }),
}

const statRot = [-2, 1.5, -1, 2]

export default function Hero() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })

  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const contentY       = useTransform(scrollYProgress, [0, 0.55], [0, -70])
  const canvasOpacity  = useTransform(scrollYProgress, [0, 0.55], [0.6, 0])

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 lg:pt-24 lg:pb-16"
      style={{ background: '#fdf9f0', overflow: 'hidden' }}
    >
      {/* Neural net canvas */}
      <motion.div style={{ opacity: canvasOpacity, zIndex: 1 }} className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Suspense fallback={null}><HeroCanvas /></Suspense>
      </motion.div>

      {/* Hero content */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col-reverse lg:flex-row lg:items-center gap-12 lg:gap-16"
      >
        <div className="w-full lg:max-w-[54%]">

          {/* Status badge */}
          <motion.div custom={0} variants={lineVariants} initial="hidden" animate="visible" className="mb-12">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full"
              style={{ background: '#f6efdd', border: '1px solid #e6dabd' }}
            >
              <span className="relative flex w-2 h-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50"
                  style={{ background: '#d6870f' }} />
                <span className="relative inline-flex w-2 h-2 rounded-full" style={{ background: '#d6870f' }} />
              </span>
              <span className="font-grotesk text-xs font-medium tracking-wide" style={{ color: '#3a2f1f' }}>
                Currently @ {personal.currentCompany} · {personal.location}
              </span>
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1 custom={1} variants={lineVariants} initial="hidden" animate="visible"
            className="display-xl scribble-underline" style={{ color: '#241c10' }}
          >
            {personal.nickname}
            <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
              <path d="M2 12 Q 50 20 100 10 T 198 9" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </motion.h1>

          {/* Tagline */}
          <motion.p custom={2} variants={lineVariants} initial="hidden" animate="visible"
            className="body-lg mt-10 mb-8" style={{ maxWidth: '380px' }}
          >
            {personal.tagline}
          </motion.p>

          {/* CTAs */}
          <motion.div custom={3} variants={lineVariants} initial="hidden" animate="visible"
            className="flex items-center gap-6 mb-4"
          >
            <button
              onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="font-grotesk text-sm text-white px-6 py-3 rounded-full transition-all duration-300"
              style={{ background: '#241c10' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#4a3d28' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#241c10' }}
            >
              View Projects
            </button>
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="font-grotesk text-sm transition-colors duration-300"
              style={{ color: '#8a7a5e' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#d6870f' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#8a7a5e' }}
            >
              Get in touch →
            </button>
          </motion.div>
          <motion.p custom={3} variants={lineVariants} initial="hidden" animate="visible"
            className="note mb-10" style={{ color: '#a85e12', fontSize: '15px', transform: 'rotate(-1deg)' }}
          >
            (replies faster than my code compiles)
          </motion.p>

          {/* Stats — pinned scrap notes */}
          <motion.div
            custom={4} variants={lineVariants} initial="hidden" animate="visible"
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 max-w-lg"
          >
            {heroStats.map((s, i) => (
              <div key={s.l}
                className="relative p-4 text-center"
                style={{ background: '#f6efdd', border: '1px solid #e6dabd', boxShadow: '3px 4px 0 rgba(36,28,16,0.08)', transform: `rotate(${statRot[i % statRot.length]}deg)` }}
              >
                <span style={{
                  position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)',
                  width: 12, height: 12, borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 30%, #f0a840, #a85e12 70%)',
                  boxShadow: '0 2px 3px rgba(36,28,16,0.2)',
                }} />
                <div className="hand text-3xl" style={{ color: '#241c10' }}>{s.n}</div>
                <div className="label mt-0.5">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Hanging photo — pinned to the page like a scrap on the wall */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end lg:flex-shrink-0">
          <div className="relative" style={{ width: 'min(320px, 72vw)', transform: 'rotate(3deg)' }}>
            <div style={{
              position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%) rotate(2deg)',
              width: 88, height: 26, background: 'rgba(214,135,15,0.3)', border: '1px solid rgba(168,94,18,0.22)', zIndex: 2,
            }} />
            <div style={{ background: '#fffdf7', padding: '12px 12px 46px', boxShadow: '0 22px 45px rgba(36,28,16,0.22), 0 3px 6px rgba(36,28,16,0.12)' }}>
              <div style={{
                aspectRatio: '4 / 5',
                backgroundImage: `url(${profilePortrait})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'grayscale(100%) contrast(1.05)',
              }} />
              <div className="note text-center" style={{ marginTop: '10px', color: '#a85e12', fontSize: '15px' }}>
                Hyderabad · still debugging
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
