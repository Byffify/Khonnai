import { emptyState, execute } from '../domain/inventory.ts'
import type { Command, State } from '../domain/inventory.ts'

export const STORAGE_KEY = 'micro-erp-v1'
type StoragePort = Pick<Storage, 'getItem' | 'setItem'>
const invalid = () => { throw new Error('ข้อมูลสำรองไม่ถูกต้องหรือเป็นคนละรุ่น ระบบยังไม่ได้แทนที่ข้อมูลเดิม') }
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return invalid()
  return value as Record<string, unknown>
}
function text(value: unknown): asserts value is string { if (typeof value !== 'string') invalid() }
function count(value: unknown, minimum = 0) { if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < minimum) invalid() }
function list(value: unknown): unknown[] { if (!Array.isArray(value)) return invalid(); return value }
function strings(row: Record<string, unknown>, keys: string[]) { for (const key of keys) text(row[key]) }
function items(value: unknown, kind: 'bill' | 'return' | 'reservation') {
  const rows = list(value)
  if (!rows.length) invalid()
  for (const item of rows) {
    const row = object(item); text(row.variantId); count(row.quantity, 1)
    if (kind === 'bill') { count(row.price); strings(row, ['code', 'size', 'color', 'unit']) }
    if (kind === 'reservation' && row.price !== undefined) count(row.price)
    if (kind === 'return' && typeof row.sellable !== 'boolean') invalid()
  }
}
export function parseBackup(raw: string): State {
  if (raw.length > 4_500_000) throw new Error('ข้อมูลใหญ่เกินไป ลดขนาดรูปสินค้าแล้วลองใหม่')
  let parsed: unknown
  try { parsed = JSON.parse(raw) } catch { return invalid() }
  const state = object(parsed)
  if (state.version !== 1) invalid()
  count(state.revision)
  const shop = object(state.shop); strings(shop, ['name', 'phone'])
  for (const entity of ['products', 'variants', 'bills', 'reservations', 'returns', 'movements']) {
    const seen = new Set<string>()
    for (const value of list(state[entity])) {
      const row = object(value); text(row.id)
      if (!row.id || seen.has(row.id)) invalid()
      seen.add(row.id)
      if (entity === 'products') {
        strings(row, ['code', 'unit', 'photo'])
        if (!row.code || !row.unit || (row.photo && !/^data:image\/(jpeg|png|webp);base64,/.test(String(row.photo)))) invalid()
      }
      if (entity === 'variants') { strings(row, ['productId', 'size', 'color', 'contents']); count(row.price); count(row.stock); if (!row.size || !row.color) invalid() }
      if (entity === 'bills') {
        strings(row, ['number', 'customer', 'date']); items(row.lines, 'bill')
        if (row.version === undefined) row.version = 0
        count(row.version)
        if (!['active', 'cancelled'].includes(String(row.status))) invalid()
        for (const history of list(row.history)) text(history)
      }
      if (entity === 'reservations') { text(row.customer); items(row.lines, 'reservation'); if (!['active', 'cancelled', 'sold'].includes(String(row.status))) invalid() }
      if (entity === 'returns') { strings(row, ['billId', 'date']); items(row.lines, 'return'); if (row.replacementBillId !== undefined) text(row.replacementBillId) }
      if (entity === 'movements') strings(row, ['date', 'text'])
    }
  }
  for (const id of list(state.commands)) text(id)
  const result = parsed as State
  const productIds = new Set(result.products.map(p => p.id))
  const variantIds = new Set(result.variants.map(v => v.id))
  const billIds = new Set(result.bills.map(b => b.id))
  for (const variant of result.variants) if (!productIds.has(variant.productId)) invalid()
  for (const doc of [...result.bills, ...result.reservations, ...result.returns]) for (const line of doc.lines) if (!variantIds.has(line.variantId)) invalid()
  for (const returned of result.returns) if ((returned.billId && !billIds.has(returned.billId)) || (returned.replacementBillId && !billIds.has(returned.replacementBillId))) invalid()
  for (const bill of result.bills) {
    const linked = result.returns.filter(r => r.billId === bill.id)
    if (bill.status === 'cancelled' && (linked.length || result.returns.some(r => r.replacementBillId === bill.id))) invalid()
    const sold = new Map<string, number>(), received = new Map<string, number>()
    for (const line of bill.lines) sold.set(line.variantId, (sold.get(line.variantId) ?? 0) + line.quantity)
    for (const line of linked.flatMap(r => r.lines)) received.set(line.variantId, (received.get(line.variantId) ?? 0) + line.quantity)
    for (const [id, quantity] of received) if (quantity > (sold.get(id) ?? 0)) invalid()
  }
  return result
}
export function load(storage: Pick<Storage, 'getItem'>): State {
  const raw = storage.getItem(STORAGE_KEY)
  return raw === null ? emptyState() : parseBackup(raw)
}
export function commit(storage: StoragePort, current: State, command: Command): State {
  const latest = load(storage)
  if (latest.revision !== current.revision) throw new Error('ข้อมูลเปลี่ยนในอีกแท็บ กรุณาโหลดข้อมูลล่าสุดก่อนบันทึก')
  const next = execute(current, command)
  const raw = JSON.stringify(next)
  parseBackup(raw)
  try { storage.setItem(STORAGE_KEY, raw) } catch { throw new Error('บันทึกไม่ได้ พื้นที่บนเครื่องอาจเต็ม กรุณาสำรองข้อมูลหรือลดรูปสินค้า') }
  return next
}
