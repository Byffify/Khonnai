import type { Bill, State } from '../domain/inventory'
import { money } from '../domain/format'

export function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
function wrapped(context: CanvasRenderingContext2D, text: string, width: number) {
  const rows: string[] = []; let line = ''
  const segments = new Intl.Segmenter('th', { granularity: 'grapheme' }).segment(text)
  for (const { segment } of segments) {
    if (line && context.measureText(line + segment).width > width) { rows.push(line); line = segment } else line += segment
  }
  rows.push(line)
  return rows
}
export async function billImage(bill: Bill, shop: State['shop']): Promise<Blob> {
  await document.fonts.load('28px "IBM Plex Sans Thai Looped"')
  await document.fonts.load('700 30px "IBM Plex Sans Thai Looped"')
  await document.fonts.ready
  const canvas = document.createElement('canvas'); canvas.width = 900
  const context = canvas.getContext('2d')!
  context.font = '28px "IBM Plex Sans Thai Looped", sans-serif'
  const header = [shop.name || 'บิลเงินสด', ...(shop.phone ? [`โทร. ${shop.phone}`] : []), `เลขที่ ${bill.number}`, new Date(bill.date).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }), `ลูกค้า: ${bill.customer || '—'}`, ...(bill.status === 'cancelled' ? ['บิลนี้ถูกยกเลิก'] : [])]
  const headerRows = header.flatMap(text => wrapped(context, text, 804))
  const entries = bill.lines.map(line => ({ descriptions: wrapped(context, `${line.code} • ไซซ์ ${line.size} • ${line.color}`, 804), amount: `${line.quantity} ${line.unit} × ฿${money(line.price)} = ฿${money(line.quantity * line.price)}` }))
  const height = 180 + headerRows.length * 44 + entries.reduce((sum, entry) => sum + (entry.descriptions.length + 1) * 44 + 28, 0)
  if (height > 28000) throw new Error('บิลยาวเกินขนาดรูปที่รองรับ กรุณาแบ่งรายการเป็นหลายบิล')
  canvas.height = height
  context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, height)
  context.font = '28px "IBM Plex Sans Thai Looped", sans-serif'; context.fillStyle = '#191919'; context.textBaseline = 'top'
  let y = 40
  for (const text of headerRows) { context.fillText(text, 48, y); y += 44 }
  context.fillStyle = '#0968f6'; context.fillRect(48, y + 8, 804, 3); y += 40
  context.fillStyle = '#191919'
  for (const entry of entries) {
    for (const text of entry.descriptions) { context.fillText(text, 48, y); y += 44 }
    context.fillText(entry.amount, 48, y); y += 72
  }
  context.font = '700 30px "IBM Plex Sans Thai Looped", sans-serif'
  context.fillText(`ยอดรวม ฿${money(bill.lines.reduce((sum, line) => sum + line.quantity * line.price, 0))}`, 48, y + 8)
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('สร้างรูปบิลไม่ได้')), 'image/png'))
}
