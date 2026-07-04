import { useLayoutEffect, useRef, useState } from 'react'

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

function ellipsePoints(cx, cy, rx, ry, rng, n, jitter, startDeg) {
  const pts = []
  for (let i = 0; i < n; i++) {
    const deg = startDeg + i * (360 / n)
    const rad = (deg * Math.PI) / 180
    const jr = (rng() * 2 - 1) * jitter
    pts.push([cx + rx * (1 + jr) * Math.cos(rad), cy + ry * (1 + jr * 0.7) * Math.sin(rad)])
  }
  return pts
}

// Catmull-Rom -> cubic bezier, closed loop.
function smoothClosedPath(pts) {
  const n = pts.length
  let d = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)} `
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i % n]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C ${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)} `
  }
  return d.trim()
}

// Builds a mark sized to the actual content box: a hand-circled ellipse traced
// twice (like circling something quickly for emphasis), ending in a small flick
// where the pen lifts off — dimensions and wobble both derive from W/H and seed,
// so no two marks (or content lengths) come out looking identical.
function buildMark(W, H, seed, stroke) {
  const rng = makeRng(seed * 9973 + 17)
  const cx = W / 2
  const cy = H / 2
  const rx = W / 2 - stroke * 1.3
  const ry = H / 2 - stroke * 1.3

  const pts1 = ellipsePoints(cx, cy, rx, ry, rng, 11, 0.045, -95)
  const path1 = smoothClosedPath(pts1)

  const nudgeX = -0.05 * rx
  const nudgeY = -0.1 * ry
  const pts2 = ellipsePoints(cx + nudgeX, cy + nudgeY, rx * 0.97, ry * 0.97, rng, 11, 0.05, -100)
  const path2 = smoothClosedPath(pts2)

  const [sx, sy] = pts2[0]
  const [nx, ny] = pts2[1]
  let dx = sx - nx
  let dy = sy - ny
  const norm = Math.hypot(dx, dy) || 1
  dx /= norm
  dy /= norm
  const flickLen = Math.min(rx, ry) * 0.6
  const fx = sx + dx * flickLen * 0.6 - dy * flickLen * 0.9
  const fy = sy + dy * flickLen * 0.6 - dx * flickLen * 0.2
  const flick = `M ${sx.toFixed(1)},${sy.toFixed(1)} L ${fx.toFixed(1)},${fy.toFixed(1)}`

  return [path1, path2, flick]
}

// Wraps its children with a hand-drawn "circled for emphasis" mark. The mark's
// size and wobble are computed from the rendered content box, so a short value
// and a long one each get a naturally-proportioned loop rather than one shape
// stretched to fit.
export default function InkCircle({ children, color = '#d6870f', variant = 0, padX = 14, padY = 8, strokeWidth = 2.6 }) {
  const contentRef = useRef(null)
  const [box, setBox] = useState(null)

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

  const [path1, path2, flick] = box ? buildMark(box.w, box.h, variant + 1, strokeWidth) : [null, null, null]

  return (
    <span className="relative inline-flex" style={{ padding: `${padY}px ${padX}px` }}>
      <span ref={contentRef} className="relative z-10">{children}</span>
      {box && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${box.w} ${box.h}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{ overflow: 'visible' }}
        >
          <path d={path1} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d={path2} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d={flick} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      )}
    </span>
  )
}
