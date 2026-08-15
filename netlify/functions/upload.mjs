import crypto from 'node:crypto'
import { getStore } from '@netlify/blobs'
import { isAuthenticated, json } from './lib/auth.mjs'

const STORE_NAME = 'portfolio-images'
const MAX_BYTES = 8 * 1024 * 1024 // 8 MB

function sanitizeFilename(name) {
  return String(name || 'image').replace(/[^a-zA-Z0-9._-]/g, '-').slice(-80)
}

export default async (request) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }
  if (!isAuthenticated(request)) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { filename, contentType, dataBase64 } = body
  if (!dataBase64 || !contentType) {
    return json({ error: '"contentType" and "dataBase64" are required' }, { status: 400 })
  }
  if (!contentType.startsWith('image/')) {
    return json({ error: 'Only image uploads are allowed' }, { status: 400 })
  }

  const buffer = Buffer.from(dataBase64, 'base64')
  if (buffer.length > MAX_BYTES) {
    return json({ error: 'Image too large (max 8MB)' }, { status: 400 })
  }

  const key = `${crypto.randomUUID()}-${sanitizeFilename(filename)}`
  const store = getStore(STORE_NAME)
  await store.set(key, buffer, { metadata: { contentType } })

  return json({ url: `/.netlify/functions/image?key=${encodeURIComponent(key)}` })
}
