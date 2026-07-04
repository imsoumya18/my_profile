import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mic2, Scissors, ArrowUpRight, Play } from 'lucide-react'
import profile from '../data/profile.json'
import InkCircle from './InkCircle'
import SectionTag from './SectionTag'

const { projects } = profile

const ICON_MAP = { Mic2, Scissors }

function TiltCard({ project, index }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glow, setGlow] = useState({ x: 50, y: 50 })
  const cardRef = useRef(null)
  const inView  = useInView(cardRef, { once: true, margin: '-60px' })
  const Icon    = ICON_MAP[project.icon]
  const baseRot = index % 2 === 0 ? -1 : 1

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top)  / rect.height
    setTilt({ x: (y - 0.5) * -10, y: (x - 0.5) * 10 })
    setGlow({ x: x * 100, y: y * 100 })
  }
  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setGlow({ x: 50, y: 50 })
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
    >
      <div
        className="rounded-2xl p-8 relative overflow-hidden transition-all duration-200 group"
        style={{
          background: '#f6efdd',
          border: '1px solid #e6dabd',
          boxShadow: '4px 6px 0 rgba(36,28,16,0.08)',
          transform: `rotate(${baseRot}deg) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div style={{
          position: 'absolute', top: -2, left: '50%', transform: 'translateX(-50%) rotate(-2deg)',
          width: 76, height: 22, background: 'rgba(214,135,15,0.26)', border: '1px solid rgba(168,94,18,0.2)', zIndex: 1,
        }} />
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(36,28,16,0.04) 0%, transparent 65%)` }}
        />

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 relative mt-3">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#fdf9f0', border: '1px solid #e6dabd' }}>
              <Icon size={20} style={{ color: '#6b5d46' }} strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <h3 className="font-note text-xl" style={{ color: '#241c10' }}>{project.title}</h3>
              <span className="font-mono text-xs" style={{ color: '#8a7a5e' }}>{project.date}</span>
            </div>
          </div>
          <div className="text-left sm:text-right px-3 py-2 rounded-lg flex-shrink-0 self-start"
            style={{ background: '#fdf9f0', border: '1px solid #e6dabd' }}>
            <InkCircle variant={index} padX={10} padY={4}>
              <span className="font-syne font-bold text-sm" style={{ color: '#a85e12' }}>{project.metric.value}</span>
            </InkCircle>
            <div className="font-grotesk text-xs" style={{ color: '#8a7a5e' }}>{project.metric.label}</div>
          </div>
        </div>

        <p className="font-grotesk text-xs leading-relaxed mb-6 relative" style={{ color: '#6b5d46' }}>
          {project.description}
        </p>

        <ul className="space-y-2.5 mb-6 relative">
          {project.details.map((d, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0 bg-[#c2b28c]" />
              <span className="font-grotesk text-xs leading-relaxed" style={{ color: '#8a7a5e' }}>{d}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2 mb-6 relative">
          {project.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
        </div>

        <div className="relative flex gap-2 flex-wrap">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-grotesk text-xs transition-all duration-200"
            style={{ background: '#241c10', border: '1px solid #241c10', color: '#fdf9f0' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#4a3d28'; e.currentTarget.style.borderColor = '#4a3d28' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#241c10'; e.currentTarget.style.borderColor = '#241c10' }}
          >
            <Play size={11} strokeWidth={2} />
            Live Demo
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-grotesk text-xs transition-all duration-200"
            style={{ background: '#fdf9f0', border: '1px solid #e6dabd', color: '#6b5d46' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d6870f'; e.currentTarget.style.color = '#a85e12' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e6dabd'; e.currentTarget.style.color = '#6b5d46' }}
          >
            GitHub
            <ArrowUpRight size={13} strokeWidth={2} />
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="projects" className="relative py-20 px-5 sm:px-8" style={{ background: '#f6efdd' }}>
      <div className="absolute inset-0 cyber-grid pointer-events-none" />
      <div ref={ref} className="max-w-7xl mx-auto relative">
        <div className="divider mb-8" />
        <div className="flex items-center justify-between lg:justify-end mb-14">
          <span className="label lg:hidden">04 — Projects</span>
          <a
            href={projects[0].githubUrl}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs flex items-center gap-1.5 transition-colors duration-200"
            style={{ color: '#c2b28c' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#d6870f' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#c2b28c' }}
          >
            All on GitHub <ArrowUpRight size={11} strokeWidth={2} />
          </a>
        </div>
        <div className="lg:grid lg:grid-cols-[160px_1fr] lg:gap-x-12">
          <SectionTag number="04" label="Projects" />
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <TiltCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
