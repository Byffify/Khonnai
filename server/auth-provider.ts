import type { AuthProvider, ProviderTokens, VerifiedUser } from './auth-contract.ts'
import { parseEmail, passwordChecks } from '../src/authPolicy.ts'

type FailureCode = 'invalid_credentials' | 'email_unconfirmed' | 'rate_limited' | 'unavailable' | 'invalid_response' | 'invalid_input'

export class AuthFailure extends Error {
  readonly status: number
  readonly code: FailureCode
  constructor(status: number, code: FailureCode) {
    super('Authentication request could not be completed.')
    this.name = 'AuthFailure'
    this.status = status
    this.code = code
  }
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new AuthFailure(502, 'invalid_response')
  return value as Record<string, unknown>
}

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
function token(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0 || value.length > 16384 || /\s/.test(value)) throw new AuthFailure(502, 'invalid_response')
  return value
}
function user(value: unknown): VerifiedUser {
  const data = object(value)
  const email = parseEmail(data.email)
  if (typeof data.id !== 'string' || !uuid.test(data.id) || !email) throw new AuthFailure(502, 'invalid_response')
  return { id: data.id, email }
}

export function createAuthProvider(config: { url: string; publishableKey: string }, fetchImpl: typeof fetch = fetch): AuthProvider {
  if (!/^https:\/\/[a-z0-9]{20}\.supabase\.co\/?$/.test(config.url) || !/^sb_publishable_[A-Za-z0-9_-]+$/.test(config.publishableKey)) throw new AuthFailure(503, 'unavailable')
  const base = `${new URL(config.url).origin}/auth/v1`
  async function request(path: string, method: string, body?: object, accessToken?: string, generic = false): Promise<unknown> {
    let response: Response
    try {
      response = await fetchImpl(`${base}${path}`, {
        method, redirect: 'error', signal: AbortSignal.timeout(15000),
        headers: { apikey: config.publishableKey, 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {}),
      })
    } catch { throw new AuthFailure(503, 'unavailable') }
    if (!response.ok) {
      if (response.status === 429) throw new AuthFailure(429, 'rate_limited')
      if (response.status >= 500) throw new AuthFailure(503, 'unavailable')
      if (generic && [400, 401, 403, 422].includes(response.status)) return null
      throw new AuthFailure(401, 'invalid_credentials')
    }
    if (response.status === 204 || generic) return null
    try { return await response.json() } catch { throw new AuthFailure(502, 'invalid_response') }
  }
  async function verifyAccess(accessToken: string): Promise<VerifiedUser> {
    return user(await request('/user', 'GET', undefined, token(accessToken)))
  }
  async function session(value: unknown, confirmed = false): Promise<ProviderTokens> {
    const data = object(value)
    const returnedUser = user(data.user)
    const confirmedAt = object(data.user).email_confirmed_at
    if (confirmed && (typeof confirmedAt !== 'string' || !Number.isFinite(Date.parse(confirmedAt)))) throw new AuthFailure(403, 'email_unconfirmed')
    const accessToken = token(data.access_token)
    const refreshToken = token(data.refresh_token)
    const parts = accessToken.split('.')
    if (parts.length !== 3 || parts.some((part) => !/^[A-Za-z0-9_-]+$/.test(part))) throw new AuthFailure(502, 'invalid_response')
    let claims: Record<string, unknown>
    try { claims = object(JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))) } catch { throw new AuthFailure(502, 'invalid_response') }
    if (claims.sub !== returnedUser.id || typeof claims.session_id !== 'string' || !uuid.test(claims.session_id) || typeof claims.exp !== 'number' || !Number.isSafeInteger(claims.exp)) throw new AuthFailure(502, 'invalid_response')
    const now = Date.now()
    const expiresAt = typeof data.expires_at === 'number' && Number.isSafeInteger(data.expires_at)
      ? data.expires_at * 1000
      : typeof data.expires_in === 'number' && Number.isFinite(data.expires_in) && data.expires_in > 0 && data.expires_in <= 604800
        ? now + data.expires_in * 1000 : NaN
    const boundedExpiry = Math.min(expiresAt, claims.exp * 1000)
    if (!Number.isSafeInteger(boundedExpiry) || boundedExpiry <= now) throw new AuthFailure(502, 'invalid_response')
    const verified = await verifyAccess(accessToken)
    if (verified.id !== returnedUser.id) throw new AuthFailure(502, 'invalid_response')
    return { accessToken, refreshToken, expiresAt: boundedExpiry, userId: verified.id, providerSessionId: claims.session_id }
  }
  function credentials(email: string, password?: string) {
    if (!parseEmail(email) || (password !== undefined && (password.length === 0 || Buffer.byteLength(password) > 1024))) throw new AuthFailure(400, 'invalid_input')
  }
  function newPassword(password: string) {
    if (!Object.values(passwordChecks(password, password)).every(Boolean)) throw new AuthFailure(400, 'invalid_input')
  }
  function redirect(value: string): string {
    let parsed: URL
    try { parsed = new URL(value) } catch { throw new AuthFailure(400, 'invalid_input') }
    if (parsed.username || parsed.password || (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(parsed.hostname)))) throw new AuthFailure(400, 'invalid_input')
    return encodeURIComponent(parsed.href)
  }
  return {
    async signIn(email, password) { credentials(email, password); return session(await request('/token?grant_type=password', 'POST', { email: parseEmail(email), password }), true) },
    async signUp(email, password, redirectTo) { credentials(email); newPassword(password); await request(`/signup?redirect_to=${redirect(redirectTo)}`, 'POST', { email: parseEmail(email), password }, undefined, true) },
    async verifyEmail(tokenHash, type) {
      if (!/^[a-zA-Z0-9_-]{16,1024}$/.test(tokenHash) || !['signup', 'recovery'].includes(type)) throw new AuthFailure(400, 'invalid_input')
      return session(await request('/verify', 'POST', { token_hash: tokenHash, type }))
    },
    async refresh(refreshToken) { return session(await request('/token?grant_type=refresh_token', 'POST', { refresh_token: token(refreshToken) })) },
    verifyAccess,
    async recover(email, redirectTo) { credentials(email); await request(`/recover?redirect_to=${redirect(redirectTo)}`, 'POST', { email: parseEmail(email) }, undefined, true) },
    async updatePassword(accessToken, password) { newPassword(password); await request('/user', 'PUT', { password }, token(accessToken)) },
    async revoke(accessToken) { await request('/logout?scope=local', 'POST', undefined, token(accessToken), true) },
  }
}
