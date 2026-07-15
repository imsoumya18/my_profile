import { useId } from 'react'
import { motion } from 'framer-motion'
import { Star, BookOpen } from 'lucide-react'
import profile from '../data/profile.json'
import Doodle from '../components/Doodle'
import useTilt from '../hooks/useTilt'
import { makeRng } from '../components/InkCircle'

const { reading } = profile

// A small warm palette to cycle the catalog tabs through — enough variety
// to read as "sorted by hand," not a single repeated accent.
const TAB_COLORS = ['#d6870f', '#a85e12', '#6b5d46', '#d6342a']

// A stand-in for real cover art — a warm gradient swatch with the title's
// initial, since these are placeholder books. Swap for actual cover images
// (or an Open Library covers lookup by ISBN) once the real list is in.
const COVER_GRADIENTS = [
  'linear-gradient(160deg, #d6870f 0%, #a85e12 100%)',
  'linear-gradient(160deg, #6b5d46 0%, #3a2f1f 100%)',
  'linear-gradient(160deg, #d6342a 0%, #a3271f 100%)',
  'linear-gradient(160deg, #a85e12 0%, #6b3d0f 100%)',
]

// Each card's own worn, torn top/bottom edge — built the same way as the
// section-seam torn edges (TornEdge.jsx), but as a CSS clip-path since it
// needs to hug one small rotated card rather than a full-width seam.
function tornClipPath(seed, amp = 2.6) {
  const rng = makeRng(seed)
  const segments = 10
  const pts = []
  for (let i = 0; i <= segments; i++) {
    pts.push(`${((i / segments) * 100).toFixed(1)}% ${(rng() * amp).toFixed(1)}%`)
  }
  for (let i = segments; i >= 0; i--) {
    pts.push(`${((i / segments) * 100).toFixed(1)}% ${(100 - rng() * amp).toFixed(1)}%`)
  }
  return `polygon(${pts.join(', ')})`
}
// Rotation, vertical stagger, and a peek angle/offset for the "second card
// underneath" — enough to read as a loosely fanned stack pulled from a
// drawer, not a tidy aligned grid.
const SCATTER = [
  { rot: -3,   mt: 0,  peekRot: 4,   peekX: 7,  peekY: 5 },
  { rot: 2.4,  mt: 46, peekRot: -5,  peekX: -6, peekY: 6 },
  { rot: -2.2, mt: 14, peekRot: 5,   peekX: 6,  peekY: 4 },
  { rot: 3,    mt: 60, peekRot: -4,  peekX: -7, peekY: 5 },
  { rot: -2.6, mt: 24, peekRot: 4.5, peekX: 6,  peekY: 6 },
  { rot: 2,    mt: 38, peekRot: -4,  peekX: -6, peekY: 5 },
]
const STAMP_ROTATIONS = [-9, 7, -6, 10, -11, 6]
const COLUMN_COUNT = 3
function distributeColumns(books) {
  const columns = Array.from({ length: COLUMN_COUNT }, () => [])
  books.forEach((book, i) => columns[i % COLUMN_COUNT].push({ book, index: i }))
  return columns
}

// A proper round library date-stamp: "FINISHED" curved along the top of a
// double ring, the date sat straight in the middle — curving text along
// the bottom too would render it upside down, so real stamps (and this
// one) leave the bottom of the ring bare.
function StampBadge({ date, size = 108, rotate = -8, style }) {
  const arcId = useId()
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ transform: `rotate(${rotate}deg)`, flexShrink: 0, overflow: 'visible', ...style }}
    >
      <defs>
        {/* Baseline sits on this arc, and letters extend outward from there
            (toward the outer ring) — radius has to leave room for the
            glyphs' cap-height, not just center them between the rings. */}
        <path id={arcId} d="M 16,54 A 34,34 0 1,1 84,54" fill="none" />
      </defs>
      <circle cx="50" cy="50" r="47" fill="none" stroke="#d6342a" strokeWidth="2.5" opacity="0.82" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="#d6342a" strokeWidth="1.2" opacity="0.72" />
      <text fill="#d6342a" fontSize="15" fontFamily="'JetBrains Mono', monospace" letterSpacing="1.5" fontWeight="700">
        <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">FINISHED</textPath>
      </text>
      <text x="50" y="57" textAnchor="middle" fill="#d6342a" fontSize="11" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
        {date}
      </text>
      <line x1="34" y1="66" x2="66" y2="66" stroke="#d6342a" strokeWidth="1" opacity="0.6" />
    </svg>
  )
}

function StarRow({ rating, size = 12 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={1.5}
          style={{ color: i < rating ? '#a85e12' : '#ddd0ae' }}
          fill={i < rating ? '#a85e12' : 'none'}
        />
      ))}
    </div>
  )
}

function BookCard({ book, index }) {
  const { ref, tilt, glow, onMouseMove, onMouseLeave } = useTilt()
  const { rot, mt, peekRot, peekX, peekY } = SCATTER[index % SCATTER.length]
  const tab = TAB_COLORS[index % TAB_COLORS.length]
  const cover = COVER_GRADIENTS[index % COVER_GRADIENTS.length]
  const clip = tornClipPath(index * 17 + 11)

  return (
    <div className="relative" style={{ marginTop: mt, marginBottom: 32 }}>
      {/* A second card peeking out from behind, like more sit underneath
          it in the drawer. */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: '#f3ead2', border: '1px solid #e0d2ab',
        transform: `rotate(${rot + peekRot}deg) translate(${peekX}px, ${peekY}px)`,
        clipPath: clip,
      }} />
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ delay: (index % 6) * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative p-5 pb-8 overflow-hidden transition-all duration-200 group"
        style={{
          background: 'linear-gradient(150deg, #fffdf7 0%, #fdf6e6 55%, #f3ead2 100%)',
          border: '1px solid #e0d2ab',
          boxShadow: '3px 5px 0 rgba(36,28,16,0.08)',
          transform: `rotate(${rot}deg) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: 'preserve-3d',
          clipPath: clip,
        }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(36,28,16,0.04) 0%, transparent 65%)` }}
        />
        {/* Catalog tab + card number, like a real library catalog entry */}
        <div className="rounded-t-sm" style={{
          position: 'absolute', top: 3, left: 18, transform: 'rotate(-1deg)',
          width: 34, height: 12, background: tab, opacity: 0.85,
        }} />
        <div className="text-right absolute" style={{ top: 12, right: 14 }}>
          <div className="font-note" style={{ fontSize: '11px', color: '#c2b28c' }}>
            No. {String(index + 1).padStart(2, '0')}
          </div>
          <div className="font-mono uppercase" style={{ fontSize: '8px', letterSpacing: '0.08em', color: '#c2b28c' }}>
            {book.type}
          </div>
        </div>
        {/* Ruled line, like a real index card */}
        <div className="absolute left-0 right-0" style={{ top: 44, height: 1, background: 'rgba(214,52,42,0.25)' }} />

        <div className="relative pt-4 flex gap-4">
          {/* Cover swatch — stand-in for real cover art */}
          <div className="flex-shrink-0 rounded-sm overflow-hidden relative" style={{
            width: 56, aspectRatio: '2 / 3', background: cover,
            boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.18), 0 2px 4px rgba(36,28,16,0.15)',
          }}>
            <div className="absolute inset-0 flex items-center justify-center font-hand"
              style={{ fontSize: '26px', color: 'rgba(255,253,247,0.88)' }}>
              {book.title[0]}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="font-mono uppercase mb-1.5" style={{ fontSize: '8px', letterSpacing: '0.12em', color: '#a85e12' }}>Title</div>
            <h3 className="font-note text-base leading-snug pb-1 mb-2.5" style={{ color: '#241c10', borderBottom: '1px solid #ddcda3' }}>
              {book.title}
            </h3>
            <div className="font-mono uppercase mb-1.5" style={{ fontSize: '8px', letterSpacing: '0.12em', color: '#a85e12' }}>Author</div>
            <p className="font-grotesk text-xs pb-1" style={{ color: '#6b5d46', borderBottom: '1px solid #ede3c8' }}>
              {book.author}
            </p>
          </div>
        </div>

        <div className="relative mt-4">
          <StarRow rating={book.rating} />
          <p className="font-grotesk text-xs leading-relaxed mt-2" style={{ color: '#6b5d46', maxWidth: '78%' }}>
            {book.note}
          </p>
        </div>

        {/* Stamped on top of the card, like a real due-date stamp pressed
            over whatever's already written there. */}
        <StampBadge
          date={book.finished}
          rotate={STAMP_ROTATIONS[index % STAMP_ROTATIONS.length]}
          style={{ position: 'absolute', bottom: 4, right: 2, zIndex: 2 }}
        />

        {/* Punch hole, like a real catalog card */}
        <div className="absolute rounded-full" style={{
          bottom: 10, left: '50%', transform: 'translateX(-50%)',
          width: 8, height: 8, background: '#fdf9f0',
          boxShadow: 'inset 0 1px 2px rgba(36,28,16,0.25), 0 1px 0 rgba(255,255,255,0.6)',
          border: '1px solid #e6dabd',
        }} />
      </motion.div>
    </div>
  )
}

export default function ReadingPage() {
  const { title, author, type, progress } = reading.currentlyReading

  return (
    <div className="min-h-screen" style={{ background: '#fdf9f0' }}>
      {/* Hero */}
      <section className="relative pt-28 pb-12 lg:pt-36 lg:pb-16" style={{ background: '#fdf9f0' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col-reverse lg:flex-row lg:items-center gap-12 lg:gap-20"
        >
          <div className="w-full lg:max-w-[52%]">
            <div className="label mb-4">Beyond Code</div>
            <h1 className="hand mb-4" style={{ fontSize: 'clamp(58px, 10vw, 108px)', color: '#d6870f', lineHeight: 0.85 }}>
              The<br />
              <span className="scribble-underline">
                Stacks
                <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 12 Q 50 20 100 10 T 198 9" fill="none" stroke="#241c10" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="font-grotesk text-base leading-relaxed max-w-lg" style={{ color: '#6b5d46' }}>
              {reading.tagline}
            </p>
          </div>

          {/* Now reading — a catalog card pulled to the front of the drawer */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-end lg:flex-shrink-0">
            <div className="relative" style={{ width: 'min(280px, 70vw)', transform: 'rotate(-2deg)' }}>
              <div style={{
                position: 'absolute', top: -14, right: 28, zIndex: 2,
                transform: 'rotate(8deg)',
              }}>
                <Doodle type="bookmark" size={40} color="#d6870f" opacity={0.9} />
              </div>
              <div style={{
                background: 'linear-gradient(150deg, #fffdf7 0%, #fdf6e6 55%, #f3ead2 100%)',
                border: '1px solid #e0d2ab',
                padding: '22px 22px 28px',
                boxShadow: '0 22px 45px rgba(36,28,16,0.22), 0 3px 6px rgba(36,28,16,0.12)',
                clipPath: tornClipPath(4, 1.6),
              }}>
                <div className="rounded-t-sm" style={{
                  position: 'absolute', top: 14, left: 22, transform: 'rotate(-2deg)',
                  width: 42, height: 14, background: '#241c10', opacity: 0.9,
                }} />
                <div className="absolute left-0 right-0" style={{ top: 50, height: 1, background: 'rgba(214,52,42,0.25)' }} />
                <div className="relative pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-mono uppercase inline-block px-2 py-0.5 rounded-sm"
                      style={{ fontSize: '9px', letterSpacing: '0.08em', color: '#fdf9f0', background: '#241c10' }}>
                      Now Reading
                    </span>
                    <span className="font-mono uppercase" style={{ fontSize: '9px', letterSpacing: '0.08em', color: '#c2b28c' }}>
                      {type}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 rounded-sm overflow-hidden relative" style={{
                      width: 62, aspectRatio: '2 / 3', background: COVER_GRADIENTS[0],
                      boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.18), 0 2px 4px rgba(36,28,16,0.15)',
                    }}>
                      <div className="absolute inset-0 flex items-center justify-center font-hand"
                        style={{ fontSize: '28px', color: 'rgba(255,253,247,0.88)' }}>
                        {title[0]}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-mono uppercase mb-2" style={{ fontSize: '8px', letterSpacing: '0.12em', color: '#a85e12' }}>Title</div>
                      <h3 className="font-note text-xl leading-snug pb-1 mb-3" style={{ color: '#241c10', borderBottom: '1px solid #ddcda3' }}>
                        {title}
                      </h3>
                      <div className="font-mono uppercase mb-2" style={{ fontSize: '8px', letterSpacing: '0.12em', color: '#a85e12' }}>Author</div>
                      <p className="font-grotesk text-xs pb-1" style={{ color: '#6b5d46', borderBottom: '1px solid #ede3c8' }}>
                        {author}
                      </p>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden mt-5" style={{ background: '#e6dabd' }}>
                    <div className="h-full rounded-full" style={{ width: progress, background: '#d6870f' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Catalog */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="cyber-grid" />
        </div>
        <div className="hidden lg:block absolute pointer-events-none" style={{ right: '5%', top: '8%' }}>
          <Doodle type="book" size={76} rotate={-6} opacity={0.32} />
        </div>
        <div className="hidden lg:block absolute pointer-events-none" style={{ left: '4%', top: '42%' }}>
          <Doodle type="bookmark" size={60} rotate={10} opacity={0.3} />
        </div>
        <div className="hidden lg:block absolute pointer-events-none" style={{ right: '8%', bottom: '10%' }}>
          <Doodle type="coffee" size={64} rotate={-9} opacity={0.3} />
        </div>

        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-28 relative">
          <div className="flex flex-wrap justify-center gap-8">
            {distributeColumns(reading.books).map((col, ci) => (
              <div key={ci} className="flex flex-col" style={{ flex: '1 1 280px', maxWidth: 360 }}>
                {col.map(({ book, index }) => (
                  <BookCard key={book.title} book={book} index={index} />
                ))}
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-16">
            <div className="w-6 h-6 rounded-full border-2 border-dashed flex items-center justify-center"
              style={{ borderColor: '#ddd0ae' }}>
              <BookOpen size={10} style={{ color: '#ddd0ae' }} strokeWidth={1.5} />
            </div>
          </div>

          <div className="text-center mt-10">
            <span className="note" style={{ color: '#a85e12', fontSize: '22px', transform: 'rotate(-1deg)', display: 'inline-block' }}>
              — the rest are still in the drawer, one card at a time.
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
