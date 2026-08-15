import { getStore } from '@netlify/blobs'
import { json } from './lib/auth.mjs'

const STORE_NAME = 'portfolio-images'

// Public — this only ever serves back images the admin uploaded, keyed by
// an unguessable UUID-prefixed key, nothing sensitive.
export default async (request) => {
  const key = new URL(request.url).searchParams.get('key')
  if (!key) return json({ error: '"key" query param is required' }, { status: 400 })

  const store = getStore(STORE_NAME)
  const result = await store.getWithMetadata(key, { type: 'arrayBuffer' })
  if (!result) return json({ error: 'Not found' }, { status: 404 })

  return new Response(result.data, {
    headers: {
      'Content-Type': result.metadata?.contentType || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
