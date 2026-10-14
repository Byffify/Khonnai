import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { availability } from '../domain/inventory'
import type { Product, Variant } from '../domain/inventory'
import { Button, EmptyState, Field, Form } from '../ui'
import { money } from '../domain/format'
import type { FeatureProps } from './types'

const freshVariant = (productId: string): Variant => ({ id: crypto.randomUUID(), productId, size: '', color: '', contents: '', price: 0, stock: 0 })
export function Catalog(props: FeatureProps) {
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  if (creating || editor) return <ProductForm {...props} existing={editor} close={() => { setCreating(false); setEditor(null) }} />
  const products = props.state.products.filter(p => p.code.toLowerCase().includes(search.toLowerCase()))
  return <div className="stack"><div><h1>สินค้า</h1><p className="muted">รหัสสินค้า → ไซซ์ → สี / คละสี</p></div><Field label="ค้นหารหัสสินค้า" value={search} onChange={e => setSearch(e.target.value)} type="search" />{search && <Button variant="secondary" aria-label="ล้างการค้นหา" onClick={() => { setSearch(''); document.querySelector<HTMLInputElement>('input[type=search]')?.focus() }}>ล้างการค้นหา</Button>}<Button onClick={() => setCreating(true)}>เพิ่มสินค้า</Button>
    {!props.state.products.length ? <EmptyState title="ยังไม่มีสินค้า"><p className="muted">เพิ่มสินค้าจากบันทึกเดิม แล้วตรวจนับยอดจริง</p></EmptyState> : !products.length ? <EmptyState title="ไม่พบรหัสที่ค้นหา"><p>ลองเปลี่ยนคำค้นหา</p></EmptyState> : products.map(p => <ProductView key={p.id} {...props} product={p} edit={() => setEditor(p)} />)}
  </div>
}
function ProductView({ state, act, ask, product, edit }: FeatureProps & { product: Product; edit: () => void }) {
  const variants = state.variants.filter(v => v.productId === product.id)
  const sizes = [...new Set(variants.map(v => v.size))]
  const [size, setSize] = useState(sizes[0] ?? '')
  return <article className="product">{product.photo ? <img className="photo" src={product.photo} alt={`สินค้า ${product.code}`} /> : <div className="photo photo-empty">ยังไม่มีรูป</div>}<div className="product-body"><div className="row justify-between"><h2>{product.code}</h2><Button variant="secondary" onClick={edit}>แก้สินค้า</Button></div><p className="muted">หน่วย: {product.unit}</p><div className="row" aria-label={`เลือกไซซ์ ${product.code}`}>{sizes.map(s => <button className="chip" key={s} aria-pressed={s === size} onClick={() => setSize(s)}>{s}</button>)}</div>
    {variants.filter(v => v.size === size).map(v => <VariantView key={v.id} variant={v} product={product} state={state} act={act} ask={ask} />)}
  </div></article>
}
function VariantView({ variant: v, product, state, act, ask }: { variant: Variant; product: Product; state: FeatureProps['state']; act: FeatureProps['act']; ask: FeatureProps['ask'] }) {
  const available = availability(state, v.id)
  const [amount, setAmount] = useState('')
  return <section className="variant"><div className="row justify-between"><h3>{v.color}</h3><span>฿{money(v.price)} / {product.unit}</span></div>{v.contents && <p className="muted">ในแพ็ก: {v.contents}</p>}<p>ขายได้ <span className={`quantity ${available < 0 ? 'danger-text' : ''}`}>{Math.max(0, available)}</span> {product.unit}</p><p className="muted">คงเหลือ {v.stock} · จอง {v.stock - available}</p>{available < 0 && <p role="status" className="danger-text">ของไม่พอ ขาด {-available} {product.unit}</p>}
    <details><summary>รับเข้า / ปรับยอด</summary><div className="stack"><Field data-stock-draft label={`จำนวน ${product.code} ${v.size} ${v.color}`} type="number" min="0" step="1" inputMode="numeric" value={amount} onChange={e => setAmount(e.target.value)} /><div className="row"><Button disabled={amount === ''} onClick={async () => { if (await act({ id: crypto.randomUUID(), type: 'receive', variantId: v.id, quantity: Number(amount) })) setAmount('') }}>รับเข้า</Button><Button variant="secondary" disabled={amount === ''} onClick={async () => { if (await ask('เปลี่ยนยอดคงเหลือเป็นจำนวนที่ตรวจนับจริงนี้?', 'ตั้งยอดจริง') && await act({ id: crypto.randomUUID(), type: 'adjust', variantId: v.id, quantity: Number(amount) })) setAmount('') }}>ตั้งยอดจริง</Button></div></div></details>
  </section>
}
function ProductForm({ state, act, report, leave, existing, close }: FeatureProps & { existing: Product | null; close: () => void }) {
  const [product, setProduct] = useState<Product>(existing ?? { id: crypto.randomUUID(), code: '', unit: 'แพ็ก', photo: '' })
  const [variants, setVariants] = useState<Variant[]>(existing ? structuredClone(state.variants.filter(v => v.productId === existing.id)) : [freshVariant(product.id)])
  const [photoBusy, setPhotoBusy] = useState(false)
  const [sourceRevision] = useState(state.revision)
  const updateVariant = (id: string, patch: Partial<Variant>) => setVariants(rows => rows.map(v => v.id === id ? { ...v, ...patch } : v))
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setPhotoBusy(true)
    try {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10_000_000) throw new Error('ใช้รูป JPG, PNG หรือ WebP ไม่เกิน 10MB')
      const bitmap = await createImageBitmap(file)
      const scale = Math.min(1, 600 / Math.max(bitmap.width, bitmap.height))
      const canvas = document.createElement('canvas'); canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale)
      const context = canvas.getContext('2d')!
      context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close()
      const photo = canvas.toDataURL('image/jpeg', .75)
      if (photo.length > 350_000) throw new Error('รูปยังใหญ่เกินไป ลองใช้รูปที่รายละเอียดน้อยลง')
      setProduct(p => ({ ...p, photo }))
    } catch (error) { report(error instanceof Error ? error.message : 'อ่านรูปไม่สำเร็จ', true) } finally { setPhotoBusy(false) }
  }
  async function submit(event: FormEvent) { event.preventDefault(); if (await act({ id: crypto.randomUUID(), type: 'product', product, variants, expectedRevision: sourceRevision })) close() }
  return <Form className="stack" onSubmit={submit}><div className="row"><Button variant="secondary" onClick={() => void leave(close)}>กลับ</Button><h1>{existing ? 'แก้สินค้า' : 'เพิ่มสินค้า'}</h1></div><div className="panel stack">{product.photo && <img src={product.photo} alt="รูปที่เลือก" className="photo" style={{ maxWidth: 180 }} />}<label className="file-picker">เพิ่มรูปสินค้า<input className="file-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} /></label>{photoBusy && <p role="status">กำลังย่อรูป…</p>}</div><Field label="รหัสสินค้า" required value={product.code} onChange={e => setProduct(p => ({ ...p, code: e.target.value }))} /><Field label="หน่วยนับ" required value={product.unit} onChange={e => setProduct(p => ({ ...p, unit: e.target.value }))} />
    {variants.map((v, i) => <section className="panel stack" key={v.id}><div className="row justify-between"><h2>ตัวเลือกสินค้า {i + 1}</h2>{variants.length > 1 && !state.variants.some(x => x.id === v.id) && <Button data-draft variant="danger" aria-label={`ลบตัวเลือกสินค้า ${i + 1}`} onClick={() => setVariants(rows => rows.filter(row => row.id !== v.id))}>ลบตัวเลือกนี้</Button>}</div><div className="form-grid"><Field label="ไซซ์" required value={v.size} onChange={e => updateVariant(v.id, { size: e.target.value })} /><Field label="สี / คละสี" required value={v.color} onChange={e => updateVariant(v.id, { color: e.target.value })} /><Field label="ราคาต่อหน่วย (บาท)" type="number" min="0" step="0.01" required value={v.price / 100} onChange={e => updateVariant(v.id, { price: Math.round(Number(e.target.value) * 100) })} /><Field label={state.variants.some(x => x.id === v.id) ? 'ยอดคงเหลือ (ปรับที่หน้าสินค้า)' : 'ยอดเริ่มต้น'} disabled={state.variants.some(x => x.id === v.id)} type="number" min="0" step="1" required value={v.stock} onChange={e => updateVariant(v.id, { stock: Number(e.target.value) })} /></div><Field label="รายละเอียดสีภายในแพ็ก (ถ้ามี)" value={v.contents} onChange={e => updateVariant(v.id, { contents: e.target.value })} /><p className="muted">แพ็กคละมีไซซ์เดียว ขายทั้งแพ็ก</p></section>)}
    <Button data-draft variant="secondary" onClick={() => setVariants(rows => [...rows, freshVariant(product.id)])}>เพิ่มไซซ์ / สี</Button><Button type="submit" disabled={photoBusy}>บันทึกสินค้า</Button>
  </Form>
}
