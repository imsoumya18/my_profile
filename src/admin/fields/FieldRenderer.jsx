import TextField from './TextField'
import NumberField from './NumberField'
import BooleanField from './BooleanField'
import SelectField from './SelectField'
import IconField from './IconField'
import ImageField from './ImageField'
import ArrayStringsField from './ArrayStringsField'
import ArrayField from './ArrayField'
import ObjectFields from './ObjectFields'

// The recursive core: given one schema field + its current value, renders
// the right input — or, for `object`/`array`, recurses back through
// ObjectFields/ArrayField, which is what lets the schema describe
// arbitrarily nested shapes (experience[].bullets, projects[].metric, etc.)
// with a single set of components.
export default function FieldRenderer({ field, value, onChange }) {
  switch (field.type) {
    case 'text':
      return <TextField label={field.label} value={value} onChange={onChange} />
    case 'textarea':
      return <TextField label={field.label} value={value} onChange={onChange} textarea />
    case 'number':
      return <NumberField label={field.label} value={value} onChange={onChange} />
    case 'boolean':
      return <BooleanField label={field.label} value={value} onChange={onChange} />
    case 'select':
      return <SelectField label={field.label} value={value} onChange={onChange} options={field.options} />
    case 'icon':
      return <IconField label={field.label} value={value} onChange={onChange} />
    case 'image':
      return <ImageField label={field.label} value={value} onChange={onChange} />
    case 'array-strings':
      return <ArrayStringsField label={field.label} value={value} onChange={onChange} />
    case 'object':
      return (
        <div className="p-3 rounded-sm" style={{ background: '#f6efdd', border: '1px solid #e6dabd' }}>
          <span className="block font-mono text-xs uppercase tracking-wide mb-3" style={{ color: '#8a7a5e' }}>
            {field.label}
          </span>
          <ObjectFields fields={field.fields} value={value ?? {}} onChange={onChange} />
        </div>
      )
    case 'array':
      return <ArrayField field={field} value={value ?? []} onChange={onChange} />
    default:
      return null
  }
}
