import { timingSafeEqual } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { SessionStore } from './auth-contract.ts'
import type { Command, State } from '../src/domain/inventory.ts'
import { parseInventoryInput, InventoryInputFailure } from './inventory-input.ts'
import { InventoryFailure } from './inventory-store.ts'

type InventoryPort = {
  load(userId: string): Promise<State>
  commit(userId: string, expectedRevision: number, command: Command): Promise<State>
  lookup(userId: string, commandId: string): Promise<{ committed: boolean; state: State }>
}
type Dependencies = {
  origin: string
  sessions: SessionStore
  inventory: InventoryPort
  rateLimit(scope: string, identity: string, periodMs: number, max: number): Promise<boolean>
}
class HttpFailure extends Error {
  readonly status: number
  readonly code: string
  constructor(status: number, code: string) { super(code); this.status = status; this.code = code }
}
const opaque = (value: unknown): value is string => typeof value === 'string' && /^[A-Za-z0-9_-]{43}$/.test(value)
function sessionCookie(request: IncomingMessage) {
  const matches = (request.headers.cookie ?? '').split(';').map(part => part.trim()).filter(part => part.startsWith('khonnai_staging_session='))
  return matches.length === 1 ? matches[0].slice('khonnai_staging_session='.length) : ''
}
async function readJson(request: IncomingMessage): Promise<unknown> {
  if (!/^application\/json(?:;\s*charset=utf-8)?$/i.test(request.headers['content-type'] ?? '')) throw new HttpFailure(415, 'INVALID_INPUT')
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > 5_000_000) throw new HttpFailure(413, 'INVALID_INPUT')
    chunks.push(Buffer.from(chunk))
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) }
  catch { throw new HttpFailure(400, 'INVALID_INPUT') }
}

export function createInventoryHandler({ origin, sessions, inventory, rateLimit }: Dependencies) {
  const expectedHost = new URL(origin).host
  return async (request: IncomingMessage, response: ServerResponse) => {
    response.setHeader('X-Khonnai-Dev-Service', 'auth-api')
    response.setHeader('Cache-Control', 'private, no-store')
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.setHeader('X-Content-Type-Options', 'nosniff')
    response.setHeader('X-Frame-Options', 'DENY')
    response.setHeader('Referrer-Policy', 'no-referrer')
    const send = (status: number, value: object) => { response.writeHead(status); response.end(JSON.stringify(value)) }
    try {
      if (request.headers.host !== expectedHost || request.headers['sec-fetch-site'] === 'cross-site') throw new HttpFailure(403, 'CSRF')
      if (!request.url?.startsWith('/api/inventory/') || request.url.includes('?')) throw new HttpFailure(404, 'NOT_FOUND')
      if (!await rateLimit('inventory-ip', request.socket.remoteAddress ?? 'unknown', 60_000, 120)) throw new HttpFailure(429, 'RATE_LIMITED')
      const cookie = sessionCookie(request)
      const session = opaque(cookie) ? await sessions.authenticate(cookie) : null
      if (!session) throw new HttpFailure(401, 'UNAUTHORIZED')
      if (!await rateLimit('inventory-account', session.userId, 60_000, 120)) throw new HttpFailure(429, 'RATE_LIMITED')
      if (request.method === 'GET' && request.url === '/api/inventory/state') return send(200, { userId: session.userId, state: await inventory.load(session.userId) })
      const receiptMatch = /^\/api\/inventory\/commands\/([A-Za-z0-9_-]{1,160})$/.exec(request.url)
      if (request.method === 'GET' && receiptMatch) {
        const result = await inventory.lookup(session.userId, receiptMatch[1])
        return result.committed ? send(200, { userId: session.userId, ...result }) : send(404, { error: 'NOT_FOUND' })
      }
      if (request.method !== 'POST' || request.url !== '/api/inventory/commands') throw new HttpFailure(404, 'NOT_FOUND')
      if (request.headers.origin !== origin) throw new HttpFailure(403, 'CSRF')
      const csrf = request.headers['x-khonnai-csrf']
      if (!opaque(csrf) || !opaque(session.csrfToken) || !timingSafeEqual(Buffer.from(csrf), Buffer.from(session.csrfToken))) throw new HttpFailure(403, 'CSRF')
      const input = parseInventoryInput(await readJson(request))
      return send(200, { userId: session.userId, state: await inventory.commit(session.userId, input.expectedRevision, input.command) })
    } catch (error) {
      if (error instanceof HttpFailure) return send(error.status, { error: error.code })
      if (error instanceof InventoryInputFailure) return send(400, { error: 'INVALID_INPUT' })
      if (error instanceof InventoryFailure) return send(error.status, { error: error.code, ...(error.code === 'DOMAIN_INVALID' ? { message: error.message } : {}) })
      return send(503, { error: 'UNAVAILABLE' })
    }
  }
}
