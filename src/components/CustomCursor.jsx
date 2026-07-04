import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const mouse   = useRef({ x: -100, y: -100 })
  const ring    = useRef({ x: -100, y: -100 })
  const hoverRef = useRef(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const move = (e) => { mouse.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', move, { passive: true })

    const onEnter = () => { hoverRef.current = true }
    const onLeave = () => { hoverRef.current = false }

    // Track which elements already have listeners so re-scans on DOM
    // mutation don't keep stacking duplicate bindings.
    const bound = new WeakSet()
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

    const lerp = (a, b, t) => a + (b - a) * t
    let raf
    const loop = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x - 3}px, ${mouse.current.y - 3}px)`
      }
      if (ringRef.current) {
        ring.current.x = lerp(ring.current.x, mouse.current.x, 0.1)
        ring.current.y = lerp(ring.current.y, mouse.current.y, 0.1)
        const s = hoverRef.current ? 2.4 : 1
        ringRef.current.style.transform = `translate(${ring.current.x - 16}px, ${ring.current.y - 16}px) scale(${s})`
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

  if (!enabled) return null

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{ width: 6, height: 6, background: '#241c10', willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full"
        style={{
          width: 32,
          height: 32,
          border: '1px solid rgba(36,28,16,0.3)',
          transition: 'transform 0.15s, opacity 0.2s',
          willChange: 'transform',
        }}
      />
    </>
  )
}
