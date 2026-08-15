export default function TextField({ label, value, onChange, textarea = false }) {
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <label className="block">
      <span className="block font-mono text-xs uppercase tracking-wide mb-1.5" style={{ color: '#8a7a5e' }}>
        {label}
      </span>
      <Tag
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        rows={textarea ? 3 : undefined}
        className="w-full px-3 py-2 font-grotesk text-sm rounded-sm outline-none transition-colors"
        style={{ background: '#fdf9f0', border: '1px solid #e6dabd', color: '#241c10', resize: textarea ? 'vertical' : undefined }}
        onFocus={(e) => { e.target.style.borderColor = '#d6870f' }}
        onBlur={(e) => { e.target.style.borderColor = '#e6dabd' }}
      />
    </label>
  )
}
