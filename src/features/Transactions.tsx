import { useI18n } from '../languageContext'
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
  const { t, language } = useI18n()

  const [query, setQuery] = useState('')
  const productLabel = kind === 'incoming' ? t("สินค้ารับคืน") : kind === 'outgoing' ? t("สินค้าใหม่") : language === 'en' ? t("รายการสินค้า") : 'สินค้า'
  const quantityLabel = kind === 'incoming' ? t("จำนวนรับคืน") : kind === 'outgoing' ? t("จำนวนส่งออก") : t("จำนวน")
  const matching = state.variants.filter(variant => state.products.find(product => product.id === variant.productId)?.code.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
  return <div className="stack item-editor">{lines.length > 0 && <div className="transaction-search row"><Field data-transient label={t("ค้นหารหัส{0}", productLabel)} type="search" value={query} onChange={event => setQuery(event.target.value)} />{query && <Button variant="secondary" aria-label={t("ล้างการค้นหา{0}", productLabel)} onClick={event => { setQuery('' ); event.currentTarget.parentElement?.querySelector<HTMLInputElement>('input[type=search]')?.focus() }}>{t("ล้างค้นหา")}</Button>}</div>}{query.trim() && <p className="muted" role="status">{t("พบ ")}{matching.length} {t(" ตัวเลือกไซซ์ / สี")}</p>}{lines.map((line, i) => {
    const variant = state.variants.find(v => v.id === line.variantId)
    const product = state.products.find(p => p.id === variant?.productId)
    return <div className="line-item" key={i}><label className="field"><span>{productLabel} {i + 1}</span><select required aria-label={`${productLabel} ${i + 1}`} value={line.variantId} onChange={e => { const selected = state.variants.find(v => v.id === e.target.value); change(lines.map((l, j) => j === i ? { variantId: selected?.id ?? '', quantity: l.quantity, ...(prices ? { price: selected?.price ?? 0 } : {}) } : l)) }}><option value="">{t("เลือกสินค้า")}</option>{state.variants.filter(v => matching.includes(v) || v.id === line.variantId).map(v => <option key={v.id} value={v.id}>{description(state, v.id)} {t(" · ขายได้ ")}{Math.max(0, availability(state, v.id))}</option>)}</select></label><Field label={`${quantityLabel} ${i + 1}`} hint={product ? t("หน่วย: {0}", product.unit) : undefined} type="number" min="1" step="1" inputMode="numeric" value={line.quantity} onChange={e => change(lines.map((l, j) => j === i ? { ...l, quantity: Number(e.target.value) } : l))} /><Button data-draft className="remove" variant="danger" aria-label={t("ลบ{0} {1}", productLabel, i + 1)} onClick={() => change(lines.filter((_, j) => j !== i))}>{t("ลบ")}</Button>{variant && product && <div className="selected-item" role="group" aria-label={t("รายละเอียด{0}ที่เลือก {1}", productLabel, i + 1)}><p><strong>{product.code}</strong> {t(" · ไซซ์ ")}{variant.size} · {variant.color}</p><p>{t("หน่วย: ")}{product.unit} {t(" · ราคา ฿")}{money(line.price ?? variant.price)} / {product.unit}</p><p>{t("ขายได้ ")}{Math.max(0, availability(state, variant.id))} {product.unit}</p>{variant.contents && <p className="muted">{t("ในแพ็ก: ")}{variant.contents}</p>}</div>}{prices && <Field label={t("ราคา {0} (บาท)", i + 1)} type="number" min="0" step="0.01" value={(line.price ?? variant?.price ?? 0) / 100} onChange={e => change(lines.map((l, j) => j === i ? { ...l, price: Math.round(Number(e.target.value) * 100) } : l))} />}</div>
  })}<Button data-draft variant="secondary" disabled={!state.variants.length} onClick={() => change([...lines, { variantId: '', quantity: 1 }])}><Icon name="plus" />{t("เพิ่มรายการสินค้า")}</Button></div>
}
export function Bills(props: FeatureProps) {
  const { t } = useI18n()

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
  if (creating || editing) return <Form noValidate className="stack bill-form" onSubmit={async e => { e.preventDefault(); if (await props.act(editing ? { id: crypto.randomUUID(), type: 'edit-bill', billId: editing.id, lines, expectedVersion: editing.version } : { id: crypto.randomUUID(), type: 'sale', customer, lines })) { setCreating(false); setEditing(null) } }}><div className="page-header"><BackButton onClick={() => void props.leave(() => { setCreating(false); setEditing(null) })} /><h1>{editing ? t("แก้บิล {0}", editing.number) : t("สร้างบิล")}</h1></div><div className="bill-form-layout"><section className="panel stack"><Field label={t("ชื่อลูกค้า (เว้นได้)")} disabled={!!editing} value={customer} onChange={e => setCustomer(e.target.value)} />{!lines.length && <EmptyState title={t("ยังไม่มีรายการ")} />}<ItemsEditor state={props.state} lines={lines} change={setLines} prices={!!editing} /></section><section className="panel stack bill-summary"><h2>{t("ตรวจยอดและบันทึกบิล")}</h2><div className="total"><span>{t("ยอดรวม")}</span><span>{t("฿")}{money(total)}</span></div><p className="muted">{editing ? t("ปรับสต็อกตามส่วนต่างและเก็บประวัติ") : t("บันทึกบิลแล้วตัดสต็อกทันที")}</p><Button type="submit" disabled={!lines.length}>{editing ? t("บันทึกแก้ไข") : t("บันทึกการขาย")}</Button></section><section className="panel stack bill-paper"><h2>{t("ตัวอย่างบิลเงินสด")}</h2><CashReceipt bill={draft} shop={props.state.shop} /></section></div></Form>
  return <div className="stack"><h1>{t("บิลเงินสด")}</h1><Button disabled={!props.state.variants.length} onClick={start}><Icon name="plus" />{t("สร้างบิล")}</Button>{!props.state.bills.length && <EmptyState title={t("ยังไม่มีบิล")}><p className="muted">{props.state.variants.length ? t("สร้างบิลเมื่อขายสินค้า ทุกบิลตัดสต็อกทันที") : t("เพิ่มสินค้าที่หน้าสินค้าก่อนสร้างบิล")}</p></EmptyState>}<BillArchive bills={props.state.bills} renderBill={bill => <article key={bill.id} className="stack"><div className="row justify-between"><h2>{bill.number}</h2><span className={bill.status === 'cancelled' ? 'danger-text' : 'badge'}>{bill.status === 'cancelled' ? t("ยกเลิกแล้ว") : t("ขายแล้ว")}</span></div><CashReceipt bill={bill} shop={props.state.shop} /><div className="row"><Button variant="secondary" disabled={!!exporting} onClick={() => exportBill(bill)}>{exporting === bill.id ? t("กำลังสร้างรูป…") : t("Export รูปบิล")}</Button>{bill.status === 'active' && <><Button variant="secondary" onClick={() => { setEditing(bill); setCustomer(bill.customer); setLines(bill.lines.map(l => ({ variantId: l.variantId, quantity: l.quantity, price: l.price }))) }}>{t("แก้บิล")}</Button><Button variant="danger" onClick={async () => { if (await props.ask('ยกเลิกบิลที่กรอกผิดและคืนสต็อก? หากลูกค้านำของมาคืนให้ใช้หน้า คืน/เปลี่ยน', 'ยกเลิกบิล')) void props.act({ id: crypto.randomUUID(), type: 'cancel-bill', billId: bill.id, expectedVersion: bill.version }) }}>{t("ยกเลิกบิล")}</Button></>}</div>{bill.history.length > 0 && <details><summary>{t("ประวัติการแก้ไข")}</summary>{bill.history.map((h, i) => <p className="history" key={i}>{t(h)}</p>)}</details>}</article>} /></div>
}
export function Reservations(props: FeatureProps) {
  const { t } = useI18n()

  const [creating, setCreating] = useState(false)
  const [customer, setCustomer] = useState('')
  const [lines, setLines] = useState<Item[]>([])
  if (creating) return <Form noValidate className="stack reservation-form" onSubmit={async e => { e.preventDefault(); if (await props.act({ id: crypto.randomUUID(), type: 'reserve', customer, lines })) { setCreating(false); setCustomer(''); setLines([]) } }}><div className="page-header"><BackButton onClick={() => void props.leave(() => setCreating(false))} /><h1>{t("จองสินค้า")}</h1></div><Field label={t("ชื่อลูกค้า")} required value={customer} onChange={e => setCustomer(e.target.value)} /><ItemsEditor state={props.state} lines={lines} change={setLines} /><p className="muted">{t("จองแล้วลดจำนวนที่ยังขายได้ ลูกค้าต้องซื้อครบรายการ เจ้าของร้านยกเลิกเอง")}</p><Button type="submit" disabled={!lines.length}>{t("บันทึกจอง")}</Button></Form>
  return <div className="stack"><h1>{t("รายการจอง")}</h1><Button disabled={!props.state.variants.length} onClick={() => setCreating(true)}><Icon name="plus" />{t("จองสินค้า")}</Button>{!props.state.reservations.length && <EmptyState title={t("ยังไม่มีรายการจอง")}><p className="muted">{t("กรอกรายการจาก LINE เองเมื่อมีลูกค้าสนใจ")}</p></EmptyState>}{props.state.reservations.map(r => <article className="section stack" key={r.id}><div className="row justify-between"><h2>{r.customer}</h2><span className="badge">{r.status === 'active' ? t("รอซื้อ") : r.status === 'sold' ? t("ซื้อครบแล้ว") : t("ยกเลิกแล้ว")}</span></div>{r.lines.map((l, i) => <p key={i}>{description(props.state, l.variantId)} · {l.quantity}</p>)}{r.status === 'active' && <div className="row"><Button onClick={async () => { if (await props.ask('สร้างบิลขายครบทั้งหมดจากรายการจองนี้?', 'สร้างบิลจากจอง')) void props.act({ id: crypto.randomUUID(), type: 'convert', reservationId: r.id }) }}>{t("สร้างบิลจากจอง")}</Button><Button variant="danger" onClick={async () => { if (await props.ask('ยกเลิกการจองและปล่อยสินค้า?', 'ยกเลิกจอง')) void props.act({ id: crypto.randomUUID(), type: 'cancel-reservation', reservationId: r.id }) }}>{t("ยกเลิกจอง")}</Button></div>}</article>)}</div>
}
export function Returns(props: FeatureProps) {
  const { t } = useI18n()

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
  return <div className="stack returns-page"><h1>{t("คืน / เปลี่ยนสินค้า")}</h1>{!props.state.variants.length ? <EmptyState title={t("ยังไม่มีสินค้าให้รับคืน / เปลี่ยน")}><p>{t("เพิ่มสินค้าที่หน้าสินค้าก่อน")}</p></EmptyState> : <Form noValidate className="stack return-form" onSubmit={async e => { e.preventDefault(); if (await props.act(exchange ? { id: crypto.randomUUID(), type: 'exchange', billId, lines: returned, replacements } : { id: crypto.randomUUID(), type: 'return', billId, lines: returned })) { setLines([]); setReplacements([]) } }}><label className="field">{t("การดำเนินการ")}<select value={exchange ? 'exchange' : 'return'} onChange={e => setExchange(e.target.value === 'exchange')}><option value="return">{t("รับคืน")}</option><option value="exchange">{t("เปลี่ยนเป็นสินค้าใหม่")}</option></select></label><label className="field">{t("อ้างอิงบิลเดิม")}<select value={billId} onChange={e => { const id = e.target.value; e.currentTarget.value = billId; void changeReference(id) }}><option value="">{t("ไม่มีบิลเดิม")}</option>{props.state.bills.filter(b => b.status === 'active').map(b => <option key={b.id} value={b.id}>{b.number} {b.customer}</option>)}</select></label>{!billId && <p className="muted">{t("เจ้าของร้านตรวจรายการเอง ระบบไม่ทราบจำนวนที่เคยซื้อ")}</p>}<section className="panel stack" aria-label={t("รายการรับคืน")}><h2>{t("รับคืนเข้าร้าน")}</h2><ItemsEditor state={props.state} lines={lines} change={setLines} kind="incoming" /><label className="field">{t("สภาพของคืน — ใช้กับทุกรายการที่รับคืน")}<select value={sellable ? 'yes' : 'no'} onChange={e => setSellable(e.target.value === 'yes')}><option value="yes">{t("คืนเข้าสต็อกพร้อมขาย")}</option><option value="no">{t("รับคืนแต่ขายต่อไม่ได้")}</option></select></label></section>{exchange && <section className="panel stack" aria-label={t("รายการส่งออก")}><h2>{t("ส่งสินค้าใหม่ให้ลูกค้า")}</h2><ItemsEditor state={props.state} lines={replacements} change={setReplacements} kind="outgoing" /><p className="muted">{t("สร้างบิลสินค้าใหม่และตัดสต็อกทันที เจ้าของร้านจัดการเงินส่วนต่างเอง")}</p></section>}{affected.length > 0 && <section className="stock-effects stack" aria-label={t("สรุปผลต่อสต็อก")}><h2>{t("ตรวจยอดก่อนบันทึก")}</h2>{affected.map(id => {
    const variant = props.state.variants.find(v => v.id === id)!
    const product = props.state.products.find(p => p.id === variant.productId)!
    const incoming = sellable ? lines.filter(l => l.variantId === id).reduce((sum, l) => sum + validQuantity(l.quantity), 0) : 0
    const outgoing = exchange ? replacements.filter(l => l.variantId === id).reduce((sum, l) => sum + validQuantity(l.quantity), 0) : 0
    const after = variant.stock + incoming - outgoing
    const projectedAvailable = availability(props.state, id) + incoming - outgoing
    const reserved = variant.stock - availability(props.state, id)
    return <div key={id}><p><strong>{product.code} / {variant.size} / {variant.color}</strong></p><p>{t("รับคืนพร้อมขาย +")}{incoming} {t(" · ส่งสินค้าใหม่ −")}{outgoing} {product.unit}</p><p>{t("คงเหลือ ")}{variant.stock} → {after} {product.unit}</p><p className="muted">{t("จองอยู่ ")}{reserved} {product.unit} {t(" · ขายได้หลังบันทึก ")}{Math.max(0, projectedAvailable)} {product.unit}</p>{projectedAvailable < 0 && <p className="danger-text">{t("ของไม่พอ ขาด ")}{-projectedAvailable} {product.unit}</p>}</div>
  })}<p className="muted">{t("ยอดนี้เป็นตัวอย่างเมื่อบันทึกสำเร็จ ระบบตรวจจำนวนอีกครั้งก่อนบันทึก")}</p></section>}<Button type="submit" disabled={!lines.length || (exchange && !replacements.length)}>{exchange ? t("บันทึกเปลี่ยนสินค้า") : t("บันทึกรับคืน")}</Button></Form>}<h2>{t("ประวัติคืน / เปลี่ยน")}</h2>{props.state.returns.map(r => <article key={r.id} className="section"><p>{new Date(r.date).toLocaleString('th-TH')} · {r.billId ? props.state.bills.find(b => b.id === r.billId)?.number : t("ไม่มีบิลเดิม")}</p>{r.lines.map((l, i) => <p className="muted" key={i}>{description(props.state, l.variantId)} · {l.quantity} · {l.sellable ? t("พร้อมขาย") : t("ขายต่อไม่ได้")}</p>)}{r.replacementBillId && <p>{t("บิลสินค้าใหม่ ")}{props.state.bills.find(b => b.id === r.replacementBillId)?.number}</p>}</article>)}</div>
}
