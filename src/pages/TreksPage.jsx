import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mountain } from 'lucide-react'
import { useProfile } from '../context/ProfileContext'
import trekHero from '../assets/images/trek-hero.jpg'
import InkCircle from '../components/InkCircle'
import Doodle from '../components/Doodle'

// Trek photos live in src/assets/images/treks/ and are referenced from
// profile.json by filename (no extension) — drop a new file in that folder
// and set `"photo": "filename"` on the trek entry to use it.
const trekPhotoModules = import.meta.glob('../assets/images/treks/*.{jpg,jpeg,png}', { eager: true, import: 'default' })
const trekPhotos = Object.fromEntries(
  Object.entries(trekPhotoModules).map(([path, url]) => [path.match(/([^/]+)\.\w+$/)[1], url])
)

function StatusBadge({ status, plannedDate, completedDate }) {
  if (status === 'done') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-xs font-medium"
        style={{ background: '#a85e12', color: '#fdf9f0' }}>
        ✓ {completedDate || 'Done'}
      </span>
    )
  }
  if (status === 'planned') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-xs font-medium"
        style={{ background: '#f3ddac', border: '1px solid #d6870f', color: '#a85e12' }}>
        <span className="w-1.5 h-1.5 rounded-full animate-ping inline-flex" style={{ background: '#a85e12' }} />
        {plannedDate}
      </span>
    )
  }
  return null
}

function DifficultyBar({ score }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="w-2 h-1.5 rounded-sm"
          style={{ background: i < score ? '#a85e12' : '#e6dabd' }} />
      ))}
      <span className="font-mono text-xs ml-1.5" style={{ color: '#8a7a5e' }}>{score}/10</span>
    </div>
  )
}

function NodeDot({ isDone, isPlanned }) {
  if (isPlanned) {
    return (
      <span className="relative flex w-4 h-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-30"
          style={{ background: '#d6870f' }} />
        <span className="relative inline-flex w-4 h-4 rounded-full border-2"
          style={{ borderColor: '#d6870f', background: '#fdf9f0' }} />
      </span>
    )
  }
  if (isDone) {
    return (
      <div className="w-4 h-4 rounded-full flex items-center justify-center"
        style={{ background: '#a85e12' }}>
        <span className="text-white" style={{ fontSize: '8px' }}>✓</span>
      </div>
    )
  }
  return <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: '#ddd0ae', background: '#fdf9f0' }} />
}

// A hanging Polaroid — same treatment as the hero photos elsewhere on the
// site, sized down to sit beside a trek card.
function TrekPhoto({ photo, name, rotate, width = 242, fit = 'cover', brightness = 1.32 }) {
  if (!photo) return null
  const s = width / 190
  return (
    <div className="relative" style={{ width, transform: `rotate(${rotate}deg)` }}>
      <div style={{
        position: 'absolute', top: -10 * s, left: '50%', transform: 'translateX(-50%) rotate(-2deg)',
        width: 58 * s, height: 18 * s, background: 'rgba(214,135,15,0.3)', border: '1px solid rgba(168,94,18,0.22)', zIndex: 2,
      }} />
      <div style={{ background: '#fffdf7', padding: `${9 * s}px ${9 * s}px ${26 * s}px`, boxShadow: '0 14px 28px rgba(36,28,16,0.18), 0 2px 4px rgba(36,28,16,0.1)' }}>
        <div style={{ aspectRatio: '4 / 5', background: '#fffdf7', overflow: 'hidden' }}>
          <img
            src={photo}
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              objectFit: fit,
              objectPosition: fit === 'contain' ? 'center' : 'center top',
              filter: `grayscale(100%) contrast(0.92) brightness(${brightness})`,
            }}
          />
        </div>
        <div className="note text-center" style={{ marginTop: 6 * s, color: '#a85e12', fontSize: Math.max(11, 12 * s) }}>
          {name}
        </div>
      </div>
    </div>
  )
}

function TrekCard({ trek, isDone, isPlanned, tilt }) {
  return (
    <div
      className="rounded-2xl p-6 transition-all duration-300 relative"
      style={{
        background: isDone ? '#241c10' : '#f6efdd',
        border: `1px solid ${isDone ? '#241c10' : isPlanned ? '#d6870f' : '#e6dabd'}`,
        boxShadow: '3px 5px 0 rgba(36,28,16,0.08)',
        transform: `rotate(${tilt}deg)`,
      }}
    >
      {/* Washi tape */}
      <div style={{
        position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%) rotate(-2deg)',
        width: 70, height: 22, background: 'rgba(214,135,15,0.28)', border: '1px solid rgba(168,94,18,0.2)',
      }} />

      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3 mt-1">
        <div className="min-w-0">
          <h3 className="font-note text-xl leading-tight"
            style={{ color: isDone ? '#fdf9f0' : '#241c10' }}>
            {trek.name}
          </h3>
          <p className="font-mono text-xs mt-0.5" style={{ color: isDone ? 'rgba(253,249,240,0.5)' : '#8a7a5e' }}>
            {trek.location}
          </p>
        </div>
        <StatusBadge status={trek.status} plannedDate={trek.plannedDate} completedDate={trek.completedDate} />
      </div>

      {/* Description */}
      <p className="font-grotesk text-xs leading-relaxed mb-4"
        style={{ color: isDone ? 'rgba(253,249,240,0.65)' : '#6b5d46' }}>
        {trek.description}
      </p>

      {/* Difficulty bar */}
      <div className="mb-4">
        <DifficultyBar score={trek.difficultyScore} />
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {isDone ? (
          <InkCircle>
            <span className="font-mono text-xs" style={{ color: 'rgba(253,249,240,0.9)' }}>
              {trek.altitude.toLocaleString()} m / {trek.altitudeFt.toLocaleString()} ft
            </span>
          </InkCircle>
        ) : (
          <span className="font-mono text-xs" style={{ color: '#241c10' }}>
            {trek.altitude.toLocaleString()} m / {trek.altitudeFt.toLocaleString()} ft
          </span>
        )}
      </div>
    </div>
  )
}

function TrekNode({ trek, isLeft }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  const isDone    = trek.status === 'done'
  const isPlanned = trek.status === 'planned'
  // "photo" is either a bundled asset key (pre-committed images) or, for
  // anything added through the admin panel, a direct URL (pasted link or
  // one served back from the image-upload Function).
  const photo     = trek.photo ? (trekPhotos[trek.photo] || trek.photo) : null

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {/* Mobile / tablet: single-column list with a left rail */}
      <div className="flex md:hidden items-stretch gap-4">
        <div className="flex flex-col items-center flex-shrink-0 w-4 pt-6">
          <NodeDot isDone={isDone} isPlanned={isPlanned} />
          <div className="w-px flex-1 mt-1" style={{ background: '#e6dabd' }} />
        </div>
        <div className="flex-1 min-w-0 pb-3">
          {photo && (
            <div className="flex justify-center mb-4">
              <TrekPhoto photo={photo} name={trek.name} rotate={isLeft ? -2 : 2} fit={trek.photoFit || 'cover'} brightness={trek.photoBrightness} />
            </div>
          )}
          <TrekCard trek={trek} isDone={isDone} isPlanned={isPlanned} tilt={isLeft ? -0.8 : 0.6} />
        </div>
      </div>

      {/* Desktop: alternating zigzag */}
      <div className={`hidden md:flex items-center gap-0 w-full ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Card */}
        <div className="w-[calc(50%-28px)]">
          <TrekCard trek={trek} isDone={isDone} isPlanned={isPlanned} tilt={isLeft ? -1 : 0.8} />
        </div>

        {/* Centre spine: connector line + node dot */}
        <div className="w-14 flex flex-col items-center flex-shrink-0 pt-6 relative">
          <div className="w-full h-px absolute top-[30px]"
            style={{ background: isDone ? '#241c10' : '#e6dabd' }} />
          <div className="relative z-10 flex items-center justify-center">
            <NodeDot isDone={isDone} isPlanned={isPlanned} />
          </div>
        </div>

        {/* Other side of the spine — the photo hangs here, kept close to the line */}
        <div className="w-[calc(50%-28px)] flex pt-2" style={{ justifyContent: isLeft ? 'flex-start' : 'flex-end' }}>
          {photo && <TrekPhoto photo={photo} name={trek.name} rotate={isLeft ? 3 : -3} fit={trek.photoFit || 'cover'} brightness={trek.photoBrightness} />}
        </div>
      </div>
    </motion.div>
  )
}

// A wishlist entry — no photo, no spine, no implied order. Just the card,
// gently scattered like the rest of the site's grids.
function WishlistCard({ trek, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const rot = [-1.5, 1, -1, 1.5][index % 4]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <TrekCard trek={trek} isDone={false} isPlanned={trek.status === 'planned'} tilt={rot} />
    </motion.div>
  )
}

export default function TreksPage() {
  const { treks } = useProfile()

  const allTreks = treks.list
  const doneTreks = allTreks.filter((t) => t.status === 'done')
  const doneCount = doneTreks.length
  const nextTrek = allTreks.find((t) => t.status === 'planned')
  const doneMaxAltTrek = doneTreks.length
    ? doneTreks.reduce((a, b) => (b.altitude > a.altitude ? b : a))
    : null

  // Only treks that actually happened get a connected timeline — it implies
  // a real, ordered sequence. Everything else is aspirational with no
  // committed order, so it gets its own "wishlist" grid instead of looking
  // like it's queued up next.
  const wishlistTreks = allTreks.filter((t) => t.status !== 'done')
  const doneSequence = doneTreks.map((trek, i) => ({ trek, isLeft: (i + 1) % 2 === 1 }))

  return (
    <div className="min-h-screen" style={{ background: '#fdf9f0' }}>
      {/* Hero */}
      <section className="relative pt-28 pb-12 lg:pt-36 lg:pb-16" style={{ background: '#fdf9f0' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="cyber-grid" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col-reverse lg:flex-row lg:items-center gap-12 lg:gap-20"
        >
          <div className="w-full lg:max-w-[52%]">
            <div className="label mb-4">Beyond Code</div>
            <h1 className="hand mb-4" style={{ fontSize: 'clamp(58px, 10vw, 108px)', color: '#d6870f', lineHeight: 0.85 }}>
              Higher<br />
              <span className="scribble-underline">
                Ground
                <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 12 Q 50 20 100 10 T 198 9" fill="none" stroke="#241c10" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="font-grotesk text-base leading-relaxed max-w-lg" style={{ color: '#6b5d46' }}>
              {treks.tagline}
            </p>

            {/* Stats strip — pinned scrap notes */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mt-10 w-full grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4"
            >
              {[
                { n: `${doneCount}`,  l: 'Treks Completed', rot: -2 },
                {
                  n: doneMaxAltTrek ? `${doneMaxAltTrek.altitude.toLocaleString()} m` : '—',
                  sub: doneMaxAltTrek ? `${doneMaxAltTrek.altitudeFt.toLocaleString()} ft` : null,
                  l: 'Highest Reached', rot: 1.5,
                },
                {
                  n: nextTrek ? nextTrek.name : '—',
                  sub: nextTrek?.plannedDate,
                  small: true,
                  l: 'Next Up', rot: -1,
                },
              ].map((s) => (
                <div key={s.l}
                  className="relative p-5 text-center"
                  style={{ background: '#f6efdd', border: '1px solid #e6dabd', boxShadow: '3px 4px 0 rgba(36,28,16,0.08)', transform: `rotate(${s.rot}deg)` }}>
                  <span style={{
                    position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                    width: 14, height: 14, borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 30%, #f0a840, #a85e12 70%)',
                    boxShadow: '0 2px 3px rgba(36,28,16,0.2)',
                  }} />
                  <div className={`hand mb-1 ${s.small ? 'text-2xl' : 'text-4xl'}`} style={{ color: '#241c10' }}>{s.n}</div>
                  {s.sub && <div className="note" style={{ color: '#a85e12', fontSize: '14px' }}>{s.sub}</div>}
                  <div className="label mt-1">{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hanging photo — pinned to the page like a scrap on the wall */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-end lg:flex-shrink-0">
            <div className="relative" style={{ width: 'min(300px, 68vw)', transform: 'rotate(-3deg)' }}>
              <div style={{
                position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%) rotate(-2deg)',
                width: 84, height: 26, background: 'rgba(214,135,15,0.3)', border: '1px solid rgba(168,94,18,0.22)', zIndex: 2,
              }} />
              <div style={{ background: '#fffdf7', padding: '12px 12px 46px', boxShadow: '0 22px 45px rgba(36,28,16,0.22), 0 3px 6px rgba(36,28,16,0.12)' }}>
                <div style={{
                  aspectRatio: '700 / 750',
                  backgroundImage: `url(${trekHero})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'grayscale(100%) contrast(1.05)',
                }} />
                <div className="note text-center" style={{ marginTop: '10px', color: '#a85e12', fontSize: '15px' }}>
                  Hemkund Sahib · Aug 2026
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative overflow-hidden">
        <div className="cyber-grid" />
        <div className="hidden lg:block absolute pointer-events-none" style={{ left: '4%', top: '10%' }}>
          <Doodle type="mountain" size={84} rotate={-5} opacity={0.34} />
        </div>
        <div className="hidden lg:block absolute pointer-events-none" style={{ right: '5%', top: '32%' }}>
          <Doodle type="compass" size={72} rotate={10} opacity={0.32} />
        </div>
        <div className="hidden lg:block absolute pointer-events-none" style={{ left: '6%', bottom: '12%' }}>
          <Doodle type="footprints" size={64} rotate={-7} opacity={0.32} />
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-16 relative">

        {/* Timeline — only treks that actually happened, in the order they did */}
        {doneSequence.length > 0 && (
          <div className="relative">
            {/* Vertical spine line — desktop only, mobile uses per-item rails */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
              style={{ background: 'linear-gradient(to bottom, transparent, #e6dabd 5%, #e6dabd 95%, transparent)' }} />

            <div className="flex flex-col gap-3 md:gap-12">
              {doneSequence.map((item) => (
                <TrekNode key={item.trek.name} trek={item.trek} isLeft={item.isLeft} />
              ))}
            </div>

            {/* End cap */}
            <div className="flex justify-center mt-6">
              <div className="w-6 h-6 rounded-full border-2 border-dashed flex items-center justify-center"
                style={{ borderColor: '#ddd0ae' }}>
                <Mountain size={10} style={{ color: '#ddd0ae' }} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-16">
          <span className="note" style={{ color: '#a85e12', fontSize: '22px', transform: 'rotate(-1deg)', display: 'inline-block' }}>
            — take the switchbacks slow, the ridgeline is worth it.
          </span>
        </div>
        </div>

        {/* Wishlist — everything else. No spine, no order implied; just
            the ones that keep pulling at the map. */}
        {wishlistTreks.length > 0 && (
          <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-24 relative">
            <div className="text-center mb-12">
              <div className="label mb-3">The Wishlist</div>
              <h2 className="font-note text-3xl mb-3" style={{ color: '#241c10' }}>Nothing booked, everything wanted</h2>
              <p className="font-grotesk text-sm max-w-md mx-auto" style={{ color: '#6b5d46' }}>
                No dates, no order — just the treks that keep pulling at the map.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistTreks.map((trek, i) => (
                <WishlistCard key={trek.name} trek={trek} index={i} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
