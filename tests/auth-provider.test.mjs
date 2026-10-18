import assert from 'node:assert/strict'
import test from 'node:test'
import { AuthFailure, createAuthProvider } from '../server/auth-provider.ts'
import { parseEmail, passwordChecks } from '../src/authPolicy.ts'

const config = { url: 'https://abcdefghijklmnopqrst.supabase.co', publishableKey: 'sb_publishable_fixture' }
const userId = '11111111-1111-4111-8111-111111111111'
const sessionId = '22222222-2222-4222-8222-222222222222'
const email = 'Owner@example.com'
const password = 'NeverLogThisPassword123'
const user = { id: userId, email, email_confirmed_at: '2026-01-01T00:00:00Z' }
const exp = Math.floor(Date.now() / 1000) + 3600
const jwt = (claims = {}) => [Buffer.from('{}').toString('base64url'), Buffer.from(JSON.stringify({ sub: userId, session_id: sessionId, exp, ...claims })).toString('base64url'), 'signature'].join('.')
const response = (changes = {}) => ({ access_token: jwt(), refresh_token: 'refresh-fixture', expires_at: exp, user, ...changes })
const json = (data, status = 200) => new Response(JSON.stringify(data), { status })
const providerWithSession = (changes = {}) => createAuthProvider(config, async (url) => url.endsWith('/user') ? json(user) : json(response(changes)))

test('password policy implements exactly four rules without changing passwords', () => {
  assert.deepEqual(passwordChecks('abcdefg1', 'abcdefg1'), { length: true, letter: true, number: true, match: true })
  assert.deepEqual(passwordChecks('12345678', 'different'), { length: true, letter: false, number: true, match: false })
  assert.deepEqual(passwordChecks('abc', 'abc'), { length: false, letter: true, number: false, match: true })
  assert.equal(passwordChecks('', '').match, false)
  assert.equal(passwordChecks('😀😀😀😀😀😀A1', '😀😀😀😀😀😀A1').length, true)
  assert.equal(passwordChecks('😀😀A1', '😀😀A1').length, false)
  assert.equal(passwordChecks('a1' + 'x'.repeat(900), '').length, true)
  assert.equal(passwordChecks('a1' + 'x'.repeat(1024), '').length, false)
  assert.equal(parseEmail('  Owner@example.com  '), email)
  for (const invalid of ['', 'a@', 'a b@example.com', null]) assert.equal(parseEmail(invalid), null)
})

test('sign-in verifies remote identity and converts expiry seconds into milliseconds', async () => {
  const requests = []
  const provider = createAuthProvider(config, async (target, options) => {
    requests.push({ target, options })
    return target.endsWith('/user') ? json(user) : json(response())
  })
  const result = await provider.signIn(` ${email} `, password)
  assert.equal(result.expiresAt, exp * 1000)
  assert.equal(result.providerSessionId, sessionId)
  assert.equal(result.userId, userId)
  assert.equal(requests.length, 2)
  assert.equal(requests[0].target.endsWith('/token?grant_type=password'), true)
  assert.deepEqual(JSON.parse(requests[0].options.body), { email, password })
  assert.equal(requests[0].options.headers.apikey, config.publishableKey)
  assert.equal(requests[0].options.redirect, 'error')
  assert.equal(requests[0].options.signal instanceof AbortSignal, true)
  assert.equal(requests[1].options.headers.Authorization, `Bearer ${result.accessToken}`)
})

test('refresh derives expiry safely and validates access remotely', async () => {
  const provider = providerWithSession({ expires_at: undefined, expires_in: 300 })
  const before = Date.now()
  const result = await provider.refresh('old-refresh')
  assert.equal(result.expiresAt >= before + 300000, true)
  assert.equal(result.expiresAt <= Date.now() + 300000, true)
})

test('unconfirmed email and mismatched or malformed session responses are rejected', async () => {
  await assert.rejects(providerWithSession({ user: { ...user, email_confirmed_at: null } }).signIn(email, password), { code: 'email_unconfirmed', status: 403 })
  for (const change of [{ access_token: 'bad-token' }, { refresh_token: '' },
    { access_token: jwt({ sub: '33333333-3333-4333-8333-333333333333' }) },
    { access_token: jwt({ session_id: null }) }, { access_token: jwt({ exp: 0 }) },
    { expires_at: 0 }, { user: { id: userId, email: '' } }]) {
    await assert.rejects(providerWithSession(change).signIn(email, password), { code: 'invalid_response', status: 502 })
  }
  const mismatched = createAuthProvider(config, async (url) => url.endsWith('/user') ? json({ ...user, id: '33333333-3333-4333-8333-333333333333' }) : json(response()))
  await assert.rejects(mismatched.signIn(email, password), { code: 'invalid_response' })
})

test('errors redact provider details, credentials and tokens', async () => {
  for (const [status, expectedStatus, code] of [[400, 401, 'invalid_credentials'], [429, 429, 'rate_limited'], [500, 503, 'unavailable']]) {
    const provider = createAuthProvider(config, async () => json({ error: `${password} ${config.publishableKey}` }, status))
    await assert.rejects(provider.signIn(email, password), (error) => {
      assert.equal(error instanceof AuthFailure, true)
      assert.equal(error.status, expectedStatus)
      assert.equal(error.code, code)
      assert.equal(error.message.includes(password), false)
      assert.equal(JSON.stringify(error).includes(config.publishableKey), false)
      return true
    })
  }
  const failed = createAuthProvider(config, async () => { throw new Error(password) })
  await assert.rejects(failed.signIn(email, password), { code: 'unavailable', message: 'Authentication request could not be completed.' })
  await assert.rejects(createAuthProvider(config, async () => new Response(password)).signIn(email, password), { code: 'invalid_response' })
})

test('signup and recovery hide account existence but preserve rate and service failures', async () => {
  for (const status of [200, 400, 422]) {
    const provider = createAuthProvider(config, async () => json({ user: email, detail: password }, status))
    assert.equal(await provider.signUp(email, password, 'http://127.0.0.1:5293/auth/callback'), undefined)
    assert.equal(await provider.recover(email, 'https://staging.example.com/auth/callback'), undefined)
  }
  for (const status of [429, 503]) {
    const provider = createAuthProvider(config, async () => json({}, status))
    await assert.rejects(provider.recover(email, 'https://staging.example.com/auth/callback'))
    await assert.rejects(provider.signUp(email, password, 'https://staging.example.com/auth/callback'))
  }
})

test('email verification, password update and local logout use expected endpoints', async () => {
  const calls = []
  const provider = createAuthProvider(config, async (target, options) => {
    calls.push({ target, options })
    if (target.includes('/verify')) return json(response())
    if (target.includes('/logout')) return new Response(null, { status: 204 })
    return json(user)
  })
  await provider.verifyEmail('hash_fixture_123456789', 'recovery')
  await provider.updatePassword(jwt(), password)
  await provider.revoke(jwt())
  assert.deepEqual(JSON.parse(calls[0].options.body), { token_hash: 'hash_fixture_123456789', type: 'recovery' })
  assert.equal(calls[2].options.method, 'PUT')
  assert.equal(calls[3].target.endsWith('/logout?scope=local'), true)
  assert.equal(calls[3].options.method, 'POST')
})

test('unsafe config, invalid inputs and unsafe redirects fail before fetch', async () => {
  assert.throws(() => createAuthProvider({ ...config, url: 'http://example.com' }), AuthFailure)
  assert.throws(() => createAuthProvider({ ...config, publishableKey: 'sb_secret_bad' }), AuthFailure)
  const provider = createAuthProvider(config, async () => { assert.fail('Unexpected provider call') })
  await assert.rejects(provider.signIn('invalid', password), { code: 'invalid_input' })
  await assert.rejects(provider.signUp(email, 'short', 'https://example.com'), { code: 'invalid_input' })
  await assert.rejects(provider.recover(email, 'http://evil.example.com'), { code: 'invalid_input' })
  await assert.rejects(provider.verifyEmail('', 'signup'), { code: 'invalid_input' })
})
