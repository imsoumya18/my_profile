import { useLayoutEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

// Seeded PRNG so a given variant always draws the same "hand", but different
// variants (and different content sizes) never look identical.
function makeRng(seed) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// A single wobbly loop built from four bezier arcs, each quarter-turn nudged
// in angle and radius — the same construction as the classic hand-drawn-
// circle trick (github.com/spencerthayer/nhjwu), seeded and built directly
// in the content box's own pixel space (cx/cy/rx/ry) rather than a
// normalized unit circle, so its real rendered arc length is sane and
// `getTotalLength()` gives a usable value for the dash-draw animation.
function circlePath(cx, cy, rx, ry, rng, drMin = -0.15, drMax = 0.05, startMin = 150, startMax = 190, dThetaMin = 0.05, dThetaMax = 0.3) {
  const c = 0.551915024494
  const beta = Math.atan(c)
  const d = Math.sqrt(c * c + 1)
  const at = (r, theta) => [cx + rx * r * Math.sin(theta), cy + ry * r * Math.cos(theta)]

  let r = 0.9
  let theta = ((startMin + rng() * (startMax - startMin)) * Math.PI) / 180

  const [sx, sy] = at(r, theta)
  let path = `M${sx.toFixed(2)},${sy.toFixed(2)} `
  const [c0x, c0y] = at(d * r, theta + beta)
  path += `C${c0x.toFixed(2)},${c0y.toFixed(2)} `

  for (let i = 0; i < 4; i++) {
    theta += (Math.PI / 2) * (1 + dThetaMin + rng() * (dThetaMax - dThetaMin))
    r *= 1 + drMin + rng() * (drMax - drMin)
    const [c2x, c2y] = at(d * r, theta - beta)
    const [ex, ey] = at(r, theta)
    path += `${i ? 'S' : ''}${c2x.toFixed(2)},${c2y.toFixed(2)} ${ex.toFixed(2)},${ey.toFixed(2)} `
  }
  return path.trim()
}

// Wraps its children with a hand-drawn "circled for emphasis" mark that
// draws itself in (measured arc length + animated stroke-dashoffset) the
// first time it scrolls into view, rather than appearing instantly.
export default function InkCircle({ children, color = '#d6342a', variant = 0, padX = 26, padY = 20, strokeWidth = 3.2 }) {
  const wrapRef = useRef(null)
  const contentRef = useRef(null)
  const pathRef = useRef(null)
  const [box, setBox] = useState(null)
  const [len, setLen] = useState(null)
  const inView = useInView(wrapRef, { once: true, margin: '-10%' })

  useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return
    const measure = () => {
      const w = el.offsetWidth + padX * 2
      const h = el.offsetHeight + padY * 2
      setBox((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [padX, padY])

  const path = box
    ? circlePath(box.w / 2, box.h / 2, box.w / 2 - strokeWidth * 1.5, box.h / 2 - strokeWidth * 1.5, makeRng(variant * 9973 + 17))
    : null

  useLayoutEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength())
  }, [path])

  return (
    <span ref={wrapRef} className="relative inline-flex" style={{ padding: `${padY}px ${padX}px` }}>
      <span ref={contentRef} className="relative z-10">{children}</span>
      {box && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${box.w} ${box.h}`}
          aria-hidden="true"
          style={{ overflow: 'visible' }}
        >
          <path
            ref={pathRef}
            d={path}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              strokeDasharray: len ? `${len}` : '0 99999',
              strokeDashoffset: len ? (inView ? '0' : `${len}`) : '0',
              transition: len ? 'stroke-dashoffset 900ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
            }}
          />
        </svg>
      )}
    </span>
  )
}
