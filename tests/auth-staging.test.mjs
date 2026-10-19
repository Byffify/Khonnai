import assert from 'node:assert/strict'
import test from 'node:test'
import { checkAuthSettings, parseAuthConfig } from '../scripts/check-auth-staging.mjs'

const url = 'https://abcdefghijklmnopqrst.supabase.co'
const key = 'sb_publishable_test_fixture_only'
const envText = (projectUrl = url, apiKey = key) => `SUPABASE_URL="${projectUrl}"\nSUPABASE_PUBLISHABLE_KEY="${apiKey}"\n`
const config = parseAuthConfig(envText())

test('parses local configuration without changing process environment', () => {
  const before = process.env.SUPABASE_URL
  assert.deepEqual(config, { url, publishableKey: key })
  assert.equal(Object.isFrozen(config), true)
  assert.equal(parseAuthConfig(envText(`${url}/`)).url, url)
  assert.equal(process.env.SUPABASE_URL, before)
})

test('rejects missing and privileged API keys without exposing their values', () => {
  for (const invalid of ['', 'sb_publishable_', 'sb_secret_fixture', 'eyJ_service_role_fixture']) {
    assert.throws(() => parseAuthConfig(envText(url, invalid)), (error) => {
      assert.equal(error.message, 'Staging requires a publishable API key.')
      return true
    })
  }
})

test('only accepts an HTTPS Supabase root without credentials, ports, query or fragment', () => {
  for (const invalid of ['', 'http://abcdefghijklmnopqrst.supabase.co', 'https://example.com',
    'https://user:password@abcdefghijklmnopqrst.supabase.co', `${url}:443`,
    `${url}/auth`, `${url}?secret=value`, `${url}#fragment`, `${url}.evil.test`]) {
    assert.throws(() => parseAuthConfig(envText(invalid)), {
      message: 'Staging requires an HTTPS Supabase project root URL.',
    })
  }
})

test('reads settings with the publishable header and returns only safe flags', async () => {
  let calls = 0
  const report = await checkAuthSettings(config, async (target, options) => {
    calls += 1
    assert.equal(target, `${url}/auth/v1/settings`)
    assert.equal(options.method, 'GET')
    assert.equal(options.headers.apikey, key)
    assert.equal(options.redirect, 'error')
    assert.equal(options.signal instanceof AbortSignal, true)
    return new Response(JSON.stringify({
      external: { email: true, google: false }, disable_signup: false,
      mailer_autoconfirm: false, sensitive: key,
    }), { status: 200 })
  })
  assert.equal(calls, 1)
  assert.deepEqual(report, { url, httpStatus: 200, emailEnabled: true,
    googleEnabled: false, signupEnabled: true, emailConfirmationRequired: true })
  assert.equal(JSON.stringify(report).includes(key), false)
  assert.equal(Object.isFrozen(report), true)
})

test('missing and non-boolean flags are unknown instead of assumed safe', async () => {
  for (const settings of [{}, { external: { email: 'true', google: 1 },
    disable_signup: null, mailer_autoconfirm: 'false' }]) {
    const report = await checkAuthSettings(config, async () => new Response(JSON.stringify(settings)))
    assert.deepEqual(report, { url, httpStatus: 200, emailEnabled: null,
      googleEnabled: null, signupEnabled: null, emailConfirmationRequired: null })
  }
})

test('boolean false settings preserve their meaning', async () => {
  const report = await checkAuthSettings(config, async () => new Response(JSON.stringify({
    external: { email: false, google: true }, disable_signup: true, mailer_autoconfirm: true,
  })))
  assert.equal(report.emailEnabled, false)
  assert.equal(report.googleEnabled, true)
  assert.equal(report.signupEnabled, false)
  assert.equal(report.emailConfirmationRequired, false)
})

test('HTTP errors do not read or expose response bodies', async () => {
  for (const status of [401, 500]) {
    await assert.rejects(checkAuthSettings(config, async () => ({ ok: false, status,
      json() { throw new Error(`Sensitive body ${key}`) },
    })), { message: `Staging Auth settings request failed (HTTP ${status}).` })
  }
})

test('network errors cannot expose credentials', async () => {
  await assert.rejects(checkAuthSettings(config, async () => { throw new Error(key) }), {
    message: 'Unable to read staging Auth settings. Check network access.',
  })
})

test('malformed JSON and unexpected bodies are safely rejected', async () => {
  await assert.rejects(checkAuthSettings(config, async () => new Response(key)), {
    message: 'Staging Auth settings returned invalid JSON.',
  })
  for (const data of [null, [], key, true]) {
    await assert.rejects(checkAuthSettings(config, async () => new Response(JSON.stringify(data))), {
      message: 'Staging Auth settings returned an unexpected response.',
    })
  }
})
