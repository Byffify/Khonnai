import test from 'node:test'
import assert from 'node:assert/strict'
import { parseInventoryInput, InventoryInputFailure } from '../server/inventory-input.ts'

const line = { variantId: 'variant', quantity: 1, price: 15000 }
const returned = { variantId: 'variant', quantity: 1, sellable: true }
const product = { id: 'product', code: 'KH-001', unit: 'แพ็ก', photo: '' }
const variant = { id: 'variant', productId: 'product', size: 'M', color: 'คละสี', contents: '', price: 15000, stock: 2 }
const input = command => ({ expectedRevision: 0, command: { id: 'operation', ...command } })
const commands = [
  { type: 'receive', variantId: 'variant', quantity: 1 },
  { type: 'adjust', variantId: 'variant', quantity: 0 },
  { type: 'sale', customer: '', lines: [line] },
  { type: 'reserve', customer: 'ลูกค้า', lines: [line] },
  { type: 'convert', reservationId: 'reservation' },
  { type: 'cancel-reservation', reservationId: 'reservation' },
  { type: 'edit-bill', billId: 'operation-bill', expectedVersion: 0, lines: [line] },
  { type: 'cancel-bill', billId: 'operation-bill', expectedVersion: 0 },
  { type: 'return', billId: '', lines: [returned] },
  { type: 'exchange', billId: '', lines: [returned], replacements: [line] },
  { type: 'product', product, variants: [variant], expectedRevision: 0 },
  { type: 'shop', name: '', phone: '', expectedRevision: 0 },
]

test('accepts every existing command without changing identifiers, units or satang values', () => {
  for (const command of commands) assert.deepEqual(parseInventoryInput(input(command)), input(command))
  assert.deepEqual(parseInventoryInput(input({ type: 'sale', customer: '', lines: [{ variantId: 'v', quantity: 1 }] })).command.lines, [{ variantId: 'v', quantity: 1 }])
})

test('rejects client identity, snapshots and unknown fields at every object boundary', () => {
  const sale = input(commands[2])
  for (const key of ['shopId', 'userId', 'state', 'timestamp', '__proto__']) {
    assert.throws(() => parseInventoryInput({ ...sale, [key]: 'forged' }), InventoryInputFailure)
    assert.throws(() => parseInventoryInput({ ...sale, command: { ...sale.command, [key]: 'forged' } }), InventoryInputFailure)
  }
  assert.throws(() => parseInventoryInput(input({ ...commands[2], expectedVersion: 1 })), InventoryInputFailure)
  assert.throws(() => parseInventoryInput(input({ ...commands[2], lines: [{ ...line, shopId: 'other' }] })), InventoryInputFailure)
  assert.throws(() => parseInventoryInput(input({ ...commands[10], product: { ...product, owner: 'other' } })), InventoryInputFailure)
  assert.throws(() => parseInventoryInput(input({ ...commands[10], variants: [{ ...variant, timestamp: 'now' }] })), InventoryInputFailure)
})

test('rejects malformed numbers and quantities without accepting coercion', () => {
  for (const value of [NaN, Infinity, -1, 0.5, '1', null, undefined, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => parseInventoryInput({ ...input(commands[0]), expectedRevision: value }), InventoryInputFailure)
    assert.throws(() => parseInventoryInput(input({ ...commands[0], quantity: value })), InventoryInputFailure)
    assert.throws(() => parseInventoryInput(input({ ...commands[10], variants: [{ ...variant, price: value }] })), InventoryInputFailure)
  }
  assert.throws(() => parseInventoryInput(input({ ...commands[0], quantity: 0 })), InventoryInputFailure)
  assert.throws(() => parseInventoryInput(input({ ...commands[8], lines: [{ ...returned, sellable: 'true' }] })), InventoryInputFailure)
})

test('rejects missing, oversized and invalid nested data', () => {
  for (const value of [null, [], '', 1, {}, { expectedRevision: 0 }, new Date()]) assert.throws(() => parseInventoryInput(value), InventoryInputFailure)
  for (const value of ['', ' ', 'x'.repeat(161), 'bad\nidentifier', '../other', 'id with spaces', 'id%2fother']) assert.throws(() => parseInventoryInput(input({ ...commands[0], variantId: value })), InventoryInputFailure)
  for (const lines of [[], Array(1001).fill(line), null]) assert.throws(() => parseInventoryInput(input({ ...commands[2], lines })), InventoryInputFailure)
  assert.throws(() => parseInventoryInput(input({ ...commands[3], customer: ' ' })), InventoryInputFailure)
  assert.throws(() => parseInventoryInput(input({ ...commands[10], variants: [variant, variant] })), InventoryInputFailure)
  assert.throws(() => parseInventoryInput(input({ ...commands[10], variants: [{ ...variant, productId: 'other' }] })), InventoryInputFailure)
})

test('aligns identifiers and text fields with database and receipt endpoint limits', () => {
  const command = input({ ...commands[2], customer: 'x'.repeat(1000) })
  command.command.id = 'a'.repeat(160)
  assert.deepEqual(parseInventoryInput(command), command)
  const settings = input({ ...commands[11], name: 'x'.repeat(160), phone: 'x'.repeat(120) })
  assert.deepEqual(parseInventoryInput(settings), settings)
  const exchangeBill = input({ ...commands[6], billId: `${'a'.repeat(160)}-bill` })
  assert.deepEqual(parseInventoryInput(exchangeBill), exchangeBill)
  assert.throws(() => parseInventoryInput(input({ ...commands[6], billId: 'a'.repeat(171) })), InventoryInputFailure)
  assert.throws(() => parseInventoryInput(input({ ...commands[2], customer: 'x'.repeat(1001) })), InventoryInputFailure)
  assert.throws(() => parseInventoryInput(input({ ...commands[11], phone: 'x'.repeat(121) })), InventoryInputFailure)
})

test('accepts canonical image data with matching signatures and rejects remote or disguised content', () => {
  const photo = bytes => `data:image/png;base64,${Buffer.from(bytes).toString('base64')}`
  const valid = photo([137, 80, 78, 71, 13, 10, 26, 10, 0])
  assert.equal(parseInventoryInput(input({ ...commands[10], product: { ...product, photo: valid } })).command.product.photo, valid)
  const jpeg = 'data:image/jpeg;base64,/9j/AA=='
  const webp = `data:image/webp;base64,${Buffer.from('RIFF0000WEBPdata').toString('base64')}`
  for (const source of [jpeg, webp]) assert.equal(parseInventoryInput(input({ ...commands[10], product: { ...product, photo: source } })).command.product.photo, source)
  for (const source of ['https://example.com/image.png', 'data:image/svg+xml;base64,PHN2Zz4=', photo('not an image'), valid.replace('png', 'jpeg'), 'data:image/png;base64,%%%%', 'data:image/png;base64,AAAAA===', 'x'.repeat(4_500_001)]) {
    assert.throws(() => parseInventoryInput(input({ ...commands[10], product: { ...product, photo: source } })), InventoryInputFailure)
  }
})

test('validation errors never echo hostile input', () => {
  assert.throws(() => parseInventoryInput(input({ type: 'secret-client-value' })), error => error instanceof InventoryInputFailure && error.code === 'INVALID_INPUT' && error.status === 400 && !error.message.includes('secret-client-value'))
})
