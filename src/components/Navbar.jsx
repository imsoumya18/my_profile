import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Linkedin, FileText, ChevronDown, Mountain, Camera, BookOpen, Clapperboard, Menu, X, Home } from 'lucide-react'
import { useProfile } from '../context/ProfileContext'

export default function Navbar() {
  const { nav, personal } = useProfile()
  const [scrolled, setScrolled] = useState(false)
  const [asideOpen, setAsideOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const asideRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Click-only dropdown (not hover) so it behaves the same on touch and
  // mouse — close it on an outside click/tap instead of onMouseLeave.
  useEffect(() => {
    if (!asideOpen) return
    const onPointerDown = (e) => {
      if (asideRef.current && !asideRef.current.contains(e.target)) setAsideOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [asideOpen])

  const goHome = () => {
    setMobileOpen(false)
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  const scrollTo = (href) => {
    setMobileOpen(false)
    if (isHome) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      requestAnimationFrame(() => {
        setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }), 60)
      })
    }
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 z-[100] h-[3px] origin-left"
        style={{ width: progressWidth, background: '#d6870f', opacity: 0.85 }}
      />

      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between"
        style={{
          borderBottom: scrolled ? '1px solid #e6dabd' : '1px solid transparent',
          background: scrolled ? 'rgba(253,249,240,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          transition: 'all 0.4s ease',
        }}
      >
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={goHome}
            aria-label="Home"
            className="inline-flex items-center transition-colors duration-300"
            style={{ color: '#3a2f1f' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#d6870f' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#3a2f1f' }}
          >
            <Home size={16} strokeWidth={1.8} />
          </button>
          {nav.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="font-grotesk text-sm transition-colors duration-300"
              style={{ color: '#3a2f1f' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#d6870f' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#3a2f1f' }}
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Mobile trigger — takes the left slot the desktop nav uses,
            keeping Beyond Code/LinkedIn/Résumé right-aligned on their own */}
        <button
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full"
          style={{ color: '#241c10' }}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X size={20} strokeWidth={1.8} /> : <Menu size={20} strokeWidth={1.8} />}
        </button>

        {/* Beyond Code + LinkedIn + Résumé — always visible, right-aligned
            at every width instead of hiding behind the hamburger on mobile. */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative" ref={asideRef}>
            <button
              onClick={() => setAsideOpen((v) => !v)}
              className="inline-flex items-center gap-1 font-grotesk text-xs px-2.5 sm:px-3.5 py-1.5 rounded-full border transition-all duration-200"
              style={{ color: '#3a2f1f', borderColor: '#e6dabd', background: '#f6efdd' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d6870f'; e.currentTarget.style.color = '#a85e12'; e.currentTarget.style.background = '#f3ddac' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e6dabd'; e.currentTarget.style.color = '#3a2f1f'; e.currentTarget.style.background = '#f6efdd' }}
            >
              Beyond Code
              <ChevronDown size={11} strokeWidth={1.8} />
            </button>

            <AnimatePresence>
              {asideOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 top-full mt-2 py-1.5 rounded-2xl overflow-hidden"
                  style={{ background: '#fdf9f0', border: '1px solid #e6dabd', boxShadow: '0 12px 32px rgba(36,28,16,0.10)', minWidth: 176 }}
                >
                  <Link
                    to="/treks"
                    onClick={() => setAsideOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 font-grotesk text-xs transition-colors duration-200"
                    style={{ color: '#241c10' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f6efdd' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <Mountain size={13} strokeWidth={1.5} />
                    Trekking
                  </Link>
                  <Link
                    to="/clicking"
                    onClick={() => setAsideOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 font-grotesk text-xs transition-colors duration-200"
                    style={{ color: '#241c10' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f6efdd' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <Camera size={13} strokeWidth={1.5} />
                    Clicking
                  </Link>
                  <Link
                    to="/reading"
                    onClick={() => setAsideOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 font-grotesk text-xs transition-colors duration-200"
                    style={{ color: '#241c10' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f6efdd' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <BookOpen size={13} strokeWidth={1.5} />
                    Reading
                  </Link>
                  <Link
                    to="/watching"
                    onClick={() => setAsideOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 font-grotesk text-xs transition-colors duration-200"
                    style={{ color: '#241c10' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f6efdd' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <Clapperboard size={13} strokeWidth={1.5} />
                    Watching
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {[
            { href: personal.links.linkedin, Icon: Linkedin, label: 'LinkedIn' },
            { href: personal.links.resume,   Icon: FileText,  label: 'Résumé'  },
          ].map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="inline-flex items-center gap-1.5 font-grotesk text-xs rounded-full border transition-all duration-200 w-9 h-9 sm:w-auto sm:h-auto justify-center sm:px-3.5 sm:py-1.5"
              style={{ color: '#fdf9f0', borderColor: '#241c10', background: '#241c10' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#3a2f1f'; e.currentTarget.style.borderColor = '#3a2f1f' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#241c10'; e.currentTarget.style.borderColor = '#241c10' }}
            >
              <Icon size={12} strokeWidth={1.8} />
              <span className="hidden sm:inline">{label}</span>
            </a>
          ))}
        </div>
      </motion.header>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed top-[68px] left-0 right-0 z-40 px-6 py-6 overflow-y-auto"
            style={{
              background: 'rgba(253,249,240,0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid #e6dabd',
              maxHeight: 'calc(100vh - 68px)',
            }}
          >
            <nav className="flex flex-col gap-1 mb-6">
              <button
                onClick={goHome}
                className="flex items-center gap-3 font-grotesk text-base text-left py-3"
                style={{ color: '#3a2f1f', borderBottom: '1px solid #ede3c8' }}
              >
                <Home size={16} strokeWidth={1.8} />
                Home
              </button>
              {nav.map((l) => (
                <button
                  key={l.href}
                  onClick={() => scrollTo(l.href)}
                  className="font-grotesk text-base text-left py-3"
                  style={{ color: '#3a2f1f', borderBottom: '1px solid #ede3c8' }}
                >
                  {l.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
