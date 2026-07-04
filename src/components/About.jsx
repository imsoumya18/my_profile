import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useInView } from 'framer-motion'
import { Briefcase, GraduationCap, MapPin, GitBranch } from 'lucide-react'
import profile from '../data/profile.json'
import SectionTag from './SectionTag'
import Doodle from './Doodle'

gsap.registerPlugin(ScrollTrigger)

const { about } = profile

const ICON_MAP = { Briefcase, GraduationCap, MapPin, GitBranch }

function WordReveal({ text }) {
  const containerRef = useRef(null)
  const words = text.split(' ')

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const els = containerRef.current.querySelectorAll('[data-w]')
      gsap.fromTo(
        els,
        { color: '#ddd0ae' },
        {
          color: '#241c10',
          stagger: 0.04,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            end: 'bottom 35%',
            scrub: 1,
          },
        },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <p
      ref={containerRef}
      className="font-syne font-bold leading-tight"
      style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
    >
      {words.map((w, i) => (
        <span key={i} data-w="" style={{ color: '#ddd0ae' }}>
          {w}{' '}
        </span>
      ))}
    </p>
  )
}

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" ref={ref} className="relative overflow-hidden py-20 px-5 sm:px-8" style={{ background: '#fdf9f0' }}>
      <div className="absolute cyber-grid pointer-events-none" aria-hidden="true" />
      <div className="hidden lg:block absolute pointer-events-none" style={{ right: '5%', top: '10%' }}>
        <Doodle type="coffee" size={84} rotate={-6} opacity={0.36} />
      </div>
      <div className="hidden lg:block absolute pointer-events-none" style={{ left: '4%', bottom: '8%' }}>
        <Doodle type="book" size={78} rotate={7} opacity={0.34} />
      </div>
      <div className="hidden lg:block absolute pointer-events-none" style={{ right: '10%', bottom: '16%' }}>
        <Doodle type="brackets" size={60} rotate={12} opacity={0.31} />
      </div>
      <div className="max-w-7xl mx-auto relative">
        <div className="divider mb-12" />
        <div className="lg:hidden flex items-center justify-between mb-12">
          <span className="label">01 — About</span>
        </div>

        <div className="lg:grid lg:grid-cols-[160px_1fr] lg:gap-x-12">
          <SectionTag number="01" label="About" />
          <div>

        <div className="mb-16 max-w-4xl relative">
          <WordReveal text={about.statement} />
          <span className="note hidden md:inline-block" style={{
            position: 'absolute', right: '-2%', bottom: '-2.4em',
            transform: 'rotate(-3deg)', color: '#a85e12', fontSize: '17px',
          }}>
            — most days, anyway
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8">
          {about.facts.map((f, i) => {
            const Icon = ICON_MAP[f.icon]
            const rot = [-2, 1.5, -1.5, 2][i % 4]
            const aside = ['', '', '', '(4 PRs, 0 merge conflicts. Okay, 1.)'][i % 4]
            return (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="col-span-2 relative p-6 transition-all duration-300 hover-lift"
                style={{ background: '#f6efdd', border: '1px solid #e6dabd', boxShadow: '3px 5px 0 rgba(36,28,16,0.08)', transform: `rotate(${rot}deg)` }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d6870f' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e6dabd' }}
              >
                <div style={{
                  position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%) rotate(-2deg)',
                  width: 60, height: 20, background: 'rgba(214,135,15,0.26)', border: '1px solid rgba(168,94,18,0.2)',
                }} />
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: '#fdf9f0', border: '1px solid #e6dabd' }}
                >
                  <Icon size={16} style={{ color: '#6b5d46' }} strokeWidth={1.5} />
                </div>
                <div className="label mb-2">{f.label}</div>
                <div className="font-grotesk text-sm font-medium" style={{ color: '#241c10' }}>{f.value}</div>
                <div className="font-grotesk text-xs mt-1" style={{ color: '#8a7a5e' }}>{f.sub}</div>
                {aside && (
                  <div className="note absolute" style={{ left: 12, bottom: -26, color: '#a85e12', fontSize: '13px', transform: 'rotate(-1.5deg)' }}>
                    {aside}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
          </div>
        </div>
      </div>
    </section>
  )
}
