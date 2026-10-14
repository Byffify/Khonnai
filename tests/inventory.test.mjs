import test from 'node:test'
import assert from 'node:assert/strict'
import { execute, availability, emptyState } from '../src/domain/inventory.ts'

function fixture() {
  const state = emptyState()
  state.products.push({ id: 'p', code: 'TEST', unit: 'แพ็ก', photo: '' })
  state.variants.push({ id: 'v', productId: 'p', size: 'M', color: 'คละสี', contents: 'สีที่จัดไว้แน่นอน', price: 15000, stock: 10 })
  return state
}

test('รับเข้าเพิ่มสต็อกทันที และบันทึกคำขอเดิมซ้ำไม่เพิ่มอีก', () => {
  const command = { id: 'receive', type: 'receive', variantId: 'v', quantity: 2 }
  const received = execute(fixture(), command)
  assert.equal(availability(received, 'v'), 12)
  assert.equal(availability(execute(received, command), 'v'), 12)
})

test('ออกบิลตัดสต็อกทันที เก็บราคา และไม่หักซ้ำเมื่อส่งคำขอเดิม', () => {
  const command = { id: 'sale', type: 'sale', customer: '', lines: [{ variantId: 'v', quantity: 3 }] }
  const sold = execute(fixture(), command)
  assert.equal(availability(sold, 'v'), 7)
  assert.equal(sold.bills[0].lines[0].price, 15000)
  assert.equal(execute(sold, command).bills.length, 1)
})

test('จองไม่ตัดสต็อก ซื้อจากจองครบปลดจองและหักครั้งเดียว', () => {
  const held = execute(fixture(), { id: 'hold', type: 'reserve', customer: 'ผู้ทดสอบ', lines: [{ variantId: 'v', quantity: 3 }] })
  assert.equal(held.variants[0].stock, 10)
  assert.equal(availability(held, 'v'), 7)
  const sold = execute(held, { id: 'convert', type: 'convert', reservationId: 'hold' })
  assert.equal(sold.variants[0].stock, 7)
  assert.equal(availability(sold, 'v'), 7)
  assert.equal(sold.reservations[0].status, 'sold')
})

test('แก้บิลปรับเฉพาะส่วนต่าง เปลี่ยนราคาไม่กระทบจำนวน และยกเลิกคืนครั้งเดียว', () => {
  const sold = execute(fixture(), { id: 'sale', type: 'sale', customer: '', lines: [{ variantId: 'v', quantity: 3 }] })
  const edited = execute(sold, { id: 'edit', type: 'edit-bill', billId: 'sale', lines: [{ variantId: 'v', quantity: 2, price: 17000 }] })
  assert.equal(availability(edited, 'v'), 8)
  assert.equal(edited.bills[0].history.length, 1)
  const cancelled = execute(edited, { id: 'cancel', type: 'cancel-bill', billId: 'sale' })
  assert.equal(availability(cancelled, 'v'), 10)
  assert.throws(() => execute(cancelled, { id: 'cancel-again', type: 'cancel-bill', billId: 'sale' }))
})

test('รับคืนพร้อมขายเพิ่มทันที รับคืนขายต่อไม่ได้ไม่เพิ่ม และคืนเกินที่ซื้อไม่ได้', () => {
  const sold = execute(fixture(), { id: 'sale', type: 'sale', customer: '', lines: [{ variantId: 'v', quantity: 3 }] })
  const returned = execute(sold, { id: 'return', type: 'return', billId: 'sale', lines: [{ variantId: 'v', quantity: 1, sellable: true }, { variantId: 'v', quantity: 1, sellable: false }] })
  assert.equal(availability(returned, 'v'), 8)
  assert.throws(() => execute(returned, { id: 'too-many', type: 'return', billId: 'sale', lines: [{ variantId: 'v', quantity: 2, sellable: true }] }))
  assert.throws(() => execute(returned, { id: 'cancel', type: 'cancel-bill', billId: 'sale' }))
})

test('เปลี่ยนสินค้าเป็นรายการเดียว รับของเดิมและขายของใหม่ทันที ล้มเหลวไม่เปลี่ยนข้อมูล', () => {
  const state = fixture()
  state.variants.push({ id: 'new', productId: 'p', size: 'L', color: 'ดำ', contents: '', price: 15000, stock: 5 })
  const changed = execute(state, { id: 'exchange', type: 'exchange', billId: '', lines: [{ variantId: 'v', quantity: 1, sellable: true }], replacements: [{ variantId: 'new', quantity: 2 }] })
  assert.equal(availability(changed, 'v'), 11)
  assert.equal(availability(changed, 'new'), 3)
  assert.equal(changed.bills.length, 1)
  assert.throws(() => execute(state, { id: 'bad-exchange', type: 'exchange', billId: '', lines: [{ variantId: 'v', quantity: 1, sellable: true }], replacements: [{ variantId: 'new', quantity: 20 }] }))
  assert.equal(availability(state, 'v'), 10)
})

test('เพิ่มสินค้าแพ็กคละ และปรับยอดจริงต่ำกว่าจองได้ แต่ห้ามขายเพิ่ม', () => {
  const product = { id: 'p', code: 'TEST', unit: 'แพ็ก', photo: '' }
  const variant = { id: 'v', productId: 'p', size: 'M', color: 'คละสี', contents: 'ดำและขาว', price: 15000, stock: 10 }
  const created = execute(emptyState(), { id: 'create', type: 'product', product, variants: [variant] })
  const held = execute(created, { id: 'hold', type: 'reserve', customer: 'ผู้ทดสอบ', lines: [{ variantId: 'v', quantity: 5 }] })
  const adjusted = execute(held, { id: 'adjust', type: 'adjust', variantId: 'v', quantity: 3 })
  assert.equal(availability(adjusted, 'v'), -2)
  assert.throws(() => execute(adjusted, { id: 'sale', type: 'sale', customer: '', lines: [{ variantId: 'v', quantity: 1 }] }))
})

test('ตรวจรายการซ้ำรวมจำนวนก่อนขาย และล้มเหลวทั้งบิลโดยไม่หักบางรายการ', () => {
  const state = fixture()
  assert.throws(() => execute(state, { id: 'over', type: 'sale', customer: '', lines: [{ variantId: 'v', quantity: 6 }, { variantId: 'v', quantity: 6 }] }))
  assert.equal(state.variants[0].stock, 10)
  for (const quantity of [0, -1, 1.5, NaN]) assert.throws(() => execute(state, { id: String(quantity), type: 'receive', variantId: 'v', quantity }))
})
test('หลังรับคืน แก้ราคาอย่างเดียวได้ แต่แก้จำนวนหรือยกเลิกไม่ได้', () => {
  const sold = execute(fixture(), { id: 'sale', type: 'sale', customer: '', lines: [{ variantId: 'v', quantity: 3 }] })
  const returned = execute(sold, { id: 'return', type: 'return', billId: 'sale', lines: [{ variantId: 'v', quantity: 1, sellable: true }] })
  const repriced = execute(returned, { id: 'price', type: 'edit-bill', billId: 'sale', lines: [{ variantId: 'v', quantity: 3, price: 16000 }] })
  assert.equal(availability(repriced, 'v'), 8)
  assert.equal(repriced.bills[0].lines[0].price, 16000)
  assert.throws(() => execute(returned, { id: 'quantity', type: 'edit-bill', billId: 'sale', lines: [{ variantId: 'v', quantity: 2 }] }))
})

test('แก้ราคาอย่างเดียวได้แม้สต็อกตรวจนับน้อยกว่าจอง', () => {
  const sold = execute(fixture(), { id: 'sale', type: 'sale', customer: '', lines: [{ variantId: 'v', quantity: 3 }] })
  const held = execute(sold, { id: 'held', type: 'reserve', customer: 'test', lines: [{ variantId: 'v', quantity: 5 }] })
  const adjusted = execute(held, { id: 'adjust', type: 'adjust', variantId: 'v', quantity: 3 })
  const corrected = execute(adjusted, { id: 'price', type: 'edit-bill', billId: 'sale', expectedVersion: 0, lines: [{ variantId: 'v', quantity: 3, price: 16000 }] })
  assert.equal(corrected.variants[0].stock, 3)
  assert.equal(availability(corrected, 'v'), -2)
})
test('บิลฉบับเก่าแก้ทับบิลใหม่ไม่ได้ แม้หน้าจอโหลด state ล่าสุดแล้ว', () => {
  const sold = execute(fixture(), { id: 'sale', type: 'sale', customer: '', lines: [{ variantId: 'v', quantity: 3 }] })
  const corrected = execute(sold, { id: 'new-edit', type: 'edit-bill', billId: 'sale', expectedVersion: 0, lines: [{ variantId: 'v', quantity: 2 }] })
  assert.throws(() => execute(corrected, { id: 'stale-edit', type: 'edit-bill', billId: 'sale', expectedVersion: 0, lines: [{ variantId: 'v', quantity: 3 }] }), /ฉบับ/)
  assert.equal(corrected.variants[0].stock, 8)
})
