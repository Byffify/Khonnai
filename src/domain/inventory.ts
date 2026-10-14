export interface Product { id: string; code: string; unit: string; photo: string }
export interface Variant { id: string; productId: string; size: string; color: string; contents: string; price: number; stock: number }
export interface Item { variantId: string; quantity: number; price?: number }
export interface BillLine { variantId: string; quantity: number; price: number; code: string; size: string; color: string; unit: string }
export interface Bill { id: string; number: string; customer: string; date: string; lines: BillLine[]; status: 'active' | 'cancelled'; history: string[]; version: number }
export interface Reservation { id: string; customer: string; lines: Item[]; status: 'active' | 'cancelled' | 'sold' }
export interface ReturnedItem { variantId: string; quantity: number; sellable: boolean }
export interface ReturnRecord { id: string; billId: string; date: string; lines: ReturnedItem[]; replacementBillId?: string }
export interface Movement { id: string; date: string; text: string }
export interface State {
  version: 1; revision: number; products: Product[]; variants: Variant[]; bills: Bill[];
  reservations: Reservation[]; returns: ReturnRecord[]; commands: string[]; movements: Movement[];
  shop: { name: string; phone: string }
}
export type Command =
  | { id: string; type: 'receive'; variantId: string; quantity: number }
  | { id: string; type: 'sale'; customer: string; lines: Item[] }
  | { id: string; type: 'reserve'; customer: string; lines: Item[] }
  | { id: string; type: 'convert'; reservationId: string }
  | { id: string; type: 'cancel-reservation'; reservationId: string }
  | { id: string; type: 'edit-bill'; billId: string; lines: Item[]; expectedVersion?: number }
  | { id: string; type: 'cancel-bill'; billId: string; expectedVersion?: number }
  | { id: string; type: 'return'; billId: string; lines: ReturnedItem[] }
  | { id: string; type: 'exchange'; billId: string; lines: ReturnedItem[]; replacements: Item[] }
  | { id: string; type: 'product'; product: Product; variants: Variant[]; expectedRevision?: number }
  | { id: string; type: 'adjust'; variantId: string; quantity: number }
  | { id: string; type: 'shop'; name: string; phone: string; expectedRevision?: number }
export function emptyState(): State {
  return { version: 1, revision: 0, products: [], variants: [], bills: [], reservations: [], returns: [], commands: [], movements: [], shop: { name: '', phone: '' } }
}
export function availability(state: State, variantId: string): number {
  const variant = state.variants.find(v => v.id === variantId)
  if (!variant) throw new Error('ไม่พบสินค้า')
  return variant.stock - state.reservations.filter(r => r.status === 'active').flatMap(r => r.lines).filter(l => l.variantId === variantId).reduce((n, l) => n + l.quantity, 0)
}
export function execute(state: State, command: Command): State {
  if (!command.id) throw new Error('ไม่พบตัวระบุรายการ')
  if (state.commands.includes(command.id)) return state
  if ((command.type === 'product' || command.type === 'shop') && command.expectedRevision !== undefined && command.expectedRevision !== state.revision) throw new Error('ข้อมูลฉบับนี้เปลี่ยนแล้ว กรุณาเปิดฟอร์มใหม่ก่อนแก้ไข')
  const next = structuredClone(state)
  if (command.type === 'product') {
    const product = { ...command.product, code: command.product.code.trim(), unit: command.product.unit.trim() }
    if (!product.code || !product.unit || !command.variants.length) throw new Error('ระบุรหัส หน่วย และตัวเลือกสินค้า')
    if (next.products.some(p => p.code.toLowerCase() === product.code.toLowerCase() && p.id !== product.id)) throw new Error('รหัสสินค้าซ้ำ')
    const seen = new Set<string>()
    for (const input of command.variants) {
      if (!input.size.trim() || !input.color.trim()) throw new Error('ระบุไซซ์และสี')
      const key = `${input.size.trim().toLowerCase()}|${input.color.trim().toLowerCase()}`
      if (seen.has(key)) throw new Error('ไซซ์และสีซ้ำในรหัสนี้')
      seen.add(key)
      if (!Number.isSafeInteger(input.price) || input.price < 0 || !Number.isSafeInteger(input.stock) || input.stock < 0) throw new Error('ราคาและยอดเริ่มต้นไม่ถูกต้อง')
      const existing = next.variants.find(v => v.id === input.id)
      if (existing && existing.productId !== product.id) throw new Error('ตัวเลือกสินค้าไม่ตรงรหัส')
      const variant = { ...input, productId: product.id, size: input.size.trim(), color: input.color.trim(), stock: existing?.stock ?? input.stock }
      if (existing) Object.assign(existing, variant)
      else next.variants.push(variant)
    }
    const existing = next.products.find(p => p.id === product.id)
    if (existing) Object.assign(existing, product)
    else next.products.push(product)
  } else if (command.type === 'shop') {
    next.shop = { name: command.name.trim(), phone: command.phone.trim() }
  } else if (command.type === 'receive' || command.type === 'adjust') {
    const variant = findVariant(next, command.variantId)
    if (command.type === 'receive') {
      positiveInteger(command.quantity)
      if (!Number.isSafeInteger(variant.stock + command.quantity)) throw new Error('จำนวนมากเกินไป')
      variant.stock += command.quantity
    } else {
      if (!Number.isSafeInteger(command.quantity) || command.quantity < 0) throw new Error('ยอดจริงต้องเป็นจำนวนเต็มตั้งแต่ 0')
      variant.stock = command.quantity
    }
  } else if (command.type === 'sale') {
    addBill(next, command.id, command.customer, command.lines)
  } else if (command.type === 'reserve') {
    if (!command.customer.trim()) throw new Error('ระบุชื่อลูกค้าที่จอง')
    const lines = billLines(next, command.lines)
    checkAvailable(next, lines)
    next.reservations.unshift({ id: command.id, customer: command.customer.trim(), lines, status: 'active' })
  } else if (command.type === 'convert' || command.type === 'cancel-reservation') {
    const reservation = next.reservations.find(r => r.id === command.reservationId && r.status === 'active')
    if (!reservation) throw new Error('การจองนี้ไม่อยู่ในสถานะรอซื้อ')
    reservation.status = command.type === 'convert' ? 'sold' : 'cancelled'
    if (command.type === 'convert') addBill(next, command.id, reservation.customer, reservation.lines.map(l => ({ variantId: l.variantId, quantity: l.quantity })))
  } else if (command.type === 'return' || command.type === 'exchange') {
    addReturn(next, command.id, command.billId, command.lines)
    if (command.type === 'exchange') {
      addBill(next, `${command.id}-bill`, '', command.replacements)
      next.returns[0].replacementBillId = `${command.id}-bill`
    }
  } else {
    const bill = next.bills.find(b => b.id === command.billId && b.status === 'active')
    if (!bill) throw new Error('บิลนี้ถูกยกเลิกหรือไม่พบ')
    if (command.expectedVersion !== undefined && command.expectedVersion !== bill.version) throw new Error('บิลฉบับนี้เปลี่ยนแล้ว กรุณากลับไปเปิดบิลล่าสุดก่อนแก้ไข')
    const linked = next.returns.some(r => r.billId === bill.id || r.replacementBillId === bill.id)
    if (command.type === 'edit-bill') {
      const lines = billLines(next, command.lines)
      const before = totals(bill.lines), after = totals(lines)
      if (linked && (before.size !== after.size || [...before].some(([id, quantity]) => after.get(id) !== quantity))) throw new Error('บิลนี้มีรายการคืน/เปลี่ยนแล้ว แก้จำนวนไม่ได้ แต่แก้ราคาได้')
      const ids = new Set([...before.keys(), ...after.keys()])
      for (const id of ids) {
        const delta = (after.get(id) ?? 0) - (before.get(id) ?? 0)
        if (delta > 0 && delta > availability(next, id)) throw new Error('ของไม่พอ: จำนวนที่เพิ่มเกินที่ยังขายได้')
      }
      for (const id of ids) findVariant(next, id).stock -= (after.get(id) ?? 0) - (before.get(id) ?? 0)
      bill.history.unshift(`${new Date().toLocaleString('th-TH')}: แก้ไข ${JSON.stringify(bill.lines)}`)
      bill.lines = lines
    } else {
      if (linked) throw new Error('บิลนี้มีรายการคืน/เปลี่ยนแล้ว ยกเลิกไม่ได้ เพื่อไม่คืนสต็อกซ้ำ')
      for (const line of bill.lines) findVariant(next, line.variantId).stock += line.quantity
      bill.status = 'cancelled'
      bill.history.unshift(`${new Date().toLocaleString('th-TH')}: ยกเลิกบิล`)
    }
    bill.version += 1
  }
  next.revision += 1
  next.commands.push(command.id)
  next.movements.unshift({ id: command.id, date: new Date().toISOString(), text: command.type })
  return next
}
function findVariant(state: State, id: string): Variant {
  const variant = state.variants.find(v => v.id === id)
  if (!variant) throw new Error('ไม่พบสินค้า')
  return variant
}
function positiveInteger(quantity: number) {
  if (!Number.isSafeInteger(quantity) || quantity <= 0) throw new Error('จำนวนต้องเป็นจำนวนเต็มมากกว่า 0')
}
function billLines(state: State, items: Item[]): BillLine[] {
  if (!items.length) throw new Error('เลือกสินค้าอย่างน้อย 1 รายการ')
  return items.map(item => {
    positiveInteger(item.quantity)
    const variant = findVariant(state, item.variantId)
    const product = state.products.find(p => p.id === variant.productId)
    if (!product) throw new Error('ไม่พบรหัสสินค้า')
    const price = item.price ?? variant.price
    if (!Number.isSafeInteger(price) || price < 0) throw new Error('ราคาไม่ถูกต้อง')
    return { ...item, price, code: product.code, size: variant.size, color: variant.color, unit: product.unit }
  })
}
function totals(items: Item[]): Map<string, number> {
  const result = new Map<string, number>()
  for (const item of items) result.set(item.variantId, (result.get(item.variantId) ?? 0) + item.quantity)
  return result
}
function checkAvailable(state: State, items: Item[]) {
  for (const [id, quantity] of totals(items)) {
    if (quantity > availability(state, id)) throw new Error('ของไม่พอ: จำนวนเกินที่ยังขายได้')
  }
}
function deduct(state: State, items: Item[]) {
  checkAvailable(state, items)
  for (const [id, quantity] of totals(items)) findVariant(state, id).stock -= quantity
}
function addBill(state: State, id: string, customer: string, items: Item[]) {
  const lines = billLines(state, items)
  deduct(state, lines)
  state.bills.unshift({ id, number: `B${String(state.bills.length + 1).padStart(5, '0')}`, customer, date: new Date().toISOString(), lines, status: 'active', history: [], version: 0 })
}
function addReturn(state: State, id: string, billId: string, lines: ReturnedItem[]) {
  if (!lines.length) throw new Error('เลือกสินค้าที่รับคืน')
  for (const line of lines) { positiveInteger(line.quantity); findVariant(state, line.variantId) }
  if (billId) {
    const bill = state.bills.find(b => b.id === billId && b.status === 'active')
    if (!bill) throw new Error('ไม่พบบิลที่รับคืนได้')
    const sold = totals(bill.lines)
    const previous = totals(state.returns.filter(r => r.billId === billId).flatMap(r => r.lines))
    for (const [variantId, quantity] of totals(lines)) {
      if (quantity + (previous.get(variantId) ?? 0) > (sold.get(variantId) ?? 0)) throw new Error('จำนวนคืนเกินจำนวนที่ซื้อ หรือเคยคืนแล้ว')
    }
  }
  for (const line of lines) if (line.sellable) findVariant(state, line.variantId).stock += line.quantity
  state.returns.unshift({ id, billId, date: new Date().toISOString(), lines })
}
