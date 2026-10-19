import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer, request as httpRequest } from 'node:http'
import { once } from 'node:events'
import { randomBytes } from 'node:crypto'
import { emptyState } from '../src/domain/inventory.ts'
import { createInventoryHandler } from '../server/inventory-http.ts'

async function harness(t) {
  const sessionId = randomBytes(32).toString('base64url')
  const csrfToken = randomBytes(32).toString('base64url')
  const calls = []
  let unavailable = false, limited = false, active = true
  const snapshot = emptyState()
  const inventory = {
    load: async user => { calls.push(['load', user]); if (unavailable) throw Error('PRIVATE_DATABASE_URI'); return snapshot },
    commit: async (user, revision, command) => { calls.push(['commit', user, revision, command]); return snapshot },
    lookup: async (user, id) => { calls.push(['lookup', user, id]); return { committed: id === 'saved', state: snapshot } },
  }
  const sessions = { authenticate: async id => active && id === sessionId ? { userId: 'owner-a', email: 'private@example.invalid', csrfToken } : null }
  const server = createServer(createInventoryHandler({ origin: 'http://127.0.0.1:5293', sessions, inventory, rateLimit: async () => !limited }))
  server.listen(0, '127.0.0.1'); await once(server, 'listening')
  t.after(() => new Promise(resolve => server.close(resolve)))
  async function request(path, method = 'GET', value, headers = {}) {
    return new Promise((resolve, reject) => {
      const req = httpRequest({ hostname: '127.0.0.1', port: server.address().port, path, method,
        headers: { host: '127.0.0.1:5293', origin: 'http://127.0.0.1:5293', cookie: `khonnai_staging_session=${sessionId}`, 'x-khonnai-csrf': csrfToken, 'content-type': 'application/json', ...headers } }, res => {
        const chunks = []
        res.on('data', chunk => chunks.push(chunk))
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(Buffer.concat(chunks).toString('utf8')) }))
      })
      req.on('error', reject)
      req.end(value === undefined ? undefined : JSON.stringify(value))
    })
  }
  return { request, calls, fail: () => { unavailable = true }, limit: () => { limited = true }, logout: () => { active = false } }
}
const input = { expectedRevision: 0, command: { id: 'new-command', type: 'shop', name: 'ร้านใหม่', phone: '' } }

test('Inventory API requires verified session, correct host/origin and session CSRF before writes', async t => {
  const h = await harness(t)
  for (const headers of [{ cookie: '' }, { cookie: 'khonnai_staging_session=invalid' }]) {
    assert.equal((await h.request('/api/inventory/state', 'GET', undefined, headers)).status, 401)
  }
  for (const headers of [{ host: 'attacker.invalid' }, { origin: 'https://attacker.invalid' }, { 'x-khonnai-csrf': '' }, { 'sec-fetch-site': 'cross-site' }]) {
    assert.equal((await h.request('/api/inventory/commands', 'POST', input, headers)).status, 403)
  }
  assert.equal(h.calls.length, 0)
})

test('Inventory API derives identity from session and returns uncached confirmed state', async t => {
  const h = await harness(t)
  const read = await h.request('/api/inventory/state')
  assert.equal(read.status, 200)
  assert.match(read.headers['cache-control'], /no-store/)
  assert.deepEqual(read.data, { userId: 'owner-a', state: emptyState() })
  assert.equal((await h.request('/api/inventory/commands', 'POST', input)).status, 200)
  assert.deepEqual(h.calls[1], ['commit', 'owner-a', 0, input.command])
  assert.equal((await h.request('/api/inventory/commands', 'POST', { ...input, userId: 'owner-b' })).status, 400)
  assert.equal((await h.request('/api/inventory/commands', 'POST', { ...input, command: { ...input.command, shopId: 'foreign-shop' } })).status, 400)
  assert.equal(h.calls.length, 2)
})

test('Receipt reconciliation is scoped to session and missing commands are not success', async t => {
  const h = await harness(t)
  const saved = await h.request('/api/inventory/commands/saved')
  assert.equal(saved.status, 200); assert.equal(saved.data.committed, true)
  assert.equal((await h.request('/api/inventory/commands/missing')).status, 404)
  assert.deepEqual(h.calls, [['lookup', 'owner-a', 'saved'], ['lookup', 'owner-a', 'missing']])
  h.logout()
  assert.equal((await h.request('/api/inventory/commands/saved')).status, 401)
})

test('Inventory API rejects malformed writes and hides infrastructure errors', async t => {
  const h = await harness(t)
  assert.equal((await h.request('/api/inventory/commands', 'POST', input, { 'content-type': 'text/plain' })).status, 415)
  assert.equal((await h.request('/api/inventory/commands', 'POST', {})).status, 400)
  assert.equal((await h.request('/api/inventory/state?shop=other')).status, 404)
  h.fail()
  const failed = await h.request('/api/inventory/state')
  assert.equal(failed.status, 503); assert.deepEqual(failed.data, { error: 'UNAVAILABLE' })
  h.limit()
  assert.equal((await h.request('/api/inventory/state')).status, 429)
})
