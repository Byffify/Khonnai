import test from 'node:test'
import assert from 'node:assert/strict'
import { translate, canonicalMessage, isLanguage } from '../src/i18n.ts'
import { english } from '../src/messages.ts'

test('localized UI templates preserve shop-entered text and literal special characters', () => {
  const product = 'สินค้า / Saved $& <script> ทดสอบ'
  assert.equal(translate('ดูไซซ์ / สีและจัดการ {0}', 'en', product), 'View sizes / colors and manage ' + product)
  assert.equal(translate('หน่วย: {0}', 'en', 'แพ็ก'), 'Unit: แพ็ก')
  assert.equal(translate('unknown external message', 'en'), 'unknown external message')
})
test('captured validation labels and known system messages can change language again', () => {
  assert.equal(canonicalMessage('Product code'), 'รหัสสินค้า')
  assert.equal(translate('Saved', 'th'), 'บันทึกแล้ว')
  assert.equal(translate('View bill B00001 at full size', 'th'), 'ดูบิล B00001 ขนาดเต็ม')
  assert.equal(translate('ข้อมูลเปลี่ยนในอีกแท็บ กรุณาโหลดข้อมูลล่าสุดก่อนบันทึก', 'en'), 'Data changed in another tab. Load the latest data before saving.')
})
test('English messages retain every interpolation slot and contain translated copy', () => {
  for (const [source, translation] of Object.entries(english)) {
    assert.ok(translation.trim(), source)
    assert.deepEqual([...source.matchAll(/\{\d+\}/g)].map(v => v[0]).sort(), [...translation.matchAll(/\{\d+\}/g)].map(v => v[0]).sort(), source)
    if (source !== 'ภาษา / Language') assert.equal(/[ก-๛]/.test(translation.replaceAll('฿', '')), false, source)
  }
})
test('only supported language codes are accepted', () => {
  assert.equal(isLanguage('th'), true)
  assert.equal(isLanguage('en'), true)
  for (const value of ['TH', 'en-US', '', null, {}, 'ja']) assert.equal(isLanguage(value), false)
})
