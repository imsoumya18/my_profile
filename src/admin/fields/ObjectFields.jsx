import FieldRenderer from './FieldRenderer'

export default function ObjectFields({ fields, value, onChange }) {
  const setField = (key, v) => onChange({ ...value, [key]: v })
  return (
    <div className="flex flex-col gap-3">
      {fields.map((f) => (
        <FieldRenderer key={f.key} field={f} value={value?.[f.key]} onChange={(v) => setField(f.key, v)} />
      ))}
    </div>
  )
}
