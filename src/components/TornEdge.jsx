import { useId } from 'react'

// Deterministic small PRNG so each seed always renders the same tear shape.
function rngFor(seed) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const VB_W = 1000
const VB_H = 90
const SEAM_Y = 46 // where the section boundary sits inside the strip

// A real torn-paper edge reads as a broad, gentle wave (the sheet separating)
// with small fibrous jaggedness riding on top of it — not a clean sawtooth.
function buildTornPath(seed) {
  const rng = rngFor(seed)
  const N = 70
  const phase = rng() * Math.PI * 2
  let d = ''
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const x = t * VB_W
    const bigWave = Math.sin(t * Math.PI * 2.4 + phase) * 11 + Math.sin(t * Math.PI * 1.1 + phase * 0.6) * 7
    const fiber = (rng() - 0.5) * 9
    const y = Math.max(18, Math.min(VB_H - 8, SEAM_Y + bigWave + fiber))
    d += i === 0 ? `M${x},${y} ` : `L${x},${y} `
  }
  d += `L${VB_W},${VB_H} L0,${VB_H} Z`
  return d
}

export default function TornEdge({ color, seed = 1, height = VB_H }) {
  const filterId = `torn-shadow-${useId()}`
  return (
    <svg
      className="absolute left-0 right-0 pointer-events-none"
      style={{ top: -SEAM_Y, height, width: '100%', zIndex: 5 }}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id={filterId} x="-10%" y="-60%" width="120%" height="240%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#241c10" floodOpacity="0.16" />
        </filter>
      </defs>
      <path d={buildTornPath(seed)} fill={color} filter={`url(#${filterId})`} />
    </svg>
  )
}
