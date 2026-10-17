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
export type Receipt = Pick<Bill, 'number' | 'date' | 'customer' | 'lines' | 'status'>

// The screen and PNG both use this renderer; it never writes stock or bill data.
export async function billImage(bill: Receipt, shop: State['shop']): Promise<Blob> {
  const theme = getComputedStyle(document.documentElement)
  const token = (name: string, fallback: string) => theme.getPropertyValue(name).trim() || fallback
  const ink = token('--receipt-ink', '#193b5a')
  const paper = token('--receipt-paper', '#ffffff')
  const accent = token('--receipt-selected', '#eaf0f5')
  const danger = token('--receipt-danger', '#b42318')
  const family = token('--receipt-font', '"Plus Jakarta Sans", "IBM Plex Sans Thai Looped", "Leelawadee UI", Tahoma, sans-serif')
  await Promise.all([document.fonts.load(`28px ${family}`, 'บิลเงินสด CASH SALE'), document.fonts.load(`700 32px ${family}`, 'บิลเงินสด CASH SALE')])
  const canvas = document.createElement('canvas'); canvas.width = 900
  const context = canvas.getContext('2d')!
  context.font = `28px ${family}`
  const columns = [40, 168, 564, 704, 860]
  context.font = `700 28px ${family}`
  const shopRows = wrapped(context, shop.name || 'ชื่อร้าน ____________________', 470)
  context.font = `28px ${family}`
  const phoneRows = shop.phone ? wrapped(context, `โทร. ${shop.phone}`, 470) : []
  const customerRows = wrapped(context, `นาม / Customer: ${bill.customer || '____________________'}`, 570)
  const headerHeight = Math.max(128, (shopRows.length + phoneRows.length) * 40 + 32)
  const customerHeight = Math.max(80, customerRows.length * 40 + 16)
  const tableTop = 40 + headerHeight + 64 + customerHeight + 56
  const entries = bill.lines.map(line => {
    const description = wrapped(context, `${line.code} / ไซซ์ ${line.size} / ${line.color}`, 372)
    const quantity = wrapped(context, `${line.quantity} ${line.unit}`, 104)
    return { line, description, quantity, height: Math.max(52, Math.max(description.length, quantity.length) * 40 + 16) }
  })
  const blankRows = Math.max(0, 12 - entries.length)
  const tableHeight = 76 + entries.reduce((sum, entry) => sum + entry.height, 0) + blankRows * 52
  const height = tableTop + tableHeight + 200
  if (height > 28000) throw new Error('บิลยาวเกินขนาดรูปที่รองรับ กรุณาแบ่งรายการเป็นหลายบิล')
  canvas.height = height
  context.fillStyle = paper; context.fillRect(0, 0, 900, height)
  context.textBaseline = 'top'; context.strokeStyle = ink; context.lineWidth = 1.5
  const text = (value: string, x: number, y: number, size = 28, bold = false, color = ink) => {
    context.fillStyle = color; context.font = `${bold ? '700 ' : ''}${size}px ${family}`; context.fillText(value, x, y)
  }
  const number = (value: string, right: number, y: number, width: number, bold = false) => {
    let size = 28
    context.font = `${bold ? '700 ' : ''}${size}px ${family}`
    while (context.measureText(value).width > width && size > 16) { size--; context.font = `${bold ? '700 ' : ''}${size}px ${family}` }
    context.fillStyle = ink; context.textAlign = 'right'; context.fillText(value, right, y, width); context.textAlign = 'left'
  }
  const rule = (x1: number, y1: number, x2: number, y2: number) => { context.beginPath(); context.moveTo(x1, y1); context.lineTo(x2, y2); context.stroke() }
  context.strokeRect(40, 40, 820, headerHeight)
  rule(160, 40, 160, 40 + headerHeight); rule(680, 40, 680, 40 + headerHeight)
  text('เล่มที่', 52, 52, 24); text('Book No.', 52, 88, 20); text('—', 88, 124)
  let y = 52
  shopRows.forEach(row => { text(row, 180, y, 28, true); y += 40 })
  phoneRows.forEach(row => { text(row, 180, y, 26); y += 40 })
  text('เลขที่ / Bill No.', 696, 52, 22)
  number(bill.number, 844, 100, 148, true)
  y = 40 + headerHeight
  context.fillStyle = ink; context.fillRect(40, y, 820, 64)
  text('CASH SALE', 56, y + 16, 26, true, paper)
  text('บิลเงินสด', 380, y + 10, 34, true, '#ffffff')
  y += 64
  customerRows.forEach((row, i) => text(row, 52, y + 12 + i * 40))
  text('วันที่ / Date', 660, y + 12, 22)
  text(new Date(bill.date).toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' }), 660, y + 42, 24)
  y += customerHeight
  text('ที่อยู่ / Address:', 52, y + 12, 24)
  rule(240, y + 44, 848, y + 44)
  y = tableTop
  context.fillStyle = accent; context.fillRect(40, y, 820, 76)
  for (const [i, label, english] of [[0, 'จำนวน', 'Quantity'], [1, 'รายการ', 'Description'], [2, 'หน่วยละ', 'Unit price'], [3, 'จำนวนเงิน', 'Amount']] as const) {
    text(label, columns[i] + 12, y + 8, 26, true)
    text(english, columns[i] + 12, y + 44, 20)
  }
  context.strokeRect(40, tableTop, 820, tableHeight)
  columns.slice(1, -1).forEach(x => rule(x, tableTop, x, tableTop + tableHeight))
  y += 76; rule(40, y, 860, y)
  entries.forEach(entry => {
    entry.quantity.forEach((row, i) => text(row, 52, y + 8 + i * 40))
    entry.description.forEach((row, i) => text(row, 180, y + 8 + i * 40))
    number(money(entry.line.price), 692, y + 8, 116)
    number(money(entry.line.quantity * entry.line.price), 848, y + 8, 132)
    y += entry.height; rule(40, y, 860, y)
  })
  for (let i = 0; i < blankRows; i++) { y += 52; rule(40, y, 860, y) }
  context.fillStyle = accent; context.fillRect(40, y, 820, 68); context.strokeRect(40, y, 820, 68)
  rule(564, y, 564, y + 68); rule(704, y, 704, y + 68)
  text('บาท / Baht', 52, y + 20, 24)
  text('รวมเงิน', 580, y + 16, 28, true)
  number(money(bill.lines.reduce((sum, line) => sum + line.quantity * line.price, 0)), 848, y + 20, 132, true)
  text('ผู้รับเงิน / Collector __________________________', 52, y + 104, 26)
  if (bill.status === 'cancelled') text('บิลนี้ถูกยกเลิก', 52, y + 148, 28, true, danger)
  // Canvas.toBlob's idle encoder can stall tall receipts; encode this bounded canvas directly.
  const encoded = canvas.toDataURL('image/png').split(',')[1]
  if (!encoded) throw new Error('สร้างรูปบิลไม่ได้')
  return new Blob([Uint8Array.from(atob(encoded), character => character.charCodeAt(0))], { type: 'image/png' })
}
