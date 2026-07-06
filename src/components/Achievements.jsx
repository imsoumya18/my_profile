import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Code2, BarChart2, GitMerge, Cpu, Trophy, Star, Github } from 'lucide-react'
import profile from '../data/profile.json'
import SectionTag from './SectionTag'
import Doodle from './Doodle'
import TornEdge from './TornEdge'

const { achievements } = profile

const ICON_MAP = { Code2, BarChart2, GitMerge, Cpu, Trophy, Star, Github }

function Counter({ target, suffix = '', inView }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / 1800, 1)
      setCount(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, target])
  return <>{count}{suffix}</>
}

export default function Achievements() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="achievements" className="relative py-20 px-5 sm:px-8" style={{ background: '#fdf9f0' }}>
      <TornEdge color="#fdf9f0" seed={11} />
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="cyber-grid" />
      </div>
      <div className="hidden lg:block absolute pointer-events-none" style={{ right: '4%', bottom: '8%' }}>
        <Doodle type="trophy" size={76} rotate={7} opacity={0.35} />
      </div>
      <div className="hidden lg:block absolute pointer-events-none" style={{ left: '4%', top: '12%' }}>
        <Doodle type="chip" size={70} rotate={-9} opacity={0.33} />
      </div>
      <div className="hidden lg:block absolute pointer-events-none" style={{ left: '10%', bottom: '14%' }}>
        <Doodle type="book" size={62} rotate={11} opacity={0.31} />
      </div>
      <div ref={ref} className="max-w-7xl mx-auto relative">
        <div className="divider mb-8" />
        <div className="lg:hidden flex items-center justify-between mb-14">
          <span className="label">05 — Milestones</span>
        </div>

        <div className="lg:grid lg:grid-cols-[160px_1fr] lg:gap-x-12">
          <SectionTag number="05" label="Milestones" />
          <div>

        {/* Stats — pinned scrap notes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {achievements.stats.map((s, i) => {
            const Icon = ICON_MAP[s.icon]
            const rot = [-2, 1.5, -1, 2][i % 4]
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative p-6 flex flex-col gap-4"
                style={{ background: '#f6efdd', border: '1px solid #e6dabd', boxShadow: '3px 5px 0 rgba(36,28,16,0.08)', transform: `rotate(${rot}deg)` }}
              >
                <span style={{
                  position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)',
                  width: 13, height: 13, borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 30%, #f0a840, #a85e12 70%)',
                  boxShadow: '0 2px 3px rgba(36,28,16,0.2)',
                }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: '#fdf9f0', border: '1px solid #e6dabd' }}>
                  <Icon size={18} style={{ color: '#6b5d46' }} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="hand text-4xl mb-1" style={{ color: '#a85e12' }}>
                    <Counter target={s.value} suffix={s.suffix} inView={inView} />
                  </div>
                  <div className="label">{s.label}</div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Awards */}
        <div className="grid md:grid-cols-3 gap-8 mt-6">
          {achievements.awards.map((award, i) => {
            const Icon = ICON_MAP[award.icon]
            const rot = [-1.5, 1, -1][i % 3]
            return (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative p-8 overflow-hidden transition-all duration-300 hover-lift"
                style={{ background: '#f6efdd', border: '1px solid #e6dabd', boxShadow: '3px 5px 0 rgba(36,28,16,0.08)', transform: `rotate(${rot}deg)` }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d6870f' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e6dabd' }}
              >
                <div style={{
                  position: 'absolute', top: -2, left: '50%', transform: 'translateX(-50%) rotate(-2deg)',
                  width: 76, height: 22, background: 'rgba(214,135,15,0.26)', border: '1px solid rgba(168,94,18,0.2)',
                }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 mt-3"
                  style={{ background: '#fdf9f0', border: '1px solid #e6dabd' }}>
                  <Icon size={18} style={{ color: '#6b5d46' }} strokeWidth={1.5} />
                </div>
                <div className="font-mono text-xs mb-2" style={{ color: '#8a7a5e' }}>{award.year}</div>
                <h3 className="font-note text-xl mb-3" style={{ color: '#241c10' }}>
                  {award.title}
                </h3>
                <p className="font-grotesk text-xs leading-relaxed" style={{ color: '#6b5d46' }}>
                  {award.description}
                </p>
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
