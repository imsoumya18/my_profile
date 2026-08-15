import { checkPassword, createSessionToken, sessionCookie, json } from './lib/auth.mjs'

export default async (request) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!checkPassword(body.password)) {
    return json({ error: 'Wrong password' }, { status: 401 })
  }

  const token = createSessionToken()
  return json({ ok: true }, { headers: { 'Set-Cookie': sessionCookie(token) } })
}
