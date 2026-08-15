import { clearSessionCookie, json } from './lib/auth.mjs'

export default async () => {
  return json({ ok: true }, { headers: { 'Set-Cookie': clearSessionCookie() } })
}
