import { useEffect, useState } from 'react'
import { LogOut, Check, Loader2 } from 'lucide-react'
import { useProfile, useProfileState } from '../context/ProfileContext'
import { SECTIONS } from '../admin/schema'
import ObjectFields from '../admin/fields/ObjectFields'
import ArrayField from '../admin/fields/ArrayField'

function LoginForm({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/.netlify/functions/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Login failed')
      }
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: '#fdf9f0' }}>
      <form onSubmit={submit} className="w-full max-w-xs p-6 rounded-sm" style={{ background: '#fff', border: '1px solid #e6dabd' }}>
        <h1 className="font-note text-2xl mb-4" style={{ color: '#241c10' }}>Admin</h1>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-3 py-2 font-grotesk text-sm rounded-sm outline-none mb-3"
          style={{ background: '#fdf9f0', border: '1px solid #e6dabd', color: '#241c10' }}
        />
        {error && <p className="font-mono text-xs mb-3" style={{ color: '#a3271f' }}>{error}</p>}
        <button
          type="submit"
          disabled={submitting || !password}
          className="w-full py-2 rounded-sm font-grotesk text-sm disabled:opacity-50"
          style={{ background: '#241c10', color: '#fdf9f0' }}
        >
          {submitting ? 'Checking…' : 'Log in'}
        </button>
      </form>
    </div>
  )
}

function SectionEditor({ section, initialData, onSaved }) {
  const [data, setData] = useState(initialData)
  const [status, setStatus] = useState('idle') // idle | saving | saved | error
  const [error, setError] = useState(null)

  useEffect(() => { setData(initialData) }, [section.key])

  const save = async () => {
    setStatus('saving')
    setError(null)
    try {
      const res = await fetch('/.netlify/functions/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: section.key, data }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Save failed')
      }
      setStatus('saved')
      onSaved()
      setTimeout(() => setStatus('idle'), 2000)
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  return (
    <div>
      <div
        className="flex items-center justify-between mb-5 py-3 -mx-8 px-8 sticky z-10"
        style={{ top: 96, background: '#fdf9f0', borderBottom: '1px solid #e6dabd' }}
      >
        <h2 className="font-note text-2xl" style={{ color: '#241c10' }}>{section.label}</h2>
        <button
          onClick={save}
          disabled={status === 'saving'}
          className="inline-flex items-center gap-2 font-grotesk text-sm px-4 py-2 rounded-sm disabled:opacity-60"
          style={{ background: '#d6870f', color: '#fdf9f0' }}
        >
          {status === 'saving' && <Loader2 size={14} className="animate-spin" />}
          {status === 'saved' && <Check size={14} />}
          {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : 'Save'}
        </button>
      </div>
      {error && <p className="font-mono text-xs mb-4" style={{ color: '#a3271f' }}>{error}</p>}

      {section.kind === 'object' ? (
        <ObjectFields fields={section.fields} value={data} onChange={setData} />
      ) : (
        <ArrayField
          field={{ label: section.label, itemSchema: section.itemSchema, itemLabel: section.itemLabel }}
          value={data}
          onChange={setData}
        />
      )}
    </div>
  )
}

function Dashboard() {
  const profile = useProfile()
  const { refetch } = useProfileState()
  const [activeKey, setActiveKey] = useState(SECTIONS[0].key)

  const logout = async () => {
    await fetch('/.netlify/functions/logout', { method: 'POST' })
    window.location.reload()
  }

  const activeSection = SECTIONS.find((s) => s.key === activeKey)

  return (
    <div className="min-h-screen flex" style={{ background: '#fdf9f0' }}>
      <aside className="w-56 flex-shrink-0 pt-24 pb-8 px-4" style={{ background: '#f6efdd', borderRight: '1px solid #e6dabd' }}>
        <div className="flex items-center justify-between mb-6 px-2">
          <span className="font-note text-lg" style={{ color: '#241c10' }}>Admin</span>
          <button onClick={logout} aria-label="Log out" style={{ color: '#8a7a5e' }}>
            <LogOut size={15} />
          </button>
        </div>
        <nav className="flex flex-col gap-0.5">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveKey(s.key)}
              className="text-left px-3 py-2 rounded-sm font-grotesk text-sm transition-colors"
              style={{
                background: activeKey === s.key ? '#241c10' : 'transparent',
                color: activeKey === s.key ? '#fdf9f0' : '#3a2f1f',
              }}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 px-8 pt-24 pb-8 max-w-3xl">
        <SectionEditor
          key={activeSection.key}
          section={activeSection}
          initialData={profile[activeSection.key]}
          onSaved={refetch}
        />
      </main>
    </div>
  )
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(null) // null = checking

  useEffect(() => {
    fetch('/.netlify/functions/session')
      .then((res) => res.json())
      .then((body) => setAuthenticated(!!body.authenticated))
      .catch(() => setAuthenticated(false))
  }, [])

  if (authenticated === null) {
    return <div className="min-h-screen" style={{ background: '#fdf9f0' }} />
  }
  if (!authenticated) {
    return <LoginForm onSuccess={() => setAuthenticated(true)} />
  }
  return <Dashboard />
}
