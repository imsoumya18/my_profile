import { motion } from 'framer-motion'
import { Camera, ExternalLink } from 'lucide-react'
import profile from '../data/profile.json'
import clickingProfile from '../assets/images/clicking-profile.jpg'
import Doodle from '../components/Doodle'
import InstagramEmbed from '../components/InstagramEmbed'

const { clicks } = profile

// Corkboard-style scatter: each card gets its own tilt, nudge, tape angle
// and vertical offset so the gallery reads as pinned-up snapshots rather
// than a tidy grid. These embeds run 400-650px tall, so rotate/tx stay
// small on purpose — rotating a tall box even a few degrees swings its
// edges out sideways by height*sin(angle), and anything much past this
// clips against the viewport edge on a single-column (mobile) layout.
const SCATTER = [
  { rotate: -2,   tx: -4, ty: 6,  tape: -6, mt: 0,  mb: 76 },
  { rotate: 1.8,  tx: 5,  ty: -8, tape: 5,  mt: 70, mb: 64 },
  { rotate: -2.4, tx: 3,  ty: 10, tape: -8, mt: 14, mb: 80 },
  { rotate: 2,    tx: -5, ty: -6, tape: 6,  mt: 88, mb: 64 },
  { rotate: -1.6, tx: 4,  ty: 8,  tape: -4, mt: 28, mb: 72 },
]

// Instagram embeds resize themselves asynchronously (postMessage from the
// iframe, well after our own layout pass), and CSS multi-column's
// browser-calculated height balancing doesn't reliably re-run when that
// happens — the tallest column ends up overlapping whatever comes after it.
// Explicit flex columns sidestep that: each is normal block flow, so its
// height is just the sum of its children's, and it reflows correctly no
// matter when the iframes finish resizing.
const COLUMN_COUNT = 3
function distributeColumns(posts) {
  const columns = Array.from({ length: COLUMN_COUNT }, () => [])
  posts.forEach((post, i) => columns[i % COLUMN_COUNT].push({ post, index: i }))
  return columns
}

// Same hanging-photo treatment as TreksPage, but the "photo" is an
// Instagram embed instead of a background image.
function ClickCard({ url, scatter }) {
  const { rotate, tx, ty, tape, mt, mb } = scatter
  return (
    <div style={{ transform: `rotate(${rotate}deg) translate(${tx}px, ${ty}px)`, marginTop: mt, marginBottom: mb }}>
      <div className="relative">
        <div style={{
          position: 'absolute', top: -10, left: '50%', transform: `translateX(-50%) rotate(${tape}deg)`,
          width: 62, height: 20, background: 'rgba(214,135,15,0.3)', border: '1px solid rgba(168,94,18,0.22)', zIndex: 2,
        }} />
        <div style={{ background: '#fffdf7', padding: '10px 10px 16px', boxShadow: '0 14px 28px rgba(36,28,16,0.18), 0 2px 4px rgba(36,28,16,0.1)' }}>
          <InstagramEmbed url={url} />
        </div>
      </div>
    </div>
  )
}

export default function ClickingPage() {
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
              Through the<br />
              <span className="scribble-underline">
                Lens
                <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 12 Q 50 20 100 10 T 198 9" fill="none" stroke="#241c10" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="font-grotesk text-base leading-relaxed max-w-lg" style={{ color: '#6b5d46' }}>
              {clicks.tagline}
            </p>
          </div>

          {/* Hanging photo — same pinned treatment as the trek hero shot,
              plus a follow link tucked under the caption. */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-end lg:flex-shrink-0">
            <div className="relative" style={{ width: 'min(300px, 68vw)', transform: 'rotate(-3deg)' }}>
              <div style={{
                position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%) rotate(-2deg)',
                width: 84, height: 26, background: 'rgba(214,135,15,0.3)', border: '1px solid rgba(168,94,18,0.22)', zIndex: 2,
              }} />
              <div style={{ background: '#fffdf7', padding: '12px 12px 22px', boxShadow: '0 22px 45px rgba(36,28,16,0.22), 0 3px 6px rgba(36,28,16,0.12)' }}>
                <div style={{
                  aspectRatio: '1 / 1',
                  backgroundImage: `url(${clickingProfile})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'grayscale(100%) contrast(1.05)',
                }} />
                <div className="note text-center" style={{ marginTop: '10px', color: '#a85e12', fontSize: '15px' }}>
                  {clicks.instagramHandle}
                </div>
                <div className="flex justify-center mt-3">
                  <a
                    href={clicks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs px-3.5 py-1.5 rounded-full transition-colors duration-200"
                    style={{ color: '#fdf9f0', background: '#241c10' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#3a2f1f' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#241c10' }}
                  >
                    Follow along
                    <ExternalLink size={12} strokeWidth={1.8} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Gallery */}
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="cyber-grid" />
        </div>
        <div className="hidden lg:block absolute pointer-events-none" style={{ right: '5%', top: '6%' }}>
          <Doodle type="camera" size={72} rotate={8} opacity={0.32} />
        </div>
        <div className="hidden lg:block absolute pointer-events-none" style={{ left: '4%', top: '40%' }}>
          <Doodle type="aperture" size={66} rotate={-10} opacity={0.3} />
        </div>
        <div className="hidden lg:block absolute pointer-events-none" style={{ right: '7%', bottom: '8%' }}>
          <Doodle type="camera" size={58} rotate={12} opacity={0.3} />
        </div>

        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-32 relative">
          <div className="flex flex-wrap justify-center gap-8">
            {distributeColumns(clicks.posts).map((col, ci) => (
              <div key={ci} className="flex flex-col" style={{ flex: '1 1 320px', maxWidth: 400 }}>
                {col.map(({ post, index }) => (
                  <ClickCard key={post.url} url={post.url} scatter={SCATTER[index % SCATTER.length]} />
                ))}
              </div>
            ))}
          </div>

          {/* End cap */}
          <div className="flex justify-center mt-6">
            <div className="w-6 h-6 rounded-full border-2 border-dashed flex items-center justify-center"
              style={{ borderColor: '#ddd0ae' }}>
              <Camera size={10} style={{ color: '#ddd0ae' }} strokeWidth={1.5} />
            </div>
          </div>

          <div className="text-center mt-16">
            <span className="note" style={{ color: '#a85e12', fontSize: '22px', transform: 'rotate(-1deg)', display: 'inline-block' }}>
              — full roll's on the grid, this is just the contact sheet.
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
