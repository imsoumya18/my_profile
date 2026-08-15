import { useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// The stored field value is always just a URL string, whether it came from
// a pasted external link or an uploaded file (served back from
// /.netlify/functions/image) — so nothing downstream needs to know which.
export default function ImageField({ label, value, onChange }) {
  const [mode, setMode] = useState('url')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const fileInput = useRef(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const dataBase64 = await fileToBase64(file)
      const res = await fetch('/.netlify/functions/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type, dataBase64 }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Upload failed')
      }
      const { url } = await res.json()
      onChange(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-xs uppercase tracking-wide" style={{ color: '#8a7a5e' }}>{label}</span>
        <div className="flex gap-1">
          {['url', 'upload'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-sm"
              style={{
                background: mode === m ? '#241c10' : 'transparent',
                color: mode === m ? '#fdf9f0' : '#8a7a5e',
                border: '1px solid #e6dabd',
              }}
            >
              {m === 'url' ? 'Paste URL' : 'Upload'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex-shrink-0 rounded-sm overflow-hidden flex items-center justify-center" style={{ background: '#f6efdd', border: '1px solid #e6dabd' }}>
          {uploading ? (
            <Loader2 size={16} className="animate-spin" style={{ color: '#8a7a5e' }} />
          ) : value ? (
            <img src={value} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          ) : (
            <span className="font-mono text-[9px]" style={{ color: '#c2b28c' }}>none</span>
          )}
        </div>

        {mode === 'url' ? (
          <input
            key="url-input"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste an image URL, or an existing asset key"
            className="flex-1 min-w-0 px-3 py-2 font-grotesk text-sm rounded-sm outline-none transition-colors"
            style={{ background: '#fdf9f0', border: '1px solid #e6dabd', color: '#241c10' }}
            onFocus={(e) => { e.target.style.borderColor = '#d6870f' }}
            onBlur={(e) => { e.target.style.borderColor = '#e6dabd' }}
          />
        ) : (
          <input
            key="file-input"
            ref={fileInput}
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={uploading}
            className="flex-1 min-w-0 font-grotesk text-sm"
            style={{ color: '#6b5d46' }}
          />
        )}
      </div>
      {error && <p className="font-mono text-xs mt-1.5" style={{ color: '#a3271f' }}>{error}</p>}
    </div>
  )
}
