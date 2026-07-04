import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Github, Linkedin, Mail, Phone, ArrowUpRight } from 'lucide-react'
import profile from '../data/profile.json'

const { contact, personal } = profile

const ICON_MAP = { Github, Linkedin, Mail, Phone }

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="contact" className="relative py-20 px-5 sm:px-8" style={{ background: '#f6efdd' }}>
      <div className="absolute inset-0 cyber-grid pointer-events-none" />

      <div ref={ref} className="max-w-5xl mx-auto text-center relative">
        <div className="divider mb-8 max-w-6xl mx-auto" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="label mb-8 block"
        >
          06 — Contact
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="display-md mb-6"
          style={{ color: '#241c10' }}
        >
          Let's build something{' '}
          <span style={{
            background: 'linear-gradient(135deg, #241c10 0%, #d6870f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            extraordinary
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-grotesk text-lg mb-10 max-w-xl mx-auto leading-relaxed"
          style={{ color: '#6b5d46' }}
        >
          Whether it's an ML system, GenAI application, or cloud infra challenge —
          I'm always open to interesting conversations and collaborations.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto mb-14">
          {contact.map((s, i) => {
            const Icon = ICON_MAP[s.icon]
            const rot = [-1.5, 1, -1, 1.5][i % 4]
            return (
              <motion.a
                key={s.label}
                href={s.href}
                target={s.external ? '_blank' : undefined}
                rel={s.external ? 'noreferrer' : undefined}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative p-5 flex items-center gap-4 text-left transition-all duration-300 hover-lift"
                style={{ background: '#fdf9f0', border: '1px solid #e6dabd', boxShadow: '3px 5px 0 rgba(36,28,16,0.08)', transform: `rotate(${rot}deg)` }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d6870f' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e6dabd' }}
              >
                <div style={{
                  position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%) rotate(-2deg)',
                  width: 60, height: 18, background: 'rgba(214,135,15,0.26)', border: '1px solid rgba(168,94,18,0.2)',
                }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#f6efdd', border: '1px solid #e6dabd' }}>
                  <Icon size={17} style={{ color: '#6b5d46' }} strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <div className="font-syne font-semibold text-sm" style={{ color: '#241c10' }}>{s.label}</div>
                  <div className="font-mono text-xs mt-0.5 truncate" style={{ color: '#8a7a5e' }}>{s.handle}</div>
                </div>
                <ArrowUpRight size={14} className="ml-auto flex-shrink-0" style={{ color: '#c2b28c' }} strokeWidth={1.5} />
              </motion.a>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="note mb-10"
          style={{ color: '#a85e12', fontSize: '20px', transform: 'rotate(-1deg)' }}
        >
          — reply-guaranteed, unlike my inbox zero attempts.
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          style={{ borderTop: '1px solid #e6dabd', paddingTop: '3rem' }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4" style={{ color: '#c2b28c' }}>
            <div className="font-mono text-xs">
              Designed & built by <span style={{ color: '#8a7a5e' }}>{personal.name}</span>
            </div>
            <div className="font-mono text-xs">React · Three.js · Framer Motion</div>
            <div className="font-mono text-xs">© {new Date().getFullYear()}</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
