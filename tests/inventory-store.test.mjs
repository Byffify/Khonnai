import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createInventoryStore, commandDigest } from '../server/inventory-store.ts'
import { emptyState } from '../src/domain/inventory.ts'

const command = { id: 'sale-a', type: 'sale', customer: '', lines: [{ variantId: 'v1', quantity: 1 }] }
function fixture({ revision = 3, receipt, shop = true, fail = '' } = {}) {
  const calls = []
  let released = false
  const state = emptyState()
  const db = {
    async query(sql) {
      calls.push(sql)
      if (sql === fail) throw new Error('PRIVATE DATABASE DETAIL')
      if (sql.includes('for update')) return { rows: shop ? [{ id: 'shop-a', name: '', phone: '', revision: String(revision) }] : [] }
      if (sql.startsWith('select digest')) return { rows: receipt ? [{ digest: receipt }] : [] }
      if (sql.startsWith('select 1 from khonnai_app.command_receipts')) return { rows: [], rowCount: 0 }
      if (sql.includes('jsonb_agg')) return { rows: [{ ...state, commands: receipt ? [command.id] : [] }] }
      return { rows: [], rowCount: 0 }
    },
    release() { released = true },
  }
  const store = createInventoryStore({ async connect() { return db } })
  return { store, calls, released: () => released }
}

test('command identity ignores object key order but preserves list order and payload', () => {
  assert.equal(commandDigest(command), commandDigest({ lines: [{ quantity: 1, variantId: 'v1' }], customer: '', type: 'sale', id: 'sale-a' }))
  assert.notEqual(commandDigest(command), commandDigest({ ...command, customer: 'different' }))
  assert.notEqual(commandDigest({ ...command, lines: [{ variantId: 'v1', quantity: 1 }, { variantId: 'v2', quantity: 1 }] }), commandDigest({ ...command, lines: [{ variantId: 'v2', quantity: 1 }, { variantId: 'v1', quantity: 1 }] }))
})

test('confirmed retry returns latest state before checking stale revision without writing stock', async () => {
  const f = fixture({ receipt: commandDigest(command) })
  const result = await f.store.commit('user-a', 0, command)
  assert.equal(result.revision, 3)
  assert.deepEqual(result.commands, ['sale-a'])
  assert.equal(f.calls.some(sql => sql.startsWith('delete ') || sql.startsWith('insert ')), false)
  assert.equal(f.calls.at(-1), 'commit')
  assert.equal(f.released(), true)
})

test('same command id with changed payload is rejected even at stale revision', async () => {
  const f = fixture({ receipt: commandDigest(command) })
  await assert.rejects(f.store.commit('user-a', 0, { ...command, customer: 'different' }), { code: 'COMMAND_ID_REUSED', status: 409 })
  assert.equal(f.calls.at(-1), 'rollback')
})

test('stale fresh command cannot run domain logic or persist', async () => {
  const f = fixture()
  await assert.rejects(f.store.commit('user-a', 0, command), { code: 'CONFLICT', status: 409 })
  assert.equal(f.calls.some(sql => sql.includes('jsonb_agg') || sql.startsWith('delete ')), false)
  assert.equal(f.calls.at(-1), 'rollback')
})

test('domain rejection leaves every relational row untouched', async () => {
  const f = fixture()
  await assert.rejects(f.store.commit('user-a', 3, command), { code: 'DOMAIN_INVALID', status: 400 })
  assert.equal(f.calls.some(sql => sql.startsWith('delete ')), false)
  assert.equal(f.calls.at(-1), 'rollback')
})

test('missing membership cannot load or reconcile another shop', async () => {
  const f = fixture({ shop: false })
  await assert.rejects(f.store.load('user-b'), { code: 'UNAUTHORIZED', status: 403 })
  await assert.rejects(f.store.lookup('user-b', 'sale-a'), { code: 'UNAUTHORIZED', status: 403 })
})

test('database failure is generic, rolls back and releases the connection', async () => {
  const f = fixture({ fail: 'commit' })
  await assert.rejects(f.store.load('user-a'), error => error.code === 'UNAVAILABLE' && !error.message.includes('PRIVATE'))
  assert.equal(f.calls.at(-1), 'rollback')
  assert.equal(f.released(), true)
  await assert.rejects(createInventoryStore({ async connect() { throw new Error('PRIVATE PASSWORD') } }).load('user-a'), error => error.code === 'UNAVAILABLE' && !error.message.includes('PRIVATE'))
})
