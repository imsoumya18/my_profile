import { useEffect, useRef, useState } from 'react'
import { makeRng, circlePath } from './InkCircle'

// Hovering a link circles it with the same hand-drawn wobble construction
// as InkCircle's "emphasis" mark elsewhere on the site, in the site's own
// saffron-deep accent. Several nav items also turn saffron on hover, so the
// circle gets a thin dark "halo" stroke underneath it purely so its line
// stays legible crossing same-colored text — the halo isn't a color
// change, just an outline. This is independent of the actual mouse
// pointer, which stays the plain system cursor.
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

export default function HoverCircle() {
  const [enabled, setEnabled] = useState(false)
  const [circle, setCircle] = useState(null)
  const circlePathRef = useRef(null)
  const haloPathRef = useRef(null)

  useEffect(() => {
    setEnabled(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [])

  useEffect(() => {
    if (!enabled) return

    // Track which elements already have listeners so re-scans on DOM
    // mutation don't keep stacking duplicate bindings.
    const bound = new WeakSet()
    const onEnter = (e) => {
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
    const onLeave = () => setCircle(null)
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

    return () => obs.disconnect()
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

  if (!enabled || !circle) return null

  return (
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
  )
}
