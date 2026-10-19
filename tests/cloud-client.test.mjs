import test from 'node:test'
import assert from 'node:assert/strict'
import { createCloudInventory, CloudFailure } from '../src/data/cloud.ts'
import { emptyState, execute } from '../src/domain/inventory.ts'

const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } })
const identity = id => json({ user: { id, email: `${id}@example.invalid` }, csrfToken: 'csrf' })
const command = { id: 'same-command', type: 'shop', name: 'My shop', phone: '' }

test('Settings password reset uses verified account email and bootstrap CSRF without changing shop data', async () => {
  const calls=[]
  const client=createCloudInventory(async(url,options)=>{
    calls.push([url,options])
    if(url==='/api/auth/session')return identity('a')
    if(url==='/api/inventory/state')return json({userId:'a',state:emptyState()})
    if(url==='/api/auth/csrf')return json({csrfToken:'bootstrap'})
    assert.equal(url,'/api/auth/recover')
    assert.deepEqual(JSON.parse(options.body),{email:'a@example.invalid'})
    assert.equal(options.headers['X-Khonnai-CSRF'],'bootstrap')
    return json({accepted:true},202)
  })
  await client.load()
  await client.sendPasswordReset()
  assert.equal(calls.filter(([url])=>url==='/api/auth/recover').length,1)
  assert.equal(client.uncertain,false)
})

test('Settings password reset refuses account changes and temporary errors without sending to another account', async () => {
  let user='a', unavailable=false, sends=0
  const client=createCloudInventory(async url=>{
    if(url==='/api/auth/session')return unavailable?json({error:'UNAVAILABLE'},503):identity(user)
    if(url==='/api/inventory/state')return json({userId:'a',state:emptyState()})
    sends++;throw Error('Must not reach email endpoint')
  })
  await client.load()
  unavailable=true
  await assert.rejects(client.sendPasswordReset(),error=>error.kind==='uncertain')
  assert.equal(client.user.id,'a')
  unavailable=false;user='b'
  await assert.rejects(client.sendPasswordReset(),error=>error.kind==='session')
  assert.equal(sends,0)
})

test('Settings password reset refuses missing CSRF and reports rate limits without exposing server details', async () => {
  let validCsrf=false, sends=0
  const client=createCloudInventory(async url=>{
    if(url==='/api/auth/session')return identity('a')
    if(url==='/api/inventory/state')return json({userId:'a',state:emptyState()})
    if(url==='/api/auth/csrf')return json(validCsrf?{csrfToken:'bootstrap'}:{})
    sends++;return json({error:'PRIVATE_PROVIDER_DETAILS'},429)
  })
  await client.load()
  await assert.rejects(client.sendPasswordReset(),/RESET_UNAVAILABLE/)
  assert.equal(sends,0)
  validCsrf=true
  await assert.rejects(client.sendPasswordReset(),/RESET_RATE_LIMITED/)
  assert.equal(sends,1);assert.equal(client.user.id,'a');assert.equal(client.uncertain,false)
})

test('cloud client reconciles a lost response without posting the committed command twice', async () => {
  let state = emptyState(), writes = 0
  const client = createCloudInventory(async (url, options) => {
    if (url === '/api/auth/session') return identity('a')
    if (url === '/api/inventory/state') return json({ userId: 'a', state })
    if (options?.method === 'POST') {
      writes++
      const input = JSON.parse(options.body)
      state = execute(state, input.command)
      throw new TypeError('Response lost after commit')
    }
    assert.equal(url, '/api/inventory/commands/same-command')
    return json({ userId: 'a', committed: true, state })
  })
  const initial = await client.load()
  await assert.rejects(client.commit(initial, command), error => error instanceof CloudFailure && error.kind === 'uncertain')
  assert.equal(client.uncertain, true)
  await assert.rejects(client.commit(initial, { ...command, id: 'other' }), /RESOLVE_PENDING_FIRST/)
  const recovered = await client.retry()
  assert.equal(recovered.shop.name, 'My shop')
  assert.equal(client.uncertain, false)
  assert.equal(writes, 1)
})

test('uncommitted network failure retries the exact original id, body and revision', async () => {
  const bodies = []
  const client = createCloudInventory(async (url, options) => {
    if (url === '/api/auth/session') return identity('a')
    if (url === '/api/inventory/state') return json({ userId: 'a', state: emptyState() })
    if (options?.method === 'POST') {
      bodies.push(options.body)
      if (bodies.length === 1) throw new TypeError('Offline')
      return json({ userId: 'a', state: execute(emptyState(), JSON.parse(options.body).command) })
    }
    return json({}, 404)
  })
  const initial = await client.load()
  await assert.rejects(client.commit(initial, command))
  command.name = 'Changed input after failure'
  await client.retry()
  assert.equal(bodies[0], bodies[1])
  command.name = 'My shop'
})

test('account changes discard pending commands before any replay or receipt request', async () => {
  let account = 'a', requests = 0
  const client = createCloudInventory(async (url, options) => {
    if (url === '/api/auth/session') return identity(account)
    if (url === '/api/inventory/state') return json({ userId: account, state: emptyState() })
    requests++
    if (options?.method === 'POST') throw new TypeError('Offline')
    throw new Error('Must not query old receipt under another account')
  })
  const initial = await client.load()
  await assert.rejects(client.commit(initial, command))
  account = 'b'
  await assert.rejects(client.retry(), error => error.kind === 'session')
  assert.equal(requests, 1)
  assert.equal(client.user, null)
  assert.equal(client.uncertain, false)
})

test('revision conflict is definitive and releases the pending operation', async () => {
  const client = createCloudInventory(async (url, options) => {
    if (url === '/api/auth/session') return identity('a')
    if (options?.method === 'POST') return json({ error: 'REVISION_CONFLICT' }, 409)
    return json({ userId: 'a', state: emptyState() })
  })
  await assert.rejects(client.commit(await client.load(), command), error => error.kind === 'conflict')
  assert.equal(client.uncertain, false)
})

test('late state response from a different account cannot populate the shop', async () => {
  const client = createCloudInventory(async url => url === '/api/auth/session' ? identity('a') : json({ userId: 'b', state: emptyState() }))
  await assert.rejects(client.load(), error => error.kind === 'session')
  assert.equal(client.user, null)
})

test('safe domain errors explain validation while arbitrary server messages stay hidden', async () => {
  let safe = true
  const client = createCloudInventory(async (url, options) => {
    if (url === '/api/auth/session') return identity('a')
    if (options?.method === 'POST') {
      assert.equal(options.headers['X-Khonnai-CSRF'], 'csrf')
      assert.equal(options.redirect, 'error')
      return json({ error: safe ? 'DOMAIN_INVALID' : 'INTERNAL_ERROR', message: 'จำนวนเกินที่ยังขายได้' }, 400)
    }
    return json({ userId: 'a', state: emptyState() })
  })
  const state = await client.load()
  await assert.rejects(client.commit(state, command), /จำนวนเกินที่ยังขายได้/)
  safe = false
  await assert.rejects(client.commit(state, command), /SAVE_FAILED/)
  assert.equal(client.uncertain, false)
})

test('pending session checks clear old account data without replaying a command', async () => {
  let signedIn = true, posts = 0
  const client = createCloudInventory(async (url, options) => {
    if (url === '/api/auth/session') return signedIn ? identity('a') : json({ user: null, csrfToken: null })
    if (options?.method === 'POST') { posts++; throw new TypeError('Response lost') }
    return json({ userId: 'a', state: emptyState() })
  })
  await assert.rejects(client.commit(await client.load(), command))
  signedIn = false
  await assert.rejects(client.checkSession(), error => error.kind === 'session')
  assert.equal(client.uncertain, false)
  assert.equal(client.user, null)
  assert.equal(posts, 1)
})

for (const failure of ['503', '429', 'malformed', 'invalid-json', 'network']) {
  test(`pending command survives temporary session ${failure} and reconciles without a second POST`, async () => {
    let failing = false, posts = 0
    const saved = execute(emptyState(), command)
    const client = createCloudInventory(async (url, options) => {
      if (url === '/api/auth/session') {
        if (!failing) return identity('a')
        if (failure === 'network') throw new TypeError('Offline')
        if (failure === 'invalid-json') return new Response('{', { status: 200 })
        if (failure === 'malformed') return json({ error: 'temporarily_unavailable' })
        return json({ error: 'temporarily_unavailable' }, Number(failure))
      }
      if (url === '/api/inventory/state') return json({ userId: 'a', state: emptyState() })
      if (options?.method === 'POST') { posts++; throw new TypeError('Response lost after commit') }
      return json({ userId: 'a', committed: true, state: saved })
    })
    await assert.rejects(client.commit(await client.load(), command))
    failing = true
    await assert.rejects(client.retry(), error => error instanceof CloudFailure && error.kind === 'uncertain')
    assert.equal(client.uncertain, true)
    assert.equal(client.user.id, 'a')
    failing = false
    assert.equal((await client.retry()).shop.name, 'My shop')
    assert.equal(posts, 1)
    assert.equal(client.uncertain, false)
  })
}
