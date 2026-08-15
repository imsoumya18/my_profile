export default function BooleanField({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer">
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4"
        style={{ accentColor: '#d6870f' }}
      />
      <span className="font-mono text-xs uppercase tracking-wide" style={{ color: '#8a7a5e' }}>
        {label}
      </span>
    </label>
  )
}
