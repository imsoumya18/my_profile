import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import profile from '../data/profile.json'
import SectionTag from './SectionTag'
import Doodle from './Doodle'

const { experience } = profile

// A text block rises up and fades in over a slice of the row's scroll pass —
// used to stagger heading/role/tags/summary/bullets in one continuous motion
// rather than a single one-shot fade.
function useReveal(progress, start, end) {
  const y = useTransform(progress, [start, end], [34, 0])
  const opacity = useTransform(progress, [start, end], [0, 1])
  return { y, opacity }
}

function ExperienceRow({ exp, index }) {
  const ref = useRef(null)

  // Continuous scroll-linked motion — the two columns drift at slightly
  // different rates, and each text block rises into place as the row
  // passes through the viewport.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yLeft  = useTransform(scrollYProgress, [0, 1], [42, -42])
  const yRight = useTransform(scrollYProgress, [0, 1], [18, -18])
  const numOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.3, 1, 1, 0.3])

  const headingReveal = useReveal(scrollYProgress, 0, 0.3)
  const roleReveal    = useReveal(scrollYProgress, 0.05, 0.36)
  const tagsReveal    = useReveal(scrollYProgress, 0.1, 0.42)
  const metaReveal    = useReveal(scrollYProgress, 0.05, 0.34)
  const summaryReveal = useReveal(scrollYProgress, 0.14, 0.46)
  const bulletsReveal = useReveal(scrollYProgress, 0.2, 0.52)

  return (
    <div ref={ref} className="flex flex-col md:flex-row gap-6 md:gap-16 py-14">
      {/* Left: index + company + role + tags */}
      <motion.div className="w-full md:w-[40%] md:flex-shrink-0" style={{ y: yLeft }}>
        <motion.div className="label mb-5" style={{ opacity: numOpacity }}>{exp.index} of 04</motion.div>
        <motion.h2
          className="font-syne font-bold mb-2 relative inline-block"
          style={{ fontSize: 'clamp(24px, 3vw, 42px)', color: '#241c10', lineHeight: 1.05, y: headingReveal.y, opacity: headingReveal.opacity }}
        >
          {exp.company}
          {index === 0 && (
            <span className="note" style={{
              position: 'absolute', top: -14, right: '-3.2em',
              transform: 'rotate(8deg)', color: '#a85e12', fontSize: '15px', whiteSpace: 'nowrap',
            }}>
              still here!
            </span>
          )}
        </motion.h2>
        <motion.p className="font-grotesk text-sm mb-8" style={{ color: '#6b5d46', y: roleReveal.y, opacity: roleReveal.opacity }}>{exp.role}</motion.p>
        <motion.div className="flex flex-wrap gap-2" style={{ y: tagsReveal.y, opacity: tagsReveal.opacity }}>
          {exp.tags.map((t) => <span key={t} className="tag">{t}</span>)}
        </motion.div>
      </motion.div>

      {/* Right: period + summary + bullets */}
      <motion.div className="flex-1 min-w-0" style={{ y: yRight }}>
        <motion.div className="flex items-center gap-3 mb-6 flex-wrap" style={{ y: metaReveal.y, opacity: metaReveal.opacity }}>
          <span className="label">{exp.period}</span>
          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#ddd0ae' }} />
          <span className="label">{exp.location}</span>
        </motion.div>
        <motion.p className="font-grotesk text-sm leading-relaxed mb-8" style={{ color: '#6b5d46', maxWidth: '400px', y: summaryReveal.y, opacity: summaryReveal.opacity }}>
          {exp.summary}
        </motion.p>
        <motion.ul className="space-y-4" style={{ y: bulletsReveal.y, opacity: bulletsReveal.opacity }}>
          {exp.bullets.map((b, bi) => (
            <li key={bi} className="flex items-start gap-4">
              <span className="font-mono text-sm mt-0.5 flex-shrink-0" style={{ color: '#d6870f' }}>
                {String(bi + 1).padStart(2, '0')}
              </span>
              <span className="font-grotesk text-sm leading-relaxed" style={{ color: '#6b5d46' }}>{b}</span>
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </div>
  )
}

export default function Experience() {
  const listRef = useRef(null)
  const { scrollYProgress: fillProgress } = useScroll({
    target: listRef,
    offset: ['start 0.75', 'end 0.4'],
  })

  return (
    <section id="experience" className="relative overflow-hidden" style={{ background: '#fdf9f0' }}>
      <div className="absolute cyber-grid pointer-events-none" aria-hidden="true" />
      <div className="hidden lg:block absolute pointer-events-none" style={{ right: '4%', top: '8%' }}>
        <Doodle type="brackets" size={74} rotate={-6} opacity={0.34} />
      </div>
      <div className="hidden lg:block absolute pointer-events-none" style={{ left: '3%', top: '38%' }}>
        <Doodle type="compass" size={76} rotate={14} opacity={0.33} />
      </div>
      <div className="hidden lg:block absolute pointer-events-none" style={{ right: '8%', bottom: '10%' }}>
        <Doodle type="footprints" size={64} rotate={-8} opacity={0.32} />
      </div>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 relative">
        <div className="divider mb-8" />
        <div className="lg:hidden flex items-center justify-between mb-14">
          <span className="label">02 — Work History</span>
        </div>
        <div className="lg:grid lg:grid-cols-[160px_1fr] lg:gap-x-12">
          <SectionTag number="02" label="Work" />
          <div ref={listRef} className="relative">
            <div className="hidden lg:block absolute top-0 bottom-0 w-px" style={{ left: -24, background: '#e6dabd' }} />
            <motion.div
              className="hidden lg:block absolute top-0 w-px"
              style={{ left: -24, background: '#d6870f', height: '100%', scaleY: fillProgress, transformOrigin: 'top' }}
            />
            {experience.map((e, i) => (
              <div key={e.company}>
                <ExperienceRow exp={e} index={i} />
                {i < experience.length - 1 && <div className="divider" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
