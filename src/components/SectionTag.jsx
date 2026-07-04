import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// A torn scrap of paper bearing the section number/name, pinned to a corner via
// position:sticky — it stays put while the section's content scrolls past it.
export default function SectionTag({ number, label, rotate = -3, top = 104 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div className="hidden lg:block" style={{ height: 'fit-content', position: 'sticky', top }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16, rotate: rotate - 4 }}
        animate={inView ? { opacity: 1, y: 0, rotate } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: '#f6efdd',
          border: '1px solid #e6dabd',
          boxShadow: '3px 6px 0 rgba(36,28,16,0.1)',
          padding: '16px 18px 20px',
          width: 148,
          clipPath: `polygon(
            0% 6%, 6% 1%, 14% 5%, 22% 0%, 32% 4%, 42% 1%, 52% 5%, 62% 0%, 72% 4%, 82% 1%, 90% 5%, 100% 2%,
            100% 94%, 94% 99%, 86% 95%, 76% 100%, 66% 96%, 56% 99%, 46% 95%, 36% 100%, 26% 96%, 16% 99%, 8% 95%, 0% 98%
          )`,
        }}
      >
        <div className="font-mono text-xs" style={{ color: '#8a7a5e', letterSpacing: '0.1em' }}>{number}</div>
        <div className="hand text-3xl mt-1" style={{ color: '#241c10' }}>{label}</div>
      </motion.div>
    </div>
  )
}
