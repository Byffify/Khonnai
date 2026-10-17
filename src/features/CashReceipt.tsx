import { useI18n } from '../languageContext'
import { useEffect, useState } from 'react'
import { billImage } from './BillImage'
import type { Receipt } from './BillImage'
import type { State } from '../domain/inventory'
import { money } from '../domain/format'

export function CashReceipt({ bill, shop }: { bill: Receipt; shop: State['shop'] }) {
  const { t, locale } = useI18n()

  const [preview, setPreview] = useState<{ url: string; error: string; source: Receipt | null; shop: State['shop'] | null }>({ url: '', error: '', source: null, shop: null })
  useEffect(() => {
    let disposed = false
    let url = ''
    billImage(bill, shop).then(blob => {
      if (disposed) return
      url = URL.createObjectURL(blob)
      setPreview({ url, error: '', source: bill, shop })
    }).catch(error => { if (!disposed) setPreview({ url: '', error: error instanceof Error ? error.message : 'แสดงบิลไม่ได้', source: bill, shop }) })
    return () => { disposed = true; if (url) URL.revokeObjectURL(url) }
  }, [bill, shop])
  const current = preview.source === bill && preview.shop === shop
  return <figure className="cash-receipt">
    {current && preview.error ? <p role="alert">{t(preview.error)}</p> : current && preview.url ? <a href={preview.url} target="_blank" rel="noreferrer" aria-label={t("ดูบิล {0} ขนาดเต็ม", bill.number)}><img src={preview.url} alt={t("บิลเงินสด {0}", bill.number)} /></a> : <p className="receipt-loading" role="status">{t("กำลังแสดงบิล…")}</p>}
    <figcaption className="receipt-caption">{t("กดภาพเพื่อดูบิลขนาดเต็ม")}</figcaption>
    <div className="sr-only"><p>{shop.name || t("ไม่ได้ระบุชื่อร้าน")} {shop.phone}</p><p>{t("ลูกค้า: ")}{bill.customer || t("ไม่ระบุชื่อลูกค้า")}</p><p>{t("วันที่ ")}{new Date(bill.date).toLocaleString(locale, { timeZone: 'Asia/Bangkok' })}</p><p>{bill.status === 'cancelled' ? t("บิลนี้ถูกยกเลิก") : t("บิลเงินสด")}</p></div>
    <div className="sr-only"><table><caption>{t("รายการในบิล ")}{bill.number}</caption><thead><tr><th>{t("จำนวน")}</th><th>{t("รายการ")}</th><th>{t("หน่วยละ")}</th><th>{t("จำนวนเงิน")}</th></tr></thead><tbody>{bill.lines.map((line, index) => <tr key={index}><td>{line.quantity} {line.unit}</td><td>{line.code} / {line.size} / {line.color}</td><td>{money(line.price)}</td><td>{money(line.quantity * line.price)}</td></tr>)}</tbody><tfoot><tr><th colSpan={3}>{t("รวมเงิน")}</th><td>{money(bill.lines.reduce((sum, line) => sum + line.quantity * line.price, 0))}</td></tr></tfoot></table></div>
    <details className="receipt-readable"><summary>{t("อ่านรายการบิลแบบตัวใหญ่")}</summary><div className="stack"><p>{shop.name || t("ไม่ได้ระบุชื่อร้าน")} {shop.phone}</p><p>{t("ลูกค้า: ")}{bill.customer || t("ไม่ระบุชื่อลูกค้า")}</p><p>{t("วันที่ ")}{new Date(bill.date).toLocaleString(locale, { timeZone: 'Asia/Bangkok' })}</p>{bill.status === 'cancelled' && <p className="danger-text">{t("บิลนี้ถูกยกเลิก")}</p>}{bill.lines.map((line, index) => <div key={index}><p>{line.code} / {line.size} / {line.color}</p><p>{line.quantity} {line.unit} {t(" × ฿")}{money(line.price)} {t(" = ฿")}{money(line.quantity * line.price)}</p></div>)}<p><strong>{t("รวมเงิน ฿")}{money(bill.lines.reduce((sum, line) => sum + line.quantity * line.price, 0))}</strong></p></div></details>
  </figure>
}
