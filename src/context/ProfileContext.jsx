import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import staticProfile from '../data/profile.json'

// The bundled JSON is the instant-paint fallback — the site renders
// immediately with last-known-good content, then silently swaps in the
// live Blobs-backed data once it arrives. If the content Function is ever
// down, the site keeps working instead of breaking.
const ProfileContext = createContext({ profile: staticProfile, loading: true, refetch: () => {} })

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(staticProfile)
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    try {
      const res = await fetch('/.netlify/functions/content')
      if (!res.ok) throw new Error(`content fetch failed: ${res.status}`)
      setProfile(await res.json())
    } catch (err) {
      console.error('Falling back to bundled content —', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refetch() }, [refetch])

  return (
    <ProfileContext.Provider value={{ profile, loading, refetch }}>
      {children}
    </ProfileContext.Provider>
  )
}

// Matches the shape of the old `import profile from '../data/profile.json'`
// so every consumer only needs to swap the import line.
export function useProfile() {
  return useContext(ProfileContext).profile
}

export function useProfileState() {
  return useContext(ProfileContext)
}
