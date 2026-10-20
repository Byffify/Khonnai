import { useI18n } from '../languageContext'
import { useEffect, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import type { Bill } from '../domain/inventory'
import { money } from '../domain/format'
import { Icon } from '../Icon'

const shopDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Bangkok' })


export function BillArchive({ bills, renderBill, focus }: { bills: Bill[]; renderBill: (bill: Bill) => ReactNode; focus?: { id: string; sequence: number } }) {
  const { t, locale } = useI18n()
  const dateLabel = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'Asia/Bangkok' })

  const [selectedId, setSelectedId] = useState<string | null>(focus?.id ?? null)
  // A just-saved bill opens itself so the owner can check and send it without hunting for its tab.
  const [seenFocus, setSeenFocus] = useState(focus)
  if (focus !== seenFocus) { setSeenFocus(focus); if (focus) setSelectedId(focus.id) }
  useEffect(() => {
    if (!focus) return
    requestAnimationFrame(() => document.getElementById(`bill-tab-${focus.id}`)?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }))
  }, [focus])
  const groups = new Map<string, Bill[]>()
  for (const bill of bills) {
    const day = shopDate.format(new Date(bill.date))
    const group = groups.get(day) ?? []
    group.push(bill)
    groups.set(day, group)
  }
  function navigate(event: KeyboardEvent<HTMLButtonElement>, dayBills: Bill[], index: number) {
    let next: number
    if (event.key === 'ArrowRight') next = (index + 1) % dayBills.length
    else if (event.key === 'ArrowLeft') next = (index + dayBills.length - 1) % dayBills.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = dayBills.length - 1
    else return
    event.preventDefault()
    setSelectedId(dayBills[next].id)
    const button = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role=tab]')[next]
    button?.focus()
    button?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }
  return <div className="bill-archive stack">{[...groups].sort(([a], [b]) => b.localeCompare(a)).map(([day, dayBills]) => {
    const label = dateLabel.format(new Date(`${day}T12:00:00+07:00`))
    const selected = dayBills.find(bill => bill.id === selectedId)
    const total = dayBills.filter(bill => bill.status === 'active').reduce((sum, bill) => sum + bill.lines.reduce((subtotal, line) => subtotal + line.quantity * line.price, 0), 0)
    const panelId = `bill-day-${day}`
    return <section className="bill-day stack" key={day} aria-label={t("บิลวันที่ {0}", label)}>
      <div className="bill-day-heading"><h2><time dateTime={day}>{label}</time></h2><p className="muted">{dayBills.length} {t(" บิล · ยอดบิลไม่ยกเลิก ฿")}{money(total)}</p></div>
      <div className="bill-tabs" role="tablist" aria-label={t("เลือกบิลวันที่ {0}", label)}>
        {dayBills.map((bill, index) => <button key={bill.id} id={`bill-tab-${bill.id}`} role="tab" aria-selected={selectedId === bill.id} aria-controls={panelId} tabIndex={selected ? (selectedId === bill.id ? 0 : -1) : index === 0 ? 0 : -1} onClick={() => setSelectedId(bill.id)} onKeyDown={event => navigate(event, dayBills, index)}>
          <span className="bill-tab-title"><Icon name="bill" /><strong>{bill.number}</strong></span><span>{bill.customer || t("ไม่ระบุชื่อลูกค้า")}</span>{bill.status === 'cancelled' && <span className="danger-text">{t("ยกเลิกแล้ว")}</span>}
        </button>)}
      </div>
      <div role="tabpanel" id={panelId} aria-labelledby={selected ? `bill-tab-${selected.id}` : undefined} hidden={!selected} tabIndex={0} className="bill-list">{selected && renderBill(selected)}</div>
    </section>
  })}</div>
}
