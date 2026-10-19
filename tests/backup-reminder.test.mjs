import test from 'node:test'
import assert from 'node:assert/strict'
import { emptyState } from '../src/domain/inventory.ts'
import { backupDue, daysSince, readBackup, recordBackup, BACKUP_KEY } from '../src/data/backupReminder.ts'

const day = 86_400_000
const now = Date.parse('2026-10-20T12:00:00Z')
const withBill = () => ({ ...emptyState(), revision: 5, bills: [{ id: 'b' }] })

test('no reminder for a shop without sales, and one after the first bill when never backed up', () => {
  assert.equal(backupDue(emptyState(), null, now), false)
  assert.equal(backupDue(withBill(), null, now), true)
})

test('a backup silences the reminder until it is a week old and the data has changed', () => {
  const state = withBill()
  assert.equal(backupDue(state, { date: new Date(now - 10 * day).toISOString(), revision: 5 }, now), false)
  assert.equal(backupDue(state, { date: new Date(now - 6 * day).toISOString(), revision: 4 }, now), false)
  assert.equal(backupDue(state, { date: new Date(now - 7 * day).toISOString(), revision: 4 }, now), true)
})

test('days are whole and never negative', () => {
  assert.equal(daysSince(new Date(now - 36 * 3_600_000).toISOString(), now), 1)
  assert.equal(daysSince(new Date(now + day).toISOString(), now), 0)
})

test('the record survives a round trip and an unreadable record counts as none', () => {
  const store = new Map()
  globalThis.localStorage = { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) }
  assert.equal(readBackup(), null)
  const record = recordBackup(9)
  assert.deepEqual(readBackup(), record)
  store.set(BACKUP_KEY, '{not json')
  assert.equal(readBackup(), null)
  store.set(BACKUP_KEY, JSON.stringify({ date: 'yesterday', revision: 1 }))
  assert.equal(readBackup(), null)
  delete globalThis.localStorage
})
