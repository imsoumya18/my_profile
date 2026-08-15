import { useState } from 'react'
import { Plus, X, ChevronUp, ChevronDown, ChevronRight } from 'lucide-react'
import ObjectFields from './ObjectFields'
import { emptyValueForFields } from '../schema'

export default function ArrayField({ field, value, onChange }) {
  const items = value ?? []
  const [openIndex, setOpenIndex] = useState(null)

  const updateItem = (i, v) => onChange(items.map((it, idx) => (idx === i ? v : it)))
  const removeItem = (i) => {
    onChange(items.filter((_, idx) => idx !== i))
    setOpenIndex(null)
  }
  const addItem = () => {
    onChange([...items, emptyValueForFields(field.itemSchema)])
    setOpenIndex(items.length)
  }
  const moveItem = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
    setOpenIndex(j)
  }

  return (
    <div>
      <span className="block font-mono text-xs uppercase tracking-wide mb-2" style={{ color: '#8a7a5e' }}>
        {field.label} <span style={{ color: '#c2b28c' }}>({items.length})</span>
      </span>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => {
          const isOpen = openIndex === i
          return (
            <div key={i} className="rounded-sm" style={{ border: '1px solid #e6dabd', background: '#fdf9f0' }}>
              <div className="flex items-center gap-2 px-3 py-2 cursor-pointer" onClick={() => setOpenIndex(isOpen ? null : i)}>
                <ChevronRight size={13} style={{ color: '#8a7a5e', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
                <span className="flex-1 font-grotesk text-sm truncate" style={{ color: '#241c10' }}>
                  {field.itemLabel ? field.itemLabel(item) : `Item ${i + 1}`}
                </span>
                <button type="button" onClick={(e) => { e.stopPropagation(); moveItem(i, -1) }} disabled={i === 0} className="p-1 disabled:opacity-30" style={{ color: '#8a7a5e' }}>
                  <ChevronUp size={13} />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); moveItem(i, 1) }} disabled={i === items.length - 1} className="p-1 disabled:opacity-30" style={{ color: '#8a7a5e' }}>
                  <ChevronDown size={13} />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); removeItem(i) }} className="p-1" style={{ color: '#a3271f' }}>
                  <X size={13} />
                </button>
              </div>
              {isOpen && (
                <div className="px-3 pb-3 pt-1" style={{ borderTop: '1px solid #ede3c8' }}>
                  <ObjectFields fields={field.itemSchema} value={item} onChange={(v) => updateItem(i, v)} />
                </div>
              )}
            </div>
          )
        })}
      </div>
      <button
        type="button"
        onClick={addItem}
        className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1.5 rounded-sm"
        style={{ color: '#a85e12', background: '#f6efdd', border: '1px solid #e6dabd' }}
      >
        <Plus size={12} /> Add
      </button>
    </div>
  )
}
