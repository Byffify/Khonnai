import { Icon } from '../Icon'
import { useMemo, useState } from 'react'
import { availability } from '../domain/inventory'
import type { Item, Bill, ReturnedItem } from '../domain/inventory'
import { BackButton, Button, EmptyState, Field, Form } from '../ui'
import { money } from '../domain/format'
import { CashReceipt } from './CashReceipt'
import { BillArchive } from './BillArchive'
import type { Receipt } from './BillImage'
import { billImage, download } from './BillImage'
import type { FeatureProps } from './types'

function description(state: FeatureProps['state'], id: string) {
  const variant = state.variants.find(v => v.id === id)!
  const product = state.products.find(p => p.id === variant.productId)!
  return `${product.code} / ${variant.size} / ${variant.color} (${product.unit})`
}
export function ItemsEditor({ state, lines, change, prices = false, kind = 'normal' }: { state: FeatureProps['state']; lines: Item[]; change: (lines: Item[]) => void; prices?: boolean; kind?: 'normal' | 'incoming' | 'outgoing' }) {
  const [query, setQuery] = useState('')
  const productLabel = kind === 'incoming' ? 'สินค้ารับคืน' : kind === 'outgoing' ? 'สินค้าใหม่' : 'สินค้า'
  const quantityLabel = kind === 'incoming' ? 'จำนวนรับคืน' : kind === 'outgoing' ? 'จำนวนส่งออก' : 'จำนวน'
  const matching = state.variants.filter(variant => state.products.find(product => product.id === variant.productId)?.code.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
  return <div className="stack item-editor">{lines.length > 0 && <div className="transaction-search row"><Field data-transient label={`ค้นหารหัส${productLabel}`} type="search" value={query} onChange={event => setQuery(event.target.value)} />{query && <Button variant="secondary" aria-label={`ล้างการค้นหา${productLabel}`} onClick={event => { setQuery('' ); event.currentTarget.parentElement?.querySelector<HTMLInputElement>('input[type=search]')?.focus() }}>ล้างค้นหา</Button>}</div>}{query.trim() && <p className="muted" role="status">พบ {matching.length} ตัวเลือกไซซ์ / สี</p>}{lines.map((line, i) => {
    const variant = state.variants.find(v => v.id === line.variantId)
    const product = state.products.find(p => p.id === variant?.productId)
    return <div className="line-item" key={i}><label className="field"><span>{productLabel} {i + 1}</span><select required aria-label={`${productLabel} ${i + 1}`} value={line.variantId} onChange={e => { const selected = state.variants.find(v => v.id === e.target.value); change(lines.map((l, j) => j === i ? { variantId: selected?.id ?? '', quantity: l.quantity, ...(prices ? { price: selected?.price ?? 0 } : {}) } : l)) }}><option value="">เลือกสินค้า</option>{state.variants.filter(v => matching.includes(v) || v.id === line.variantId).map(v => <option key={v.id} value={v.id}>{description(state, v.id)} · ขายได้ {Math.max(0, availability(state, v.id))}</option>)}</select></label><Field label={`${quantityLabel} ${i + 1}`} hint={product ? `หน่วย: ${product.unit}` : undefined} type="number" min="1" step="1" inputMode="numeric" value={line.quantity} onChange={e => change(lines.map((l, j) => j === i ? { ...l, quantity: Number(e.target.value) } : l))} /><Button data-draft className="remove" variant="danger" aria-label={`ลบ${productLabel} ${i + 1}`} onClick={() => change(lines.filter((_, j) => j !== i))}>ลบ</Button>{variant && product && <div className="selected-item" role="group" aria-label={`รายละเอียด${productLabel}ที่เลือก ${i + 1}`}><p><strong>{product.code}</strong> · ไซซ์ {variant.size} · {variant.color}</p><p>หน่วย: {product.unit} · ราคา ฿{money(line.price ?? variant.price)} / {product.unit}</p><p>ขายได้ {Math.max(0, availability(state, variant.id))} {product.unit}</p>{variant.contents && <p className="muted">ในแพ็ก: {variant.contents}</p>}</div>}{prices && <Field label={`ราคา ${i + 1} (บาท)`} type="number" min="0" step="0.01" value={(line.price ?? variant?.price ?? 0) / 100} onChange={e => change(lines.map((l, j) => j === i ? { ...l, price: Math.round(Number(e.target.value) * 100) } : l))} />}</div>
  })}<Button data-draft variant="secondary" disabled={!state.variants.length} onClick={() => change([...lines, { variantId: '', quantity: 1 }])}><Icon name="plus" />เพิ่มรายการสินค้า</Button></div>
}
export function Bills(props: FeatureProps) {
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Bill | null>(null)
  const [customer, setCustomer] = useState('')
  const [lines, setLines] = useState<Item[]>([])
  const [exporting, setExporting] = useState('')
  const [draftDate, setDraftDate] = useState(() => new Date().toISOString())
  const draft = useMemo<Receipt>(() => ({ number: editing?.number ?? 'ร่าง', date: editing?.date ?? draftDate, customer, status: editing?.status ?? 'active', lines: lines.flatMap(line => {
    const variant = props.state.variants.find(v => v.id === line.variantId)
    const product = props.state.products.find(p => p.id === variant?.productId)
    if (!variant || !product || !Number.isSafeInteger(line.quantity) || line.quantity < 1 || !Number.isSafeInteger(line.price ?? variant.price) || (line.price ?? variant.price) < 0) return []
    return [{ variantId: variant.id, code: product.code, size: variant.size, color: variant.color, unit: product.unit, price: line.price ?? variant.price, quantity: line.quantity }]
  }) }), [editing, draftDate, customer, lines, props.state.variants, props.state.products])
  const total = lines.reduce((sum, line) => sum + line.quantity * (line.price ?? props.state.variants.find(v => v.id === line.variantId)?.price ?? 0), 0)
  const start = () => { setCreating(true); setEditing(null); setLines([]); setCustomer(''); setDraftDate(new Date().toISOString()) }
  async function exportBill(bill: Bill) {
    setExporting(bill.id)
    try { download(await billImage(bill, props.state.shop), `${bill.number}.png`); props.report('สร้างรูปบิลแล้ว ตรวจที่รายการดาวน์โหลด') } catch (error) { props.report(error instanceof Error ? error.message : 'Export ไม่สำเร็จ', true) } finally { setExporting('') }
  }
  if (creating || editing) return <Form noValidate className="stack bill-form" onSubmit={async e => { e.preventDefault(); if (await props.act(editing ? { id: crypto.randomUUID(), type: 'edit-bill', billId: editing.id, lines, expectedVersion: editing.version } : { id: crypto.randomUUID(), type: 'sale', customer, lines })) { setCreating(false); setEditing(null) } }}><div className="page-header"><BackButton onClick={() => void props.leave(() => { setCreating(false); setEditing(null) })} /><h1>{editing ? `แก้บิล ${editing.number}` : 'สร้างบิล'}</h1></div><div className="bill-form-layout"><section className="panel stack"><Field label="ชื่อลูกค้า (เว้นได้)" disabled={!!editing} value={customer} onChange={e => setCustomer(e.target.value)} />{!lines.length && <EmptyState title="ยังไม่มีรายการ" />}<ItemsEditor state={props.state} lines={lines} change={setLines} prices={!!editing} /></section><section className="panel stack bill-summary"><h2>ตรวจยอดและบันทึกบิล</h2><div className="total"><span>ยอดรวม</span><span>฿{money(total)}</span></div><p className="muted">{editing ? 'ปรับสต็อกตามส่วนต่างและเก็บประวัติ' : 'บันทึกบิลแล้วตัดสต็อกทันที'}</p><Button type="submit" disabled={!lines.length}>{editing ? 'บันทึกแก้ไข' : 'บันทึกการขาย'}</Button></section><section className="panel stack bill-paper"><h2>ตัวอย่างบิลเงินสด</h2><CashReceipt bill={draft} shop={props.state.shop} /></section></div></Form>
  return <div className="stack"><h1>บิลเงินสด</h1><Button disabled={!props.state.variants.length} onClick={start}><Icon name="plus" />สร้างบิล</Button>{!props.state.bills.length && <EmptyState title="ยังไม่มีบิล"><p className="muted">{props.state.variants.length ? 'สร้างบิลเมื่อขายสินค้า ทุกบิลตัดสต็อกทันที' : 'เพิ่มสินค้าที่หน้าสินค้าก่อนสร้างบิล'}</p></EmptyState>}<BillArchive bills={props.state.bills} renderBill={bill => <article key={bill.id} className="stack"><div className="row justify-between"><h2>{bill.number}</h2><span className={bill.status === 'cancelled' ? 'danger-text' : 'badge'}>{bill.status === 'cancelled' ? 'ยกเลิกแล้ว' : 'ขายแล้ว'}</span></div><CashReceipt bill={bill} shop={props.state.shop} /><div className="row"><Button variant="secondary" disabled={!!exporting} onClick={() => exportBill(bill)}>{exporting === bill.id ? 'กำลังสร้างรูป…' : 'Export รูปบิล'}</Button>{bill.status === 'active' && <><Button variant="secondary" onClick={() => { setEditing(bill); setCustomer(bill.customer); setLines(bill.lines.map(l => ({ variantId: l.variantId, quantity: l.quantity, price: l.price }))) }}>แก้บิล</Button><Button variant="danger" onClick={async () => { if (await props.ask('ยกเลิกบิลที่กรอกผิดและคืนสต็อก? หากลูกค้านำของมาคืนให้ใช้หน้า คืน/เปลี่ยน', 'ยกเลิกบิล')) void props.act({ id: crypto.randomUUID(), type: 'cancel-bill', billId: bill.id, expectedVersion: bill.version }) }}>ยกเลิกบิล</Button></>}</div>{bill.history.length > 0 && <details><summary>ประวัติการแก้ไข</summary>{bill.history.map((h, i) => <p className="history" key={i}>{h}</p>)}</details>}</article>} /></div>
}
export function Reservations(props: FeatureProps) {
  const [creating, setCreating] = useState(false)
  const [customer, setCustomer] = useState('')
  const [lines, setLines] = useState<Item[]>([])
  if (creating) return <Form noValidate className="stack" onSubmit={async e => { e.preventDefault(); if (await props.act({ id: crypto.randomUUID(), type: 'reserve', customer, lines })) { setCreating(false); setCustomer(''); setLines([]) } }}><div className="page-header"><BackButton onClick={() => void props.leave(() => setCreating(false))} /><h1>จองสินค้า</h1></div><Field label="ชื่อลูกค้า" required value={customer} onChange={e => setCustomer(e.target.value)} /><ItemsEditor state={props.state} lines={lines} change={setLines} /><p className="muted">จองแล้วลดจำนวนที่ยังขายได้ ลูกค้าต้องซื้อครบรายการ เจ้าของร้านยกเลิกเอง</p><Button type="submit" disabled={!lines.length}>บันทึกจอง</Button></Form>
  return <div className="stack"><h1>รายการจอง</h1><Button disabled={!props.state.variants.length} onClick={() => setCreating(true)}><Icon name="plus" />จองสินค้า</Button>{!props.state.reservations.length && <EmptyState title="ยังไม่มีรายการจอง"><p className="muted">กรอกรายการจาก LINE เองเมื่อมีลูกค้าสนใจ</p></EmptyState>}{props.state.reservations.map(r => <article className="section stack" key={r.id}><div className="row justify-between"><h2>{r.customer}</h2><span className="badge">{r.status === 'active' ? 'รอซื้อ' : r.status === 'sold' ? 'ซื้อครบแล้ว' : 'ยกเลิกแล้ว'}</span></div>{r.lines.map((l, i) => <p key={i}>{description(props.state, l.variantId)} · {l.quantity}</p>)}{r.status === 'active' && <div className="row"><Button onClick={async () => { if (await props.ask('สร้างบิลขายครบทั้งหมดจากรายการจองนี้?', 'สร้างบิลจากจอง')) void props.act({ id: crypto.randomUUID(), type: 'convert', reservationId: r.id }) }}>สร้างบิลจากจอง</Button><Button variant="danger" onClick={async () => { if (await props.ask('ยกเลิกการจองและปล่อยสินค้า?', 'ยกเลิกจอง')) void props.act({ id: crypto.randomUUID(), type: 'cancel-reservation', reservationId: r.id }) }}>ยกเลิกจอง</Button></div>}</article>)}</div>
}
export function Returns(props: FeatureProps) {
  const [billId, setBillId] = useState('')
  const [lines, setLines] = useState<Item[]>([])
  const [sellable, setSellable] = useState(true)
  const [exchange, setExchange] = useState(false)
  const [replacements, setReplacements] = useState<Item[]>([])
  async function changeReference(id: string) {
    if (id === billId) return
    if (lines.length && !await props.ask(id ? 'ใช้รายการและจำนวนจากบิลใหม่แทนรายการรับคืนที่กรอกไว้? กรุณาตรวจจำนวนที่รับคืนอีกครั้ง' : 'ล้างรายการรับคืนที่กรอกไว้และเปลี่ยนเป็นไม่มีบิลเดิม?', id ? 'ใช้รายการจากบิล' : 'ล้างรายการรับคืน')) return
    setBillId(id)
    setLines(id ? props.state.bills.find(bill => bill.id === id)?.lines.map(line => ({ variantId: line.variantId, quantity: line.quantity })) ?? [] : [])
  }
  const returned: ReturnedItem[] = lines.map(l => ({ variantId: l.variantId, quantity: l.quantity, sellable }))
  const validQuantity = (quantity: number) => Number.isSafeInteger(quantity) && quantity > 0 ? quantity : 0
  const affected = [...new Set([...lines, ...(exchange ? replacements : [])].map(l => l.variantId))].filter(id => props.state.variants.some(v => v.id === id))
  return <div className="stack"><h1>คืน / เปลี่ยนสินค้า</h1>{!props.state.variants.length ? <EmptyState title="ยังไม่มีสินค้าให้รับคืน / เปลี่ยน"><p>เพิ่มสินค้าที่หน้าสินค้าก่อน</p></EmptyState> : <Form noValidate className="stack return-form" onSubmit={async e => { e.preventDefault(); if (await props.act(exchange ? { id: crypto.randomUUID(), type: 'exchange', billId, lines: returned, replacements } : { id: crypto.randomUUID(), type: 'return', billId, lines: returned })) { setLines([]); setReplacements([]) } }}><label className="field">การดำเนินการ<select value={exchange ? 'exchange' : 'return'} onChange={e => setExchange(e.target.value === 'exchange')}><option value="return">รับคืน</option><option value="exchange">เปลี่ยนเป็นสินค้าใหม่</option></select></label><label className="field">อ้างอิงบิลเดิม<select value={billId} onChange={e => { const id = e.target.value; e.currentTarget.value = billId; void changeReference(id) }}><option value="">ไม่มีบิลเดิม</option>{props.state.bills.filter(b => b.status === 'active').map(b => <option key={b.id} value={b.id}>{b.number} {b.customer}</option>)}</select></label>{!billId && <p className="muted">เจ้าของร้านตรวจรายการเอง ระบบไม่ทราบจำนวนที่เคยซื้อ</p>}<section className="panel stack" aria-label="รายการรับคืน"><h2>รับคืนเข้าร้าน</h2><ItemsEditor state={props.state} lines={lines} change={setLines} kind="incoming" /><label className="field">สภาพของคืน — ใช้กับทุกรายการที่รับคืน<select value={sellable ? 'yes' : 'no'} onChange={e => setSellable(e.target.value === 'yes')}><option value="yes">คืนเข้าสต็อกพร้อมขาย</option><option value="no">รับคืนแต่ขายต่อไม่ได้</option></select></label></section>{exchange && <section className="panel stack" aria-label="รายการส่งออก"><h2>ส่งสินค้าใหม่ให้ลูกค้า</h2><ItemsEditor state={props.state} lines={replacements} change={setReplacements} kind="outgoing" /><p className="muted">สร้างบิลสินค้าใหม่และตัดสต็อกทันที เจ้าของร้านจัดการเงินส่วนต่างเอง</p></section>}{affected.length > 0 && <section className="stock-effects stack" aria-label="สรุปผลต่อสต็อก"><h2>ตรวจยอดก่อนบันทึก</h2>{affected.map(id => {
    const variant = props.state.variants.find(v => v.id === id)!
    const product = props.state.products.find(p => p.id === variant.productId)!
    const incoming = sellable ? lines.filter(l => l.variantId === id).reduce((sum, l) => sum + validQuantity(l.quantity), 0) : 0
    const outgoing = exchange ? replacements.filter(l => l.variantId === id).reduce((sum, l) => sum + validQuantity(l.quantity), 0) : 0
    const after = variant.stock + incoming - outgoing
    const projectedAvailable = availability(props.state, id) + incoming - outgoing
    const reserved = variant.stock - availability(props.state, id)
    return <div key={id}><p><strong>{product.code} / {variant.size} / {variant.color}</strong></p><p>รับคืนพร้อมขาย +{incoming} · ส่งสินค้าใหม่ −{outgoing} {product.unit}</p><p>คงเหลือ {variant.stock} → {after} {product.unit}</p><p className="muted">จองอยู่ {reserved} {product.unit} · ขายได้หลังบันทึก {Math.max(0, projectedAvailable)} {product.unit}</p>{projectedAvailable < 0 && <p className="danger-text">ของไม่พอ ขาด {-projectedAvailable} {product.unit}</p>}</div>
  })}<p className="muted">ยอดนี้เป็นตัวอย่างเมื่อบันทึกสำเร็จ ระบบตรวจจำนวนอีกครั้งก่อนบันทึก</p></section>}<Button type="submit" disabled={!lines.length || (exchange && !replacements.length)}>{exchange ? 'บันทึกเปลี่ยนสินค้า' : 'บันทึกรับคืน'}</Button></Form>}<h2>ประวัติคืน / เปลี่ยน</h2>{props.state.returns.map(r => <article key={r.id} className="section"><p>{new Date(r.date).toLocaleString('th-TH')} · {r.billId ? props.state.bills.find(b => b.id === r.billId)?.number : 'ไม่มีบิลเดิม'}</p>{r.lines.map((l, i) => <p className="muted" key={i}>{description(props.state, l.variantId)} · {l.quantity} · {l.sellable ? 'พร้อมขาย' : 'ขายต่อไม่ได้'}</p>)}{r.replacementBillId && <p>บิลสินค้าใหม่ {props.state.bills.find(b => b.id === r.replacementBillId)?.number}</p>}</article>)}</div>
}
