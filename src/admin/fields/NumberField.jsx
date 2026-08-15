export default function NumberField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="block font-mono text-xs uppercase tracking-wide mb-1.5" style={{ color: '#8a7a5e' }}>
        {label}
      </span>
      <input
        type="number"
        value={value ?? 0}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        className="w-full px-3 py-2 font-grotesk text-sm rounded-sm outline-none transition-colors"
        style={{ background: '#fdf9f0', border: '1px solid #e6dabd', color: '#241c10' }}
        onFocus={(e) => { e.target.style.borderColor = '#d6870f' }}
        onBlur={(e) => { e.target.style.borderColor = '#e6dabd' }}
      />
    </label>
  )
}
