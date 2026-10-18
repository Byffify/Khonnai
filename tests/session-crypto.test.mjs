import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import test from 'node:test'
import { createSessionCrypto, hashOpaque, randomOpaque } from '../server/session-crypto.ts'

const userId = '11111111-1111-4111-8111-111111111111'
const context = { sessionHash: hashOpaque(randomOpaque()), userId }
const payload = { tokens: { accessToken: 'access-fixture', refreshToken: 'refresh-fixture',
  expiresAt: Date.now() + 60000, userId, providerSessionId: '22222222-2222-4222-8222-222222222222' }, csrfToken: randomOpaque() }

test('real AES-GCM roundtrip is randomized and contains no plaintext', () => {
  const cipher = createSessionCrypto(randomBytes(32))
  const first = cipher.seal(payload, context)
  const second = cipher.seal(payload, context)
  assert.deepEqual(cipher.open(first, context), payload)
  assert.notDeepEqual(first, second)
  assert.notDeepEqual(first.subarray(1, 13), second.subarray(1, 13))
  assert.equal(first.includes(Buffer.from(payload.tokens.refreshToken)), false)
})

test('tampering every envelope component is rejected without secrets', () => {
  const cipher = createSessionCrypto(randomBytes(32))
  const sealed = cipher.seal(payload, context)
  for (const position of [0, 1, 13, 29, sealed.length - 1]) {
    const changed = Buffer.from(sealed)
    changed[position] ^= 1
    assert.throws(() => cipher.open(changed, context), { message: 'Invalid session envelope.' })
  }
  assert.throws(() => cipher.open(sealed.subarray(0, 20), context), { message: 'Invalid session envelope.' })
})

test('envelope cannot move to another session, user or encryption key', () => {
  const cipher = createSessionCrypto(randomBytes(32))
  const sealed = cipher.seal(payload, context)
  for (const other of [{ ...context, sessionHash: hashOpaque(randomOpaque()) },
    { ...context, userId: '33333333-3333-4333-8333-333333333333' }]) {
    assert.throws(() => cipher.open(sealed, other), { message: 'Invalid session envelope.' })
  }
  assert.throws(() => createSessionCrypto(randomBytes(32)).open(sealed, context), { message: 'Invalid session envelope.' })
})

test('invalid decoded payload and mismatched user cannot be sealed', () => {
  const cipher = createSessionCrypto(randomBytes(32))
  for (const invalid of [null, {}, { ...payload, csrfToken: '' },
    { ...payload, tokens: { ...payload.tokens, expiresAt: NaN } },
    { ...payload, tokens: { ...payload.tokens, userId: '33333333-3333-4333-8333-333333333333' } }]) {
    assert.throws(() => cipher.seal(invalid, context), { message: 'Invalid session envelope.' })
  }
})

test('key is copied and opaque identifiers have 256 bits of entropy', () => {
  const key = randomBytes(32)
  const cipher = createSessionCrypto(key)
  const sealed = cipher.seal(payload, context)
  key.fill(0)
  assert.deepEqual(cipher.open(sealed, context), payload)
  assert.throws(() => createSessionCrypto(randomBytes(31)))
  const opaque = randomOpaque()
  assert.match(opaque, /^[A-Za-z0-9_-]{43}$/)
  assert.equal(Buffer.from(opaque, 'base64url').length, 32)
  assert.equal(hashOpaque(opaque).length, 32)
  assert.deepEqual(hashOpaque(opaque), hashOpaque(opaque))
  assert.notEqual(randomOpaque(), opaque)
})
