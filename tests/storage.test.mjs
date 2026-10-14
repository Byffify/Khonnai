import test from 'node:test'
import assert from 'node:assert/strict'
import { emptyState, execute } from '../src/domain/inventory.ts'
import { commit, load, parseBackup } from '../src/data/storage.ts'

function memoryStorage() {
  let value = null
  return { getItem: () => value, setItem: (_, next) => { value = next } }
}
test('ข้อมูลคงอยู่หลังเปิดใหม่ และปฏิเสธหน้าที่ใช้ข้อมูลฉบับเก่า', () => {
  const storage = memoryStorage()
  const initial = load(storage)
  const next = commit(storage, initial, { id: 'shop', type: 'shop', name: 'ร้านทดสอบ', phone: '' })
  assert.equal(load(storage).shop.name, 'ร้านทดสอบ')
  assert.equal(next.revision, 1)
  assert.throws(() => commit(storage, initial, { id: 'old', type: 'shop', name: 'เก่า', phone: '' }), /ข้อมูลเปลี่ยน/)
})
test('ข้อมูลเสียหรือสำรองต่างรูปแบบไม่ถูกนำเข้า และบันทึกเต็มไม่เปลี่ยน state', () => {
  assert.throws(() => parseBackup('{"version":1}'))
  assert.throws(() => parseBackup(JSON.stringify({ ...emptyState(), version: 9 })))
  const initial = emptyState()
  assert.throws(() => commit({ getItem: () => null, setItem: () => { throw new Error('quota') } }, initial, { id: 'shop', type: 'shop', name: 'test', phone: '' }))
  assert.equal(initial.revision, 0)
})

test('ไฟล์สำรองที่ยอดคืนเชื่อมบิลเกินซื้อหรือบิลยกเลิกต้องถูกปฏิเสธ', () => {
  let state = emptyState()
  state.products.push({ id: 'p', code: 'TEST', unit: 'แพ็ก', photo: '' })
  state.variants.push({ id: 'v', productId: 'p', size: 'M', color: 'ดำ', contents: '', price: 10000, stock: 10 })
  state = execute(state, { id: 'sale', type: 'sale', customer: '', lines: [{ variantId: 'v', quantity: 3 }] })
  state.returns.push({ id: 'bad', billId: 'sale', date: new Date().toISOString(), lines: [{ variantId: 'v', quantity: 4, sellable: true }] })
  assert.throws(() => parseBackup(JSON.stringify(state)))
  state.returns[0].lines[0].quantity = 1
  state.bills[0].status = 'cancelled'
  assert.throws(() => parseBackup(JSON.stringify(state)))
})
