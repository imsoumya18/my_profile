import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Star, Play, Film, ChevronLeft, ChevronRight } from 'lucide-react'
import { useProfile } from '../context/ProfileContext'
import Doodle from '../components/Doodle'

// YouTube serves a thumbnail for any public video at a predictable CDN URL
// keyed only by video ID — no API key or manual upload needed, unlike a
// real movie poster.
function youtubeThumbnail(url) {
  const match = url?.match(/(?:youtu\.be\/|[?&]v=)([\w-]{11})/)
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null
}

// Posters live in src/assets/images/watching/ and are referenced from
// profile.json by filename (no extension) — same import.meta.glob
// convention as trek photos. Titles without a "poster" field fall back to
// a stylized gradient swatch (same idea as Reading's cover art) instead of
// a broken image.
const posterModules = import.meta.glob('../assets/images/watching/*.{jpg,jpeg,png}', { eager: true, import: 'default' })
const posters = Object.fromEntries(
  Object.entries(posterModules).map(([path, url]) => [path.match(/([^/]+)\.\w+$/)[1], url])
)

const TYPE_COLORS = {
  Movie: '#d6870f',
  Series: '#a85e12',
  Documentary: '#6b5d46',
  YouTube: '#d6342a',
  Podcast: '#8a7a5e',
}

const FALLBACK_GRADIENTS = [
  'linear-gradient(160deg, #d6870f 0%, #a85e12 100%)',
  'linear-gradient(160deg, #6b5d46 0%, #3a2f1f 100%)',
  'linear-gradient(160deg, #d6342a 0%, #a3271f 100%)',
  'linear-gradient(160deg, #a85e12 0%, #6b3d0f 100%)',
]

// Reels render in this order; any type not listed here (data drifts faster
// than code) still gets its own reel, just tacked on at the end.
const CATEGORY_ORDER = ['Movie', 'Series', 'Documentary', 'Podcast', 'YouTube']
const CATEGORY_LABELS = {
  Movie: 'Movies',
  Series: 'Series',
  Documentary: 'Documentaries',
  Podcast: 'Podcasts',
  YouTube: 'YouTube',
}

function groupByType(titles) {
  const groups = {}
  titles.forEach((t) => {
    if (!groups[t.type]) groups[t.type] = []
    groups[t.type].push(t)
  })
  const order = [
    ...CATEGORY_ORDER.filter((c) => groups[c]),
    ...Object.keys(groups).filter((c) => !CATEGORY_ORDER.includes(c)),
  ]
  return order.map((type) => ({ type, titles: groups[type] }))
}

function StarRow({ rating, size = 11 }) {
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

function FrameCard({ title, index }) {
  const typeColor = TYPE_COLORS[title.type] || '#6b5d46'
  // "poster" is either a bundled asset key (pre-committed images) or, for
  // anything added through the admin panel, a direct URL — either a pasted
  // link or one served back from the image-upload Function. Both cases are
  // just a URL by the time they get here.
  const poster = (title.poster && (posters[title.poster] || title.poster)) || youtubeThumbnail(title.url)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex-shrink-0"
      style={{ width: 300, background: '#fdf9f0', border: '3px solid #241c10' }}
    >
      {poster ? (
        <div style={{ aspectRatio: '4 / 3', backgroundImage: `url(${poster})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      ) : (
        <div className="flex items-center justify-center font-hand" style={{
          aspectRatio: '4 / 3', background: FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length],
          fontSize: '34px', color: 'rgba(255,253,247,0.88)',
        }}>
          {title.title[0]}
        </div>
      )}
      <div className="p-4">
        <div className="mb-2.5">
          <span className="font-mono uppercase px-1.5 py-0.5"
            style={{ fontSize: '8px', letterSpacing: '0.08em', color: '#fdf9f0', background: typeColor }}>
            {title.type}
          </span>
        </div>

        <h3 className="font-note text-base leading-snug mb-1" style={{ color: '#241c10' }}>
          {title.title}
        </h3>
        <div className="font-mono text-xs mb-2.5" style={{ color: '#8a7a5e' }}>
          {title.watched}
        </div>

        {title.rating != null && (
          <div className="mb-2.5">
            <StarRow rating={title.rating} />
          </div>
        )}

        {title.note && (
          <p className="font-grotesk text-xs leading-relaxed" style={{ color: '#6b5d46' }}>
            {title.note}
          </p>
        )}
      </div>
    </motion.div>
  )
}

// A real filmstrip: a dark reel with sprocket holes running along the top
// and bottom, frames sitting in a single row you scroll through sideways —
// the way film actually runs — instead of a page that grows taller with
// every title ever watched.
function FilmstripReel({ titles }) {
  const scrollRef = useRef(null)
  const pausedRef = useRef(false)
  const resumeTimeout = useRef(null)
  const pauseForABit = () => {
    pausedRef.current = true
    clearTimeout(resumeTimeout.current)
    resumeTimeout.current = setTimeout(() => { pausedRef.current = false }, 2500)
  }
  const scrollBy = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 330, behavior: 'smooth' })
    pauseForABit()
  }
  const holes = {
    backgroundImage: 'repeating-linear-gradient(to right, #fdf9f0 0 7px, transparent 7px 17px)',
  }

  // Reels with more than 4 titles keep drifting on their own, right to
  // left, looping back to the start once it runs out of room. Shorter
  // reels already show everything at a glance, so they stay put.
  //
  // Pauses immediately while hovered (mouse enter/leave), and also on any
  // actual scroll activity (wheel, trackpad, touch drag, arrow keys) for a
  // couple seconds after. Every write we make to scrollLeft is flagged via
  // `selfScroll` first so it doesn't re-trigger the scroll-based pause on
  // itself; anything unflagged came from the user. This also avoids the
  // earlier bug where a manual drag that landed near the end got read as
  // "reached the end" and yanked back to 0 — the auto-scroll simply
  // doesn't touch scrollLeft while paused.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    if (titles.length <= 4) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf
    let selfScroll = false
    let hovered = false
    const step = () => {
      if (!pausedRef.current && !hovered && el.scrollWidth > el.clientWidth) {
        const maxScroll = el.scrollWidth - el.clientWidth
        selfScroll = true
        el.scrollLeft = el.scrollLeft >= maxScroll - 2.45 ? 0 : el.scrollLeft + 2.45
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    const onScroll = () => {
      if (selfScroll) { selfScroll = false; return }
      pauseForABit()
    }
    el.addEventListener('scroll', onScroll, { passive: true })

    // Hover is tracked from real cursor coordinates on `mousemove`, not
    // `mouseenter`/`mouseleave` — Safari/WebKit is known to fire those
    // synthetically whenever the DOM changes under an already-stationary
    // cursor (not just on actual pointer movement), which could latch this
    // into a permanently-"hovered", permanently-frozen state with no way
    // to clear it short of the user nudging their mouse. Computing hover
    // from the cursor's live position instead means it can only change in
    // response to real movement.
    const onMouseMove = (e) => {
      const r = el.getBoundingClientRect()
      hovered = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(resumeTimeout.current)
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [titles])

  return (
    <div className="relative">
      <button
        onClick={() => scrollBy(-1)}
        aria-label="Scroll left"
        className="hidden sm:flex absolute items-center justify-center rounded-full"
        style={{ left: -18, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, background: '#241c10', color: '#fdf9f0', zIndex: 2 }}
      >
        <ChevronLeft size={16} strokeWidth={2} />
      </button>
      <button
        onClick={() => scrollBy(1)}
        aria-label="Scroll right"
        className="hidden sm:flex absolute items-center justify-center rounded-full"
        style={{ right: -18, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, background: '#241c10', color: '#fdf9f0', zIndex: 2 }}
      >
        <ChevronRight size={16} strokeWidth={2} />
      </button>

      <div ref={scrollRef} className="no-scrollbar" style={{ overflowX: 'auto' }}>
        <div className="relative inline-flex" style={{ background: '#241c10', padding: '16px 20px' }}>
          <div className="absolute left-0 right-0" style={{ top: 6, height: 6, ...holes, opacity: 0.7 }} />
          <div className="absolute left-0 right-0" style={{ bottom: 6, height: 6, ...holes, opacity: 0.7 }} />
          <div className="relative flex gap-3">
            {titles.map((title, i) => (
              <FrameCard key={title.title} title={title} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Edge fades hint that the reel keeps going */}
      <div className="hidden sm:block absolute top-0 bottom-0 left-0 pointer-events-none" style={{ width: 32, background: 'linear-gradient(to right, #fdf9f0, transparent)' }} />
      <div className="hidden sm:block absolute top-0 bottom-0 right-0 pointer-events-none" style={{ width: 32, background: 'linear-gradient(to left, #fdf9f0, transparent)' }} />
    </div>
  )
}

export default function WatchingPage() {
  const { watching } = useProfile()
  const { title, type, progress, url, poster } = watching.nowWatching
  const NowWatchingWrapper = url ? 'a' : 'div'
  const wrapperProps = url ? { href: url, target: '_blank', rel: 'noreferrer' } : {}
  const thumbnail = (poster && (posters[poster] || poster)) || youtubeThumbnail(url)

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
              Now<br />
              <span className="scribble-underline">
                Showing
                <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 12 Q 50 20 100 10 T 198 9" fill="none" stroke="#241c10" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="font-grotesk text-base leading-relaxed max-w-lg" style={{ color: '#6b5d46' }}>
              {watching.tagline}
            </p>
          </div>

          {/* Now watching — a paused frame, projector still running. When
              nothing's set, the frame stays but shows an empty-reel state
              instead of a blank title/type. */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-end lg:flex-shrink-0">
            <div className="relative" style={{ width: 'min(280px, 70vw)', transform: 'rotate(-2deg)' }}>
              {title ? (
                <NowWatchingWrapper {...wrapperProps} style={{ display: 'block', background: '#241c10', border: '3px solid #241c10', boxShadow: '0 22px 45px rgba(36,28,16,0.25), 0 3px 6px rgba(36,28,16,0.15)' }}>
                  <div style={{ height: 6, backgroundImage: 'repeating-linear-gradient(to right, #fdf9f0 0 7px, transparent 7px 17px)', opacity: 0.7 }} />
                  <div className="relative flex items-center justify-center" style={{
                    aspectRatio: '16 / 10', background: thumbnail ? `#3a2f1f url(${thumbnail}) center/cover` : '#3a2f1f',
                  }}>
                    {thumbnail && <div className="absolute inset-0" style={{ background: 'rgba(36,28,16,0.25)' }} />}
                    <div className="relative rounded-full flex items-center justify-center" style={{ width: 52, height: 52, background: 'rgba(253,249,240,0.15)' }}>
                      <Play size={22} fill="#fdf9f0" style={{ color: '#fdf9f0' }} />
                    </div>
                  </div>
                  <div style={{ height: 6, backgroundImage: 'repeating-linear-gradient(to right, #fdf9f0 0 7px, transparent 7px 17px)', opacity: 0.7 }} />
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono uppercase inline-block px-2 py-0.5 rounded-sm"
                        style={{ fontSize: '9px', letterSpacing: '0.08em', color: '#241c10', background: '#d6870f' }}>
                        Now Watching
                      </span>
                      <span className="font-mono uppercase" style={{ fontSize: '9px', letterSpacing: '0.08em', color: '#a3947a' }}>
                        {type}
                      </span>
                    </div>
                    <h3 className="font-note text-xl leading-snug mb-1" style={{ color: '#fdf9f0' }}>{title}</h3>
                    {progress && <p className="font-mono text-xs" style={{ color: '#a3947a' }}>{progress}</p>}
                  </div>
                </NowWatchingWrapper>
              ) : (
                <div style={{ display: 'block', background: '#241c10', border: '3px solid #241c10', boxShadow: '0 22px 45px rgba(36,28,16,0.25), 0 3px 6px rgba(36,28,16,0.15)' }}>
                  <div style={{ height: 6, backgroundImage: 'repeating-linear-gradient(to right, #fdf9f0 0 7px, transparent 7px 17px)', opacity: 0.7 }} />
                  <div className="relative flex items-center justify-center" style={{ aspectRatio: '16 / 10', background: '#3a2f1f' }}>
                    <Film size={26} strokeWidth={1.5} style={{ color: 'rgba(253,249,240,0.3)' }} />
                  </div>
                  <div style={{ height: 6, backgroundImage: 'repeating-linear-gradient(to right, #fdf9f0 0 7px, transparent 7px 17px)', opacity: 0.7 }} />
                  <div className="px-5 py-4">
                    <span className="font-mono uppercase inline-block px-2 py-0.5 rounded-sm mb-2"
                      style={{ fontSize: '9px', letterSpacing: '0.08em', color: '#a3947a', background: 'rgba(253,249,240,0.08)' }}>
                      Now Watching
                    </span>
                    <h3 className="font-note text-xl leading-snug" style={{ color: '#a3947a' }}>Nothing queued</h3>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Reel */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="cyber-grid" />
        </div>
        <div className="hidden lg:block absolute pointer-events-none" style={{ right: '5%', top: '10%' }}>
          <Doodle type="filmreel" size={70} rotate={-6} opacity={0.32} />
        </div>
        <div className="hidden lg:block absolute pointer-events-none" style={{ left: '4%', bottom: '14%' }}>
          <Doodle type="camera" size={58} rotate={9} opacity={0.3} />
        </div>

        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 relative">
          <div className="flex flex-col gap-14">
            {groupByType(watching.titles).map(({ type, titles }) => (
              <div key={type}>
                <div className="flex items-baseline gap-3 mb-5">
                  <h2 className="font-note text-2xl" style={{ color: '#241c10' }}>
                    {CATEGORY_LABELS[type] || type}
                  </h2>
                  <span className="font-mono text-xs" style={{ color: '#a3947a' }}>
                    {titles.length}
                  </span>
                </div>
                <FilmstripReel titles={titles} />
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-14">
            <div className="w-6 h-6 rounded-full border-2 border-dashed flex items-center justify-center"
              style={{ borderColor: '#ddd0ae' }}>
              <Film size={10} style={{ color: '#ddd0ae' }} strokeWidth={1.5} />
            </div>
          </div>

          <div className="text-center mt-8">
            <span className="note" style={{ color: '#a85e12', fontSize: '22px', transform: 'rotate(-1deg)', display: 'inline-block' }}>
              — that's a wrap, for now.
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
