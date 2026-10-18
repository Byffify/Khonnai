import { randomBytes, timingSafeEqual } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { AuthProvider, SessionStore } from './auth-contract.ts'
import { AuthFailure } from './auth-provider.ts'
import { parseEmail, passwordChecks } from '../src/authPolicy.ts'

type Dependencies = {
  origin: string
  provider: AuthProvider
  sessions: SessionStore
  accounts: { provision(userId: string): Promise<void> }
  rateLimit(scope: string, identity: string, periodMs: number, max: number): Promise<boolean>
}

class RequestFailure extends Error {
  readonly status: number
  readonly code: string
  constructor(status: number, code: string) { super(code); this.status = status; this.code = code }
}
const opaque = (value: unknown): value is string => typeof value === 'string' && /^[A-Za-z0-9_-]{43}$/.test(value)
function equal(left: unknown, right: unknown) {
  return opaque(left) && opaque(right) && timingSafeEqual(Buffer.from(left), Buffer.from(right))
}
function cookie(request: IncomingMessage, name: string) {
  const values = (request.headers.cookie ?? '').split(';').map(value => value.trim()).filter(value => value.startsWith(`${name}=`))
  return values.length === 1 ? values[0].slice(name.length + 1) : ''
}
async function body(request: IncomingMessage): Promise<Record<string, unknown>> {
  if (!/^application\/json(?:;\s*charset=utf-8)?$/i.test(request.headers['content-type'] ?? '')) throw new RequestFailure(415, 'INVALID_INPUT')
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > 8192) throw new RequestFailure(413, 'INVALID_INPUT')
    chunks.push(Buffer.from(chunk))
  }
  try {
    const value: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error()
    return value as Record<string, unknown>
  } catch { throw new RequestFailure(400, 'INVALID_INPUT') }
}
function newPassword(data: Record<string, unknown>) {
  if (typeof data.password !== 'string' || typeof data.confirmation !== 'string'
    || !Object.values(passwordChecks(data.password, data.confirmation)).every(Boolean)) throw new RequestFailure(400, 'INVALID_INPUT')
  return data.password
}

export function createAuthHandler({ origin, provider, sessions, accounts, rateLimit }: Dependencies) {
  const expectedHost = new URL(origin).host
  const sessionName = 'khonnai_staging_session'
  const bootstrapName = 'khonnai_staging_csrf'
  return async (request: IncomingMessage, response: ServerResponse) => {
    response.setHeader('X-Khonnai-Dev-Service', 'auth-api')
    response.setHeader('Cache-Control', 'private, no-store')
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.setHeader('X-Content-Type-Options', 'nosniff')
    response.setHeader('X-Frame-Options', 'DENY')
    response.setHeader('Referrer-Policy', 'no-referrer')
    const send = (status: number, value: object) => { response.writeHead(status); response.end(JSON.stringify(value)) }
    const sessionCookie = (value: string, maxAge = 86400) => `${sessionName}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`
    try {
      if (request.headers.host !== expectedHost) throw new RequestFailure(403, 'CSRF')
      const path = request.url?.split('?')[0]
      if (!path?.startsWith('/api/auth/') || request.url?.includes('?')) throw new RequestFailure(404, 'NOT_FOUND')
      const remote = request.socket.remoteAddress ?? 'unknown'
      if (!await rateLimit('ip', remote, 60_000, 90)) throw new RequestFailure(429, 'RATE_LIMITED')
      if (request.method === 'GET' && path === '/api/auth/csrf') {
        if (request.headers['sec-fetch-site'] === 'cross-site') throw new RequestFailure(403, 'CSRF')
        const csrfToken = randomBytes(32).toString('base64url')
        response.setHeader('Set-Cookie', `${bootstrapName}=${csrfToken}; Path=/api/auth; HttpOnly; SameSite=Strict; Max-Age=600`)
        return send(200, { csrfToken })
      }
      const sessionId = cookie(request, sessionName)
      if (request.method === 'GET' && path === '/api/auth/session') {
        const session = opaque(sessionId) ? await sessions.authenticate(sessionId) : null
        if (!session && sessionId) response.setHeader('Set-Cookie', sessionCookie('', 0))
        return send(200, session ? { user: { id: session.userId, email: session.email }, csrfToken: session.csrfToken } : { user: null })
      }
      if (request.method !== 'POST') throw new RequestFailure(405, 'INVALID_INPUT')
      if (request.headers.origin !== origin || request.headers['sec-fetch-site'] === 'cross-site') throw new RequestFailure(403, 'CSRF')
      const authenticatedRoute = path === '/api/auth/password'
      const session = authenticatedRoute && opaque(sessionId) ? await sessions.authenticate(sessionId) : null
      if (authenticatedRoute && !session) throw new RequestFailure(401, 'UNAUTHORIZED')
      const expectedCsrf = authenticatedRoute ? session?.csrfToken : cookie(request, bootstrapName)
      if (!equal(request.headers['x-khonnai-csrf'], expectedCsrf)) throw new RequestFailure(403, 'CSRF')
      const data = await body(request)
      if (path === '/api/auth/logout') {
        await sessions.revoke(sessionId)
        response.setHeader('Set-Cookie', sessionCookie('', 0))
        return send(200, { accepted: true })
      }
      if (path === '/api/auth/password') {
        await sessions.changePassword(sessionId, newPassword(data))
        response.setHeader('Set-Cookie', sessionCookie('', 0))
        return send(200, { accepted: true })
      }
      if (path === '/api/auth/verify') {
        if (typeof data.tokenHash !== 'string' || !['signup', 'recovery'].includes(String(data.type))) throw new RequestFailure(400, 'INVALID_INPUT')
        if (!await rateLimit('verify', remote, 15 * 60_000, 12)) throw new RequestFailure(429, 'RATE_LIMITED')
        const tokens = await provider.verifyEmail(data.tokenHash, data.type === 'signup' ? 'signup' : 'recovery')
        await accounts.provision(tokens.userId)
        const created = await sessions.create(tokens)
        if (sessionId) await sessions.revoke(sessionId)
        response.setHeader('Set-Cookie', sessionCookie(created.sessionId))
        return send(200, { accepted: true })
      }
      const email = parseEmail(data.email)
      if (!email) throw new RequestFailure(400, 'INVALID_INPUT')
      if (!await rateLimit(path, email.toLowerCase(), 15 * 60_000, path === '/api/auth/login' ? 8 : 3)) throw new RequestFailure(429, 'RATE_LIMITED')
      if (path === '/api/auth/login') {
        if (typeof data.password !== 'string' || !data.password || Buffer.byteLength(data.password) > 1024) throw new RequestFailure(400, 'INVALID_INPUT')
        const tokens = await provider.signIn(email, data.password)
        await accounts.provision(tokens.userId)
        const created = await sessions.create(tokens)
        if (sessionId) await sessions.revoke(sessionId)
        response.setHeader('Set-Cookie', sessionCookie(created.sessionId))
        return send(200, { accepted: true })
      }
      if (path === '/api/auth/signup') {
        await provider.signUp(email, newPassword(data), `${origin}/auth/confirm`)
        return send(202, { accepted: true })
      }
      if (path === '/api/auth/recover') {
        await provider.recover(email, `${origin}/auth/reset-password`)
        return send(202, { accepted: true })
      }
      throw new RequestFailure(404, 'NOT_FOUND')
    } catch (error) {
      if (error instanceof RequestFailure) return send(error.status, { error: error.code })
      if (error instanceof AuthFailure) {
        const code = error.code === 'rate_limited' ? 'RATE_LIMITED'
          : ['invalid_credentials', 'email_unconfirmed'].includes(error.code) ? 'INVALID_CREDENTIALS'
            : error.code === 'invalid_input' ? 'INVALID_INPUT' : 'UNAVAILABLE'
        return send(code === 'INVALID_CREDENTIALS' ? 401 : error.status, { error: code })
      }
      return send(503, { error: 'UNAVAILABLE' })
    }
  }
}
