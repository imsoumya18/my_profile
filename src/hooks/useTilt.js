import { useRef, useState } from 'react'

// The subtle mouse-tracking tilt + glow used on project cards — extracted
// so Achievements' award cards and Contact's tiles can share the same
// "slightly moving" hover instead of a border-color swap.
export default function useTilt() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glow, setGlow] = useState({ x: 50, y: 50 })
  const ref = useRef(null)

  const onMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setTilt({ x: (y - 0.5) * -10, y: (x - 0.5) * 10 })
    setGlow({ x: x * 100, y: y * 100 })
  }
  const onMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setGlow({ x: 50, y: 50 })
  }

  return { ref, tilt, glow, onMouseMove, onMouseLeave }
}
