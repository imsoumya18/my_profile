import { getStore } from '@netlify/blobs'
import { isAuthenticated, json } from './lib/auth.mjs'
import seedData from '../../src/data/profile.json'

const STORE_NAME = 'portfolio-content'
const KEY = 'content.json'

// GET is public (the whole site reads through this). POST requires a valid
// admin session and patches a single top-level section at a time, so two
// concurrent edits to different sections can never clobber each other.
export default async (request) => {
  const store = getStore(STORE_NAME)

  if (request.method === 'GET') {
    let data = await store.get(KEY, { type: 'json' })
    if (!data) {
      data = seedData
      await store.setJSON(KEY, data)
    }
    return json(data)
  }

  if (request.method === 'POST') {
    if (!isAuthenticated(request)) {
      return json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { section, data: sectionData } = body
    if (!section || sectionData === undefined) {
      return json({ error: '"section" and "data" are required' }, { status: 400 })
    }

    let current = await store.get(KEY, { type: 'json' })
    if (!current) current = seedData
    current = { ...current, [section]: sectionData }
    await store.setJSON(KEY, current)
    return json(current)
  }

  return json({ error: 'Method not allowed' }, { status: 405 })
}
