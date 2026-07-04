import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import profile from '../data/profile.json'
import SectionTag from './SectionTag'

const { experience } = profile

function ExperienceRow({ exp, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col md:flex-row gap-6 md:gap-16 py-14"
    >
      {/* Left: index + company + role + tags */}
      <div className="w-full md:w-[40%] md:flex-shrink-0">
        <div className="label mb-5">{exp.index} of 04</div>
        <h2
          className="font-syne font-bold mb-2 relative inline-block"
          style={{ fontSize: 'clamp(24px, 3vw, 42px)', color: '#241c10', lineHeight: 1.05 }}
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
        </h2>
        <p className="font-grotesk text-xs mb-8" style={{ color: '#6b5d46' }}>{exp.role}</p>
        <div className="flex flex-wrap gap-2">
          {exp.tags.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
      </div>

      {/* Right: period + summary + bullets */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className="label">{exp.period}</span>
          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#ddd0ae' }} />
          <span className="label">{exp.location}</span>
        </div>
        <p className="font-grotesk text-xs leading-relaxed mb-8" style={{ color: '#6b5d46', maxWidth: '400px' }}>
          {exp.summary}
        </p>
        <ul className="space-y-4">
          {exp.bullets.map((b, bi) => (
            <li key={bi} className="flex items-start gap-4">
              <span className="font-mono text-xs mt-0.5 flex-shrink-0" style={{ color: '#d6870f' }}>
                {String(bi + 1).padStart(2, '0')}
              </span>
              <span className="font-grotesk text-xs leading-relaxed" style={{ color: '#6b5d46' }}>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="relative" style={{ background: '#fdf9f0' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div className="divider mb-8" />
        <div className="lg:hidden flex items-center justify-between mb-14">
          <span className="label">02 — Work History</span>
        </div>
        <div className="lg:grid lg:grid-cols-[160px_1fr] lg:gap-x-12">
          <SectionTag number="02" label="Work" />
          <div>
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
