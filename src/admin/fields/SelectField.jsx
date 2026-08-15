export default function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="block font-mono text-xs uppercase tracking-wide mb-1.5" style={{ color: '#8a7a5e' }}>
        {label}
      </span>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 font-grotesk text-sm rounded-sm outline-none"
        style={{ background: '#fdf9f0', border: '1px solid #e6dabd', color: '#241c10' }}
      >
        <option value="">—</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </label>
  )
}
