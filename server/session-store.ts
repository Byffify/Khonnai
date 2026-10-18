import { timingSafeEqual } from 'node:crypto'
import type { Pool, PoolClient } from 'pg'
import type { AuthProvider, ProviderTokens, SessionStore } from './auth-contract.ts'
import { AuthFailure } from './auth-provider.ts'
import { hashOpaque, randomOpaque } from './session-crypto.ts'

type Payload = { tokens: ProviderTokens; csrfToken: string }
type Context = { sessionHash: Buffer; userId: string }
type Options = {
  vaultPool: Pool
  provider: AuthProvider
  crypto: {
    seal(payload: Payload, context: Context): Buffer
    open(ciphertext: Buffer, context: Context): Payload
  }
  keyId: string
  now?: () => number
}
type SessionRow = {
  user_id: string
  provider_session_id: string
  csrf_hash: Buffer
  token_ciphertext: Buffer
  encryption_key_id: string
  expires_at: Date
  revoked_at: Date | null
}

const safeError = () => new Error('Session operation unavailable')
const validOpaque = (value: string) => /^[A-Za-z0-9_-]{32,256}$/.test(value)

export function createSessionStore({ vaultPool, provider, crypto, keyId, now = Date.now }: Options): SessionStore {
  async function transaction<T>(operation: (client: PoolClient) => Promise<T>): Promise<T> {
    let client: PoolClient | undefined
    let discard = false
    try {
      client = await vaultPool.connect()
      await client.query('begin')
      await client.query("set local lock_timeout = '5s'")
      await client.query("set local statement_timeout = '20s'")
      await client.query("set local idle_in_transaction_session_timeout = '45s'")
      const result = await operation(client)
      await client.query('commit')
      return result
    } catch {
      if (client) {
        try { await client.query('rollback') } catch { discard = true }
      }
      throw safeError()
    } finally {
      client?.release(discard)
    }
  }

  async function lockedSession(client: PoolClient, sessionId: string) {
    const sessionHash = hashOpaque(sessionId)
    const result = await client.query<SessionRow>(
      `select user_id, provider_session_id, csrf_hash, token_ciphertext, encryption_key_id,
              expires_at, revoked_at
       from khonnai_vault.sessions where session_hash = $1 for update`, [sessionHash],
    )
    const row = result.rows[0]
    if (!row || row.revoked_at || row.expires_at.getTime() <= now() || row.encryption_key_id !== keyId) return null
    const payload = crypto.open(row.token_ciphertext, { sessionHash, userId: row.user_id })
    const csrfHash = hashOpaque(payload.csrfToken)
    if (row.csrf_hash.length !== csrfHash.length || !timingSafeEqual(row.csrf_hash, csrfHash)
      || payload.tokens.userId !== row.user_id || payload.tokens.providerSessionId !== row.provider_session_id) return null
    try {
      if (payload.tokens.expiresAt <= now() + 60_000) {
        const refreshed = await provider.refresh(payload.tokens.refreshToken)
        if (refreshed.userId !== row.user_id || refreshed.providerSessionId !== row.provider_session_id
          || refreshed.expiresAt <= now()) return null
        payload.tokens = refreshed
        await client.query(
          `update khonnai_vault.sessions
           set token_ciphertext = $2, token_expires_at = $3, refresh_version = refresh_version + 1
           where session_hash = $1`,
          [sessionHash, crypto.seal(payload, { sessionHash, userId: row.user_id }), new Date(refreshed.expiresAt)],
        )
      }
      const user = await provider.verifyAccess(payload.tokens.accessToken)
      if (user.id !== row.user_id) return null
      return { sessionHash, payload, user }
    } catch (error) {
      if (error instanceof AuthFailure && ['invalid_credentials', 'email_unconfirmed'].includes(error.code)) return null
      throw error
    }
  }

  return {
    async create(tokens) {
      try {
        const user = await provider.verifyAccess(tokens.accessToken)
        if (user.id !== tokens.userId || tokens.expiresAt <= now()) throw safeError()
        const sessionId = randomOpaque()
        const csrfToken = randomOpaque()
        const sessionHash = hashOpaque(sessionId)
        await transaction(async client => {
          await client.query(
            `insert into khonnai_vault.sessions
             (session_hash, user_id, provider_session_id, csrf_hash, token_ciphertext,
              encryption_key_id, created_at, expires_at, token_expires_at)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [sessionHash, tokens.userId, tokens.providerSessionId, hashOpaque(csrfToken),
              crypto.seal({ tokens, csrfToken }, { sessionHash, userId: tokens.userId }), keyId,
              new Date(now()), new Date(now() + 24 * 60 * 60_000), new Date(tokens.expiresAt)],
          )
        })
        return { sessionId, csrfToken }
      } catch { throw safeError() }
    },

    async authenticate(sessionId) {
      if (!validOpaque(sessionId)) return null
      return transaction(async client => {
        const session = await lockedSession(client, sessionId)
        return session ? { userId: session.user.id, email: session.user.email, csrfToken: session.payload.csrfToken } : null
      })
    },

    async revoke(sessionId) {
      if (!validOpaque(sessionId)) return
      const accessToken = await transaction(async client => {
        const sessionHash = hashOpaque(sessionId)
        const result = await client.query<SessionRow>(
          `update khonnai_vault.sessions set revoked_at = coalesce(revoked_at, $2)
           where session_hash = $1 returning user_id, token_ciphertext`, [sessionHash, new Date(now())],
        )
        const row = result.rows[0]
        if (!row) return null
        try { return crypto.open(row.token_ciphertext, { sessionHash, userId: row.user_id }).tokens.accessToken }
        catch { return null }
      })
      if (accessToken) {
        try { await provider.revoke(accessToken) } catch { /* Local revocation has already committed. */ }
      }
    },

    async changePassword(sessionId, password) {
      if (!validOpaque(sessionId)) throw safeError()
      const accessToken = await transaction(async client => {
        const session = await lockedSession(client, sessionId)
        if (!session) throw safeError()
        await provider.updatePassword(session.payload.tokens.accessToken, password)
        await client.query('update khonnai_vault.sessions set revoked_at = coalesce(revoked_at, $2) where user_id = $1',
          [session.user.id, new Date(now())])
        return session.payload.tokens.accessToken
      })
      try { await provider.revoke(accessToken) } catch { /* All local account sessions are already revoked. */ }
    },
  }
}
