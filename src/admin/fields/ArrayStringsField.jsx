import { Plus, X, ChevronUp, ChevronDown } from 'lucide-react'

export default function ArrayStringsField({ label, value, onChange }) {
  const items = value ?? []

  const update = (i, v) => onChange(items.map((it, idx) => (idx === i ? v : it)))
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  const add = () => onChange([...items, ''])
  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div>
      <span className="block font-mono text-xs uppercase tracking-wide mb-1.5" style={{ color: '#8a7a5e' }}>
        {label}
      </span>
      <div className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <input
              value={item}
              onChange={(e) => update(i, e.target.value)}
              className="flex-1 min-w-0 px-3 py-1.5 font-grotesk text-sm rounded-sm outline-none"
              style={{ background: '#fdf9f0', border: '1px solid #e6dabd', color: '#241c10' }}
            />
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1 rounded-sm disabled:opacity-30" style={{ color: '#8a7a5e' }}>
              <ChevronUp size={13} />
            </button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-1 rounded-sm disabled:opacity-30" style={{ color: '#8a7a5e' }}>
              <ChevronDown size={13} />
            </button>
            <button type="button" onClick={() => remove(i)} className="p-1 rounded-sm" style={{ color: '#a3271f' }}>
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1.5 rounded-sm"
        style={{ color: '#a85e12', background: '#f6efdd', border: '1px solid #e6dabd' }}
      >
        <Plus size={12} /> Add
      </button>
    </div>
  )
}
