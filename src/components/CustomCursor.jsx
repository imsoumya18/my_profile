import { useEffect, useRef, useState } from 'react'
import { makeRng, circlePath } from './InkCircle'

// A fountain-pen nib stands in for the cursor — its tip (not its center)
// sits at the real pointer position, so it reads as something pointing
// rather than a shape floating over the page. Held at a fixed angle (not
// re-oriented per movement — that read as jittery rather than
// characterful), tipped up-left with the body trailing down-right, the
// same convention as a standard arrow pointer. The breather hole and slit
// are true knockouts (fill-rule evenodd) rather than a white overlay, so
// it reads correctly over any section's background.
const NIB_TIP = { x: 12, y: 23 }
const NIB_ANGLE = 135
const NIB_PATH = 'M9.75,1 h4.5 a1.5,1.5 0 0 1 1.5,1.5 v3 a1.5,1.5 0 0 1 -1.5,1.5 h-4.5 a1.5,1.5 0 0 1 -1.5,-1.5 v-3 a1.5,1.5 0 0 1 1.5,-1.5 Z M8.25,6 L5.25,13 L12,23 L18.75,13 L15.75,6 Z M10.5,11 a1.5,1.5 0 1,0 3,0 a1.5,1.5 0 1,0 -3,0 Z M11.7,12.8 L11.7,21 L12.3,21 L12.3,12.8 Z'

// Hovering a link circles it with the same hand-drawn wobble construction
// as InkCircle's "emphasis" mark elsewhere on the site, in the site's own
// saffron accent. Several nav items also turn saffron on hover, so the
// circle gets a thin dark "halo" stroke underneath it (see the two <path>s
// below) purely so its line stays legible crossing same-colored text —
// the halo isn't a color change, just an outline.
const HOVER_COLOR = '#a85e12'
const circleRng = makeRng(7)

// Many hover targets are full-width flex rows (nav dropdown items, padded
// buttons) — their own bounding box is the whole padded cell, not the icon
// and label inside it. A Range over the element's contents bounds only
// what's actually rendered (text runs, inline icons), skipping the
// element's own padding, so the circle wraps the visible content instead
// of the whole row.
function contentRect(el) {
  const range = document.createRange()
  range.selectNodeContents(el)
  const r = range.getBoundingClientRect()
  return r.width > 0 && r.height > 0 ? r : el.getBoundingClientRect()
}

function luminance(rgbStr) {
  const m = rgbStr.match(/\d+/g)
  if (!m) return 255
  const [r, g, b] = m.map(Number)
  return 0.299 * r + 0.587 * g + 0.114 * b
}

// The site is almost entirely paper-cream, but a few elements (completed
// trek cards, dark buttons) go dark-ink for contrast — the same ink tone
// this cursor uses by default, so it'd vanish there. Walk up from the point
// under the cursor to the nearest element with a real background and flip
// the nib to the light tone when that background is dark.
function isOverDarkBg(x, y) {
  let el = document.elementFromPoint(x, y)
  while (el && el !== document.body) {
    const bg = getComputedStyle(el).backgroundColor
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      return luminance(bg) < 128
    }
    el = el.parentElement
  }
  return false
}

export default function CustomCursor() {
  const nibRef = useRef(null)
  const nibPathRef = useRef(null)
  const mouse = useRef({ x: -100, y: -100 })
  const pos   = useRef({ x: -100, y: -100 })
  const hoverRef = useRef(false)
  const onDarkRef = useRef(false)
  const [enabled, setEnabled] = useState(false)
  const [circle, setCircle] = useState(null)
  const circlePathRef = useRef(null)
  const haloPathRef = useRef(null)

  useEffect(() => {
    setEnabled(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [])

  useEffect(() => {
    if (!enabled) return
    let lastBgCheck = 0
    const move = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      const now = performance.now()
      if (now - lastBgCheck > 80) {
        lastBgCheck = now
        onDarkRef.current = isOverDarkBg(e.clientX, e.clientY)
      }
    }
    window.addEventListener('mousemove', move, { passive: true })

    // Track which elements already have listeners so re-scans on DOM
    // mutation don't keep stacking duplicate bindings.
    const bound = new WeakSet()
    const onEnter = (e) => {
      hoverRef.current = true
      // Cards and pills with their own rich hover treatment (border
      // highlight, lift, background swap) mark themselves data-plain-hover
      // so the circle doesn't pile a second hover effect on top.
      if (e.currentTarget.hasAttribute('data-plain-hover')) return
      const r = contentRect(e.currentTarget)
      const padX = 14
      const padY = 11
      const w = r.width + padX * 2
      const h = r.height + padY * 2
      // Tighter radius jitter than InkCircle's default — this circle sits
      // much closer to its content than a stat-number emphasis mark does,
      // so a wide wobble dips inward enough to cut through the text.
      const d = circlePath(w / 2, h / 2, w / 2 - 2, h / 2 - 2, circleRng, 8, -0.035, 0.02)
      setCircle({ left: r.left - padX, top: r.top - padY, w, h, d })
    }
    const onLeave = () => {
      hoverRef.current = false
      setCircle(null)
    }
    const addHoverListeners = () => {
      document.querySelectorAll('a, button').forEach((el) => {
        if (bound.has(el)) return
        bound.add(el)
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }
    addHoverListeners()
    const obs = new MutationObserver(addHoverListeners)
    obs.observe(document.body, { childList: true, subtree: true })

    let raf
    const loop = () => {
      if (nibRef.current) {
        pos.current.x += (mouse.current.x - pos.current.x) * 0.28
        pos.current.y += (mouse.current.y - pos.current.y) * 0.28
        nibRef.current.style.transform =
          `translate(${pos.current.x - NIB_TIP.x}px, ${pos.current.y - NIB_TIP.y}px)`
      }
      if (nibPathRef.current) {
        // Background-color detection only ever knows about the element's
        // own CSS background — it says nothing about large dark text (or
        // an image) sitting directly under the nib, which can still be the
        // same tone as the fill and make the nib disappear into a letter.
        // A thin outline in the opposite tone keeps the silhouette visible
        // regardless of what's immediately behind it.
        nibPathRef.current.style.fill = hoverRef.current
          ? HOVER_COLOR
          : (onDarkRef.current ? '#fdf9f0' : '#241c10')
        nibPathRef.current.style.stroke = onDarkRef.current ? '#241c10' : '#fdf9f0'
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
      obs.disconnect()
    }
  }, [enabled])

  useEffect(() => {
    const el = circlePathRef.current
    const halo = haloPathRef.current
    if (!circle || !el || !halo) return
    const len = el.getTotalLength()
    for (const p of [el, halo]) {
      p.style.transition = 'none'
      p.style.strokeDasharray = `${len}`
      p.style.strokeDashoffset = `${len}`
    }
    // Force a layout flush so the dash reset above lands before the
    // transition kicks off, otherwise both changes get batched together.
    el.getBoundingClientRect()
    for (const p of [el, halo]) {
      p.style.transition = 'stroke-dashoffset 0.35s cubic-bezier(0.22, 1, 0.36, 1)'
      p.style.strokeDashoffset = '0'
    }
  }, [circle])

  if (!enabled) return null

  return (
    <>
      <svg
        ref={nibRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        width="26"
        height="26"
        viewBox="0 0 24 24"
        style={{ willChange: 'transform', overflow: 'visible' }}
      >
        <path
          ref={nibPathRef}
          d={NIB_PATH}
          fillRule="evenodd"
          strokeWidth="0.6"
          strokeLinejoin="round"
          style={{
            transformOrigin: `${NIB_TIP.x}px ${NIB_TIP.y}px`,
            transform: `rotate(${NIB_ANGLE}deg)`,
            transition: 'fill 0.2s, stroke 0.2s',
          }}
        />
      </svg>
      {circle && (
        <svg
          className="fixed z-[9998] pointer-events-none"
          style={{ left: circle.left, top: circle.top, width: circle.w, height: circle.h, overflow: 'visible' }}
          viewBox={`0 0 ${circle.w} ${circle.h}`}
          aria-hidden="true"
        >
          <path
            ref={haloPathRef}
            d={circle.d}
            fill="none"
            stroke="#241c10"
            strokeWidth="2.8"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            ref={circlePathRef}
            d={circle.d}
            fill="none"
            stroke={HOVER_COLOR}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </>
  )
}
