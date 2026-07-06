import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

let scriptPromise = null
function loadInstagramScript() {
  if (window.instgrm) return Promise.resolve()
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://www.instagram.com/embed.js'
    script.async = true
    script.onload = resolve
    document.body.appendChild(script)
  })
  return scriptPromise
}

// Renders Instagram's official oEmbed blockquote and asks embed.js to hydrate
// it into an iframe. Only kicks off once the card scrolls near the viewport,
// and stays hidden behind a paper-toned skeleton until an iframe actually
// lands — embed.js processing is async (it fetches oEmbed data), so "script
// loaded" and "post rendered" are different moments.
export default function InstagramEmbed({ url }) {
  const wrapRef = useRef(null)
  const inView = useInView(wrapRef, { once: true, margin: '200px' })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!inView) return
    const el = wrapRef.current
    loadInstagramScript().then(() => window.instgrm?.Embeds.process())

    const mo = new MutationObserver(() => {
      if (el.querySelector('iframe')) {
        setLoaded(true)
        mo.disconnect()
      }
    })
    if (el) mo.observe(el, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [inView])

  return (
    <div ref={wrapRef} className="relative" style={{ minHeight: loaded ? undefined : 420 }}>
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 animate-pulse"
          style={{ background: '#f6efdd', border: '1px solid #e6dabd' }}>
          <div className="w-10 h-10 rounded-full" style={{ background: '#e6dabd' }} />
          <div className="w-2/3 h-3 rounded-full" style={{ background: '#e6dabd' }} />
          <div className="note" style={{ color: '#a85e12', fontSize: '14px' }}>loading the frame…</div>
        </div>
      )}
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={`${url}/`}
        data-instgrm-version="14"
        style={{ background: '#FFF', border: 0, margin: 0, maxWidth: 400, minWidth: 280, width: '100%' }}
      />
    </div>
  )
}
