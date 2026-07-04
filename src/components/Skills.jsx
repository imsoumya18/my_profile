import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import profile from '../data/profile.json'
import SectionTag from './SectionTag'

const { skills } = profile

// Double the rows so the marquee loops seamlessly
const row1 = [...skills.marquee.row1, ...skills.marquee.row1]
const row2 = [...skills.marquee.row2, ...skills.marquee.row2]

function MarqueeRow({ items, reverse = false }) {
  return (
    <div
      className="overflow-hidden py-2 relative"
      style={{ maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)' }}
    >
      <div className={`marquee-row ${reverse ? 'marquee-row--rev' : 'marquee-row--fwd'}`}>
        {items.map((s, i) => <span key={i} className="tag">{s}</span>)}
      </div>
    </div>
  )
}

export default function Skills() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="skills" className="py-20" style={{ background: '#fdf9f0' }}>
      <div className="mb-16 space-y-3">
        <MarqueeRow items={row1} />
        <MarqueeRow items={row2} reverse />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="divider mb-8" />
        <div className="lg:hidden flex items-center justify-between mb-14">
          <span className="label">03 — Skills</span>
        </div>

        <div className="lg:grid lg:grid-cols-[160px_1fr] lg:gap-x-12">
          <SectionTag number="03" label="Skills" />
          <div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.categories.map((cat, ci) => {
            const rot = [-1.5, 1, -1, 1.5][ci % 4]
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: ci * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative p-8"
                style={{ background: '#f6efdd', border: '1px solid #e6dabd', boxShadow: '3px 5px 0 rgba(36,28,16,0.08)', transform: `rotate(${rot}deg)` }}
              >
                <div style={{
                  position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%) rotate(-2deg)',
                  width: 64, height: 20, background: 'rgba(214,135,15,0.26)', border: '1px solid rgba(168,94,18,0.2)',
                }} />
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="font-mono text-xs" style={{ color: '#d6870f' }}>{cat.id}</span>
                  <h3 className="font-note text-2xl" style={{ color: '#241c10' }}>{cat.label}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((s, si) => (
                    <motion.span
                      key={s}
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ delay: ci * 0.1 + si * 0.04, duration: 0.4 }}
                      className="tag"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-0 pt-10"
          style={{ borderTop: '1px solid #e6dabd' }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <span className="label flex-shrink-0">Currently exploring</span>
            <div className="flex flex-wrap gap-2 items-center">
              {skills.exploring.map((s) => (
                <span key={s} className="tag" style={{ color: '#c2b28c', borderColor: '#eee2c5' }}>{s}</span>
              ))}
              <span className="note" style={{ color: '#a85e12', fontSize: '14px', transform: 'rotate(-1.5deg)' }}>
                (send help)
              </span>
            </div>
          </div>
        </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
