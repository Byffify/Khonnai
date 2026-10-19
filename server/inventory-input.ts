import type { Command, Item, ReturnedItem, Variant } from '../src/domain/inventory.ts'

export class InventoryInputFailure extends Error {
  readonly code = 'INVALID_INPUT'
  readonly status = 400
  constructor() { super('ข้อมูลที่ส่งไม่ถูกต้อง กรุณาตรวจรายการแล้วลองใหม่') }
}

function invalid(): never { throw new InventoryInputFailure() }
function object(value: unknown, allowed: readonly string[]): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return invalid()
  const prototype: unknown = Object.getPrototypeOf(value)
  if (prototype !== Object.prototype && prototype !== null) return invalid()
  if (Object.keys(value).some(key => !allowed.includes(key))) return invalid()
  return value as Record<string, unknown>
}
function text(value: unknown, maximum = 500, nonempty = false): string {
  if (typeof value !== 'string' || value.length > maximum || (nonempty && !value.trim())) return invalid()
  return value
}
function id(value: unknown, maximum = 160): string {
  const result = text(value, maximum, true)
  if (!/^[A-Za-z0-9_-]+$/.test(result)) return invalid()
  return result
}
function integer(value: unknown, minimum = 0): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < minimum) return invalid()
  return value
}
function rows<T>(value: unknown, parse: (item: unknown) => T): T[] {
  if (!Array.isArray(value) || !value.length || value.length > 1000) return invalid()
  return value.map(parse)
}
function item(value: unknown): Item {
  const row = object(value, ['variantId', 'quantity', 'price'])
  return { variantId: id(row.variantId), quantity: integer(row.quantity, 1), ...('price' in row ? { price: integer(row.price) } : {}) }
}
function returned(value: unknown): ReturnedItem {
  const row = object(value, ['variantId', 'quantity', 'sellable'])
  if (typeof row.sellable !== 'boolean') return invalid()
  return { variantId: id(row.variantId), quantity: integer(row.quantity, 1), sellable: row.sellable }
}
function variant(value: unknown): Variant {
  const row = object(value, ['id', 'productId', 'size', 'color', 'contents', 'price', 'stock'])
  return { id: id(row.id), productId: id(row.productId), size: text(row.size, 120, true), color: text(row.color, 120, true), contents: text(row.contents, 1000), price: integer(row.price), stock: integer(row.stock) }
}
function photo(value: unknown): string {
  const source = text(value, 4_500_000)
  if (!source) return source
  const match = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(source)
  if (!match || match[2].length % 4 !== 0) return invalid()
  const bytes = Buffer.from(match[2], 'base64')
  if (bytes.toString('base64') !== match[2]) return invalid()
  const valid = match[1] === 'jpeg'
    ? bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    : match[1] === 'png'
      ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : bytes.length >= 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP'
  if (!valid) return invalid()
  return source
}
function command(value: unknown): Command {
  const row = object(value, ['id', 'type', 'variantId', 'quantity', 'customer', 'lines', 'reservationId', 'billId', 'expectedVersion', 'product', 'variants', 'expectedRevision', 'name', 'phone', 'replacements'])
  const commandId = id(row.id)
  const exact = (fields: string[]) => object(value, ['id', 'type', ...fields])
  switch (row.type) {
    case 'receive': case 'adjust':
      exact(['variantId', 'quantity'])
      return { id: commandId, type: row.type, variantId: id(row.variantId), quantity: integer(row.quantity, row.type === 'receive' ? 1 : 0) }
    case 'sale': case 'reserve':
      exact(['customer', 'lines'])
      return { id: commandId, type: row.type, customer: text(row.customer, 1000, row.type === 'reserve'), lines: rows(row.lines, item) }
    case 'convert': case 'cancel-reservation':
      exact(['reservationId'])
      return { id: commandId, type: row.type, reservationId: id(row.reservationId) }
    case 'edit-bill':
      exact(['billId', 'lines', 'expectedVersion'])
      return { id: commandId, type: row.type, billId: id(row.billId, 170), lines: rows(row.lines, item), ...('expectedVersion' in row ? { expectedVersion: integer(row.expectedVersion) } : {}) }
    case 'cancel-bill':
      exact(['billId', 'expectedVersion'])
      return { id: commandId, type: row.type, billId: id(row.billId, 170), ...('expectedVersion' in row ? { expectedVersion: integer(row.expectedVersion) } : {}) }
    case 'return':
      exact(['billId', 'lines'])
      return { id: commandId, type: row.type, billId: row.billId === '' ? '' : id(row.billId, 170), lines: rows(row.lines, returned) }
    case 'exchange':
      exact(['billId', 'lines', 'replacements'])
      return { id: commandId, type: row.type, billId: row.billId === '' ? '' : id(row.billId, 170), lines: rows(row.lines, returned), replacements: rows(row.replacements, item) }
    case 'product': {
      exact(['product', 'variants', 'expectedRevision'])
      const product = object(row.product, ['id', 'code', 'unit', 'photo'])
      const parsed = { id: id(product.id), code: text(product.code, 160, true), unit: text(product.unit, 120, true), photo: photo(product.photo) }
      const variants = rows(row.variants, variant)
      if (new Set(variants.map(input => input.id)).size !== variants.length || variants.some(input => input.productId !== parsed.id)) return invalid()
      return { id: commandId, type: row.type, product: parsed, variants, ...('expectedRevision' in row ? { expectedRevision: integer(row.expectedRevision) } : {}) }
    }
    case 'shop':
      exact(['name', 'phone', 'expectedRevision'])
      return { id: commandId, type: row.type, name: text(row.name, 160), phone: text(row.phone, 120), ...('expectedRevision' in row ? { expectedRevision: integer(row.expectedRevision) } : {}) }
    default: return invalid()
  }
}

export function parseInventoryInput(value: unknown): { expectedRevision: number; command: Command } {
  const envelope = object(value, ['expectedRevision', 'command'])
  return { expectedRevision: integer(envelope.expectedRevision), command: command(envelope.command) }
}
