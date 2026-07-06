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
const NIB_PATH = 'M9,1 h6 a2,2 0 0 1 2,2 v2 a2,2 0 0 1 -2,2 h-6 a2,2 0 0 1 -2,-2 v-2 a2,2 0 0 1 2,-2 Z M7,6 L3,13 L12,23 L21,13 L17,6 Z M10.2,11 a1.8,1.8 0 1,0 3.6,0 a1.8,1.8 0 1,0 -3.6,0 Z M11.6,12.8 L11.6,21 L12.4,21 L12.4,12.8 Z'

// Hovering a link circles it with the same hand-drawn wobble construction
// as InkCircle's "emphasis" mark elsewhere on the site, instead of a second,
// unrelated hover motif.
const circleRng = makeRng(7)

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
      const r = e.currentTarget.getBoundingClientRect()
      const padX = 10
      const padY = 8
      const w = r.width + padX * 2
      const h = r.height + padY * 2
      const d = circlePath(w / 2, h / 2, w / 2 - 2, h / 2 - 2, circleRng)
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
        nibPathRef.current.style.fill = hoverRef.current
          ? '#d6870f'
          : (onDarkRef.current ? '#fdf9f0' : '#241c10')
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
    if (!circle || !el) return
    const len = el.getTotalLength()
    el.style.transition = 'none'
    el.style.strokeDasharray = `${len}`
    el.style.strokeDashoffset = `${len}`
    // Force a layout flush so the dash reset above lands before the
    // transition kicks off, otherwise both changes get batched together.
    el.getBoundingClientRect()
    el.style.transition = 'stroke-dashoffset 0.35s cubic-bezier(0.22, 1, 0.36, 1)'
    el.style.strokeDashoffset = '0'
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
          style={{
            transformOrigin: `${NIB_TIP.x}px ${NIB_TIP.y}px`,
            transform: `rotate(${NIB_ANGLE}deg)`,
            transition: 'fill 0.2s',
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
            ref={circlePathRef}
            d={circle.d}
            fill="none"
            stroke="#d6870f"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </>
  )
}
