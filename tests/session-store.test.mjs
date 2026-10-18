import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createSessionStore } from '../server/session-store.ts'
import { createSessionCrypto, hashOpaque } from '../server/session-crypto.ts'
import { AuthFailure } from '../server/auth-provider.ts'

const userId = '10000000-0000-0000-0000-000000000001'
const providerSessionId = '20000000-0000-0000-0000-000000000001'
const clock = 1_800_000_000_000
const token = (expiresAt = clock + 3_600_000) => ({
  accessToken: 'access-secret', refreshToken: 'refresh-secret', expiresAt, userId, providerSessionId,
})

function fixture() {
  const rows = new Map()
  const calls = []
  let tail = Promise.resolve()
  let live = true
  let failCommit = false
  let refreshCount = 0
  let revokeFails = false
  let verifyCount = 0
  let providerFailure
  const pool = {
    async connect() {
      let unlock
      let snapshot
      return {
        async query(sql, values = []) {
          calls.push(sql)
          const key = values[0] instanceof Buffer ? values[0].toString('hex') : ''
          if (sql === 'begin' || sql.startsWith('set local')) return { rows: [] }
          if (sql === 'commit') {
            if (failCommit) { failCommit = false; throw new Error('PRIVATE DATABASE ERROR') }
            unlock?.()
            unlock = undefined
            return { rows: [] }
          }
          if (sql === 'rollback') {
            if (snapshot) {
              rows.clear()
              for (const [id, row] of snapshot) rows.set(id, row)
            }
            unlock?.()
            unlock = undefined
            return { rows: [] }
          }
          if (sql.includes('for update')) {
            const previous = tail
            tail = new Promise(resolve => { unlock = resolve })
            await previous
            snapshot = structuredClone(rows)
            return { rows: rows.has(key) ? [rows.get(key)] : [] }
          }
          if (sql.startsWith('insert into khonnai_vault.sessions')) {
            snapshot = structuredClone(rows)
            rows.set(key, {
              user_id: values[1], provider_session_id: values[2], csrf_hash: values[3], token_ciphertext: values[4],
              encryption_key_id: values[5], created_at: values[6], expires_at: values[7], token_expires_at: values[8],
              revoked_at: null, refresh_version: 0,
            })
            return { rows: [] }
          }
          if (sql.startsWith('update khonnai_vault.sessions')) {
            if (!snapshot) snapshot = structuredClone(rows)
            if (sql.includes('where user_id = $1')) {
              for (const row of rows.values()) {
                if (row.user_id === values[0]) row.revoked_at ??= values[1]
              }
              return { rows: [] }
            }
            const row = rows.get(key)
            if (!row) return { rows: [] }
            if (sql.includes('token_ciphertext =')) {
              row.token_ciphertext = values[1]
              row.token_expires_at = values[2]
              row.refresh_version++
            } else row.revoked_at = values[1]
            return { rows: sql.includes('returning') ? [row] : [] }
          }
          throw new Error(`Unexpected SQL in test adapter: ${sql}`)
        },
        release(discard) { calls.push(discard ? 'discard' : 'release'); unlock?.() },
      }
    },
  }
  const provider = {
    async verifyAccess() {
      verifyCount++
      if (providerFailure) throw providerFailure
      if (!live) throw new AuthFailure(401, 'invalid_credentials')
      return { id: userId, email: 'owner@example.invalid' }
    },
    async refresh() { refreshCount++; await new Promise(resolve => setTimeout(resolve, 5)); return token() },
    async revoke() {
      assert.ok([...rows.values()].every(row => row.revoked_at), 'local revoke must commit first')
      if (revokeFails) throw new Error('PRIVATE PROVIDER ERROR')
    },
    async updatePassword(_accessToken, password) { assert.equal(password, 'Newpass123') },
  }
  const crypto = createSessionCrypto(Buffer.alloc(32, 7))
  const options = { vaultPool: pool, provider, crypto, keyId: 'test-key', now: () => clock }
  const store = createSessionStore(options)
  return {
    store, options, rows, calls, crypto,
    setLive: value => { live = value },
    failCommit: () => { failCommit = true },
    failRevoke: () => { revokeFails = true },
    refreshCount: () => refreshCount,
    verifyCount: () => verifyCount,
    providerFailure: value => { providerFailure = value },
  }
}

test('session creation stores only opaque hashes and encrypted tokens; identity comes from verification', async () => {
  const f = fixture()
  const created = await f.store.create(token())
  const key = hashOpaque(created.sessionId).toString('hex')
  const row = f.rows.get(key)
  assert.equal(created.sessionId.length, 43)
  assert.equal(created.csrfToken.length, 43)
  assert.equal(row.expires_at.getTime(), clock + 86_400_000)
  assert.equal(row.token_ciphertext.includes(Buffer.from('access-secret')), false)
  assert.equal(row.token_ciphertext.includes(Buffer.from('refresh-secret')), false)
  assert.deepEqual(await f.store.authenticate(created.sessionId), {
    userId, email: 'owner@example.invalid', csrfToken: created.csrfToken,
  })
  assert.equal(f.verifyCount(), 2, 'create and authenticate must each verify the provider remotely')
  assert.ok(f.calls.every(sql => !sql.includes('auth.sessions')), 'session store must not query the private Auth schema')
  await assert.rejects(f.store.create({ ...token(), userId: 'another-user' }), /^Error: Session operation unavailable$/)
})

test('invalid, missing, expired, revoked, or provider-revoked sessions cannot authenticate', async () => {
  const f = fixture()
  assert.equal(await f.store.authenticate('bad'), null)
  assert.equal(await f.store.authenticate('x'.repeat(43)), null)
  const created = await f.store.create(token())
  const row = [...f.rows.values()][0]
  row.expires_at = new Date(clock)
  assert.equal(await f.store.authenticate(created.sessionId), null)
  row.expires_at = new Date(clock + 100_000)
  f.setLive(false)
  assert.equal(await f.store.authenticate(created.sessionId), null)
  f.setLive(true)
  row.revoked_at = new Date(clock)
  assert.equal(await f.store.authenticate(created.sessionId), null)
})

test('separate store instances serialize refresh through the vault row lock', async () => {
  const f = fixture()
  const created = await f.store.create(token(clock + 30_000))
  const second = createSessionStore(f.options)
  const [a, b] = await Promise.all([f.store.authenticate(created.sessionId), second.authenticate(created.sessionId)])
  assert.equal(a.userId, userId)
  assert.equal(b.userId, userId)
  assert.equal(f.refreshCount(), 1)
  assert.equal(f.verifyCount(), 3, 'each protected request verifies access after any refresh')
  assert.equal([...f.rows.values()][0].refresh_version, 1)
  assert.ok(f.calls.some(sql => sql.includes('for update')))
  assert.ok(f.calls.includes("set local lock_timeout = '5s'"))
})

test('invalid provider sessions return null while provider outages remain unavailable', async () => {
  const f = fixture()
  const created = await f.store.create(token())
  for (const code of ['invalid_credentials', 'email_unconfirmed']) {
    f.providerFailure(new AuthFailure(401, code))
    assert.equal(await f.store.authenticate(created.sessionId), null)
  }
  f.providerFailure(new AuthFailure(503, 'unavailable'))
  await assert.rejects(f.store.authenticate(created.sessionId), /^Error: Session operation unavailable$/)
  assert.ok(f.calls.includes('rollback'))
})

test('ciphertext tampering and mismatched CSRF hashes fail closed without leaking details', async () => {
  const f = fixture()
  const created = await f.store.create(token())
  const row = [...f.rows.values()][0]
  row.csrf_hash = Buffer.alloc(32)
  assert.equal(await f.store.authenticate(created.sessionId), null)
  row.csrf_hash = hashOpaque(created.csrfToken)
  row.token_ciphertext[30] ^= 1
  await assert.rejects(f.store.authenticate(created.sessionId), /^Error: Session operation unavailable$/)
  assert.ok(f.calls.includes('rollback'))
})

test('a failed commit rolls back session insertion and returns a generic error', async () => {
  const f = fixture()
  f.failCommit()
  await assert.rejects(f.store.create(token()), /^Error: Session operation unavailable$/)
  assert.equal(f.rows.size, 0)
  assert.ok(f.calls.includes('rollback'))
  assert.equal(f.calls.at(-1), 'release')
})

test('logout persists local revocation even when provider logout fails', async () => {
  const f = fixture()
  const created = await f.store.create(token())
  f.failRevoke()
  await f.store.revoke(created.sessionId)
  assert.equal(await f.store.authenticate(created.sessionId), null)
  const newStore = createSessionStore(f.options)
  assert.equal(await newStore.authenticate(created.sessionId), null)
  await newStore.revoke(created.sessionId)
  assert.equal(await f.store.authenticate(created.sessionId), null)
})

test('password change revokes all account sessions before best-effort provider logout', async () => {
  const f = fixture()
  await assert.rejects(f.store.changePassword('bad', 'Newpass123'), /^Error: Session operation unavailable$/)
  const created = await f.store.create(token())
  const otherDevice = await f.store.create(token())
  f.failRevoke()
  await f.store.changePassword(created.sessionId, 'Newpass123')
  assert.equal(await f.store.authenticate(created.sessionId), null)
  const newStore = createSessionStore(f.options)
  assert.equal(await newStore.authenticate(otherDevice.sessionId), null)
  assert.ok(f.calls.includes('update khonnai_vault.sessions set revoked_at = coalesce(revoked_at, $2) where user_id = $1'))
})
