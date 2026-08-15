import crypto from 'node:crypto'

const COOKIE_NAME = 'admin_session'
const SESSION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

function hmac(value) {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET is not set')
  return crypto.createHmac('sha256', secret).update(value).digest('hex')
}

// token = "<expiryMs>.<hmac(expiryMs)>" — no session state to store server
// side, the signature alone proves it hasn't been tampered with.
export function createSessionToken() {
  const expires = Date.now() + SESSION_MS
  return `${expires}.${hmac(String(expires))}`
}

export function verifySessionToken(token) {
  if (!token) return false
  const [expires, sig] = token.split('.')
  if (!expires || !sig) return false
  if (Date.now() > Number(expires)) return false
  const expected = hmac(expires)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export function sessionCookie(token) {
  const maxAge = Math.floor(SESSION_MS / 1000)
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`
}

function readCookie(request, name) {
  const header = request.headers.get('cookie') || ''
  const match = header.match(new RegExp(`(?:^|; )${name}=([^;]+)`))
  return match ? match[1] : null
}

export function isAuthenticated(request) {
  return verifySessionToken(readCookie(request, COOKIE_NAME))
}

export function checkPassword(candidate) {
  const actual = process.env.ADMIN_PASSWORD
  if (!actual || !candidate) return false
  const a = Buffer.from(String(candidate))
  const b = Buffer.from(String(actual))
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
  })
}
