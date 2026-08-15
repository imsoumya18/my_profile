import * as LucideIcons from 'lucide-react'

export default function IconField({ label, value, onChange }) {
  const Icon = value && LucideIcons[value]
  return (
    <label className="block">
      <span className="block font-mono text-xs uppercase tracking-wide mb-1.5" style={{ color: '#8a7a5e' }}>
        {label} <span style={{ color: '#c2b28c' }}>(Lucide icon name)</span>
      </span>
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 flex items-center justify-center rounded-sm flex-shrink-0" style={{ background: '#f6efdd', border: '1px solid #e6dabd' }}>
          {Icon ? <Icon size={16} style={{ color: '#6b5d46' }} strokeWidth={1.5} /> : <span className="font-mono text-xs" style={{ color: '#c2b28c' }}>?</span>}
        </div>
        <input
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Briefcase"
          className="flex-1 min-w-0 px-3 py-2 font-grotesk text-sm rounded-sm outline-none transition-colors"
          style={{ background: '#fdf9f0', border: '1px solid #e6dabd', color: '#241c10' }}
          onFocus={(e) => { e.target.style.borderColor = '#d6870f' }}
          onBlur={(e) => { e.target.style.borderColor = '#e6dabd' }}
        />
      </div>
    </label>
  )
}
