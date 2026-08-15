import { isAuthenticated, json } from './lib/auth.mjs'

export default async (request) => {
  return json({ authenticated: isAuthenticated(request) })
}
