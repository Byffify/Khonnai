import { useI18n } from './languageContext'
import { Brand } from './Brand'
import { focusedForm, reportFormFailure } from './formFeedback'
import { useEffect, useRef, useState } from 'react'
import { emptyState } from './domain/inventory'
import type { Command, State } from './domain/inventory'
import { commit, load, parseBackup, STORAGE_KEY } from './data/storage'
import { Notice } from './ui'
import { Catalog } from './features/Catalog'
import { Bills, Reservations, Returns } from './features/Transactions'
import { Settings } from './features/Settings'
import { Icon } from './Icon'
import type { IconName } from './Icon'
import { ConfirmDialog } from './ConfirmDialog'
import type { Confirmation, ConfirmOptions } from './ConfirmDialog'
import { CloudFailure, type CloudInventory } from './data/cloud'
import { backupDue, daysSince, readBackup, recordBackup } from './data/backupReminder'

type Page = 'catalog' | 'bills' | 'reservations' | 'returns' | 'settings'
const pages: { id: Page; label: string; icon: IconName; accessible?: string }[] = [
  { id: 'catalog', label: 'สินค้า', icon: 'product' },
  { id: 'bills', label: 'บิล', icon: 'bill' },
  { id: 'reservations', label: 'จอง', icon: 'reservation' },
  { id: 'returns', label: 'คืน/เปลี่ยน', icon: 'return' },
  { id: 'settings', label: 'ตั้งค่า', icon: 'settings' },
]
const hasUnsavedStock = () => [...document.querySelectorAll<HTMLInputElement>('input[data-stock-draft]')].some(input => input.value !== '')
function initial() {
  try { return { state: load(localStorage), error: '' } }
  catch (error) { return { state: emptyState(), error: error instanceof Error ? error.message : 'อ่านข้อมูลไม่ได้' } }
}
export type CloudAppPort = { client: CloudInventory; state: State; sessionEnded: () => void; signOut: () => void }
export default function App({ cloud }: { cloud?: CloudAppPort } = {}) {
  const { t, language } = useI18n()

  const [boot] = useState(() => cloud ? { state: cloud.state, error: '' } : initial())
  const [state, setState] = useState(boot.state)
  const current = useRef(state)
  const saving = useRef(false)
  const dirty = useRef(false)
  const [busy, setBusy] = useState(false)
  const [unconfirmed, setUnconfirmed] = useState(false)
  const [recovered, setRecovered] = useState(0)
  const [blocked, setBlocked] = useState(!!boot.error)
  const [notice, setNotice] = useState({ message: boot.error ? 'ข้อมูลที่บันทึกไว้เปิดไม่ได้ กรุณากู้จากไฟล์สำรอง ระบบยังไม่ได้ลบหรือเขียนทับข้อมูลเดิม' : '', error: !!boot.error, sequence: 0 })
  const [page, setPage] = useState<Page>('catalog')
  const [backup, setBackup] = useState(() => cloud ? null : readBackup())
  const [backupLater, setBackupLater] = useState(false)
  const [settingsStart, setSettingsStart] = useState<'backup' | null>(null)
  // A sale or reservation started from a product card opens its form with that size and colour already on the first line.
  const [intent, setIntent] = useState<{ kind: 'sale' | 'reserve'; variantId: string } | null>(null)
  const startTransaction = (kind: 'sale' | 'reserve', variantId: string) => void leave(() => { setIntent({ kind, variantId }); setSettingsStart(null); setPage(kind === 'sale' ? 'bills' : 'reservations'); window.scrollTo({ top: 0 }) })
  const [question, setQuestion] = useState<Confirmation | null>(null)
  const pendingQuestion = useRef(false)
  const ask = (message: string, action: string, options: ConfirmOptions = {}): Promise<boolean> => {
    if (pendingQuestion.current) return Promise.resolve(false)
    pendingQuestion.current = true
    return new Promise(resolve => setQuestion({ message, action, ...options, finish: answer => { pendingQuestion.current = false; setQuestion(null); resolve(answer) } }))
  }
  const report = (message: string, error = false, form = focusedForm()) => {
    if (error && reportFormFailure(form, message)) { setNotice(previous => ({ message: '', error: false, sequence: previous.sequence })); return }
    setNotice(previous => ({ message, error, sequence: previous.sequence + 1 }))
  }
  const leave = async (next: () => void) => {
    if ((dirty.current || hasUnsavedStock()) && !await ask('มีข้อมูลที่ยังไม่ได้บันทึก ต้องการออกจากหน้านี้และทิ้งข้อมูลที่กรอกหรือไม่?', 'ทิ้งข้อมูลที่ยังไม่บันทึก', { danger: true, cancel: 'แก้ต่อ' })) return
    dirty.current = false; next(); report('')
  }
  const update = (next: State) => { current.current = next; setState(next) }
  useEffect(() => {
    const changed = (event: StorageEvent) => {
      if (cloud) return
      if (event.key !== STORAGE_KEY && event.key !== null) return
      try { const latest = load(localStorage); current.current = latest; setState(latest); setNotice(previous => ({ message: 'โหลดข้อมูลล่าสุดจากอีกแท็บแล้ว', error: false, sequence: previous.sequence + 1 })) }
      catch (error) { setBlocked(true); setNotice(previous => ({ message: String(error), error: true, sequence: previous.sequence + 1 })) }
    }
    window.addEventListener('storage', changed)
    const unload = (event: BeforeUnloadEvent) => { if (dirty.current || hasUnsavedStock() || cloud?.client.uncertain) { event.preventDefault(); event.returnValue = '' } }
    window.addEventListener('beforeunload', unload)
    return () => { window.removeEventListener('storage', changed); window.removeEventListener('beforeunload', unload) }
  }, [cloud])
  useEffect(() => {
    if (!cloud) return
    let active = true
    const refresh = async () => {
      if (saving.current) return
      try {
        if (cloud.client.uncertain) { await cloud.client.checkSession(); return }
        const next = await cloud.client.load()
        if (active && !saving.current && !cloud.client.uncertain && next.revision >= current.current.revision) update(next)
      } catch (error) { if (active && error instanceof CloudFailure && error.kind === 'session') cloud.sessionEnded() }
    }
    window.addEventListener('focus', refresh)
    const interval = window.setInterval(() => { if (document.visibilityState === 'visible') void refresh() }, 30_000)
    return () => { active = false; window.removeEventListener('focus', refresh); window.clearInterval(interval) }
  }, [cloud])
  async function act(command: Command): Promise<State | false> {
    const form = focusedForm()
    if (blocked) { report('ข้อมูลเดิมอ่านไม่ได้ กรุณานำเข้าไฟล์สำรองก่อน ระบบจะไม่เขียนทับข้อมูลเดิม', true); return false }
    if (saving.current) return false
    if (cloud?.client.uncertain) return false
    saving.current = true; setBusy(true)
    try {
      const save = () => commit(localStorage, current.current, command)
      const next = cloud ? await cloud.client.commit(current.current, command) : navigator.locks ? await navigator.locks.request(STORAGE_KEY, save) : save()
      update(next); dirty.current = false; report('บันทึกแล้ว'); return next
    } catch (error) {
      if (cloud && error instanceof CloudFailure) {
        if (error.kind === 'session') { cloud.sessionEnded(); return false }
        if (error.kind === 'conflict') {
          try { update(await cloud.client.load()) } catch (refreshError) { if (refreshError instanceof CloudFailure && refreshError.kind === 'session') cloud.sessionEnded() }
          report(language === 'th' ? 'ข้อมูลร้านเปลี่ยนแล้ว โหลดข้อมูลล่าสุดให้แล้ว กรุณาตรวจรายการ หากกำลังแก้ข้อมูลร้านหรือสินค้า ให้กลับไปเปิดฟอร์มใหม่' : 'Shop data changed. Check the latest quantities. Reopen the form when editing a shop or product.', true, form)
          return false
        }
        setUnconfirmed(cloud.client.uncertain)
        if (error.kind === 'rejected' && error.message !== 'SAVE_FAILED') { report(t(error.message), true, form); return false }
        report(language === 'th' ? cloud.client.uncertain ? 'ยังยืนยันการบันทึกไม่ได้ กรุณากดตรวจสอบรายการเดิมก่อนทำรายการต่อ' : 'บันทึกไม่สำเร็จ กรุณาตรวจข้อมูลแล้วลองอีกครั้ง' : cloud.client.uncertain ? 'Save not confirmed. Check the pending entry before continuing.' : 'Unable to save. Check the entry and try again.', true, form)
        return false
      }
      report(error instanceof Error ? error.message : 'บันทึกไม่สำเร็จ', true, form)
      return false
    } finally { saving.current = false; setBusy(false) }
  }
  async function restore(file: File) {
    if (cloud) return
    try {
      if (file.size > 4_500_000) throw new Error('ไฟล์สำรองใหญ่เกินขนาดที่รองรับ')
      const next = parseBackup(await file.text())
      if (!await ask('นำเข้าและแทนที่ข้อมูลปัจจุบัน? ตรวจว่าคุณสำรองข้อมูลเดิมแล้ว', 'นำเข้าข้อมูล', { danger: true, cancel: 'ไม่นำเข้า' })) return
      const replace = () => { next.revision = load(localStorage).revision + 1; localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) }
      if (blocked) { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) }
      else if (navigator.locks) await navigator.locks.request(STORAGE_KEY, replace)
      else replace()
      update(next); setBlocked(false); report('นำเข้าข้อมูลสำเร็จ')
    } catch (error) { report(error instanceof Error ? error.message : 'นำเข้าไม่ได้', true) }
  }
  async function reconcile() {
    if (!cloud || saving.current) return
    saving.current = true; setBusy(true)
    try {
      update(await cloud.client.retry()); dirty.current = false; setUnconfirmed(false); setPage('catalog'); setRecovered(value => value + 1)
      report(language === 'th' ? 'ตรวจสอบแล้ว บันทึกรายการสำเร็จ' : 'Entry checked and saved.')
    } catch (error) {
      if (error instanceof CloudFailure && error.kind === 'session') cloud.sessionEnded()
      else if (error instanceof CloudFailure && error.kind === 'conflict') {
        try { update(await cloud.client.load()) } catch { /* Keep the visible draft when refresh is unavailable. */ }
        setUnconfirmed(false); report(language === 'th' ? 'ข้อมูลร้านเปลี่ยนแล้ว กรุณาตรวจรายการก่อนบันทึกอีกครั้ง' : 'Shop data changed. Check the entry before saving again.', true)
      } else { setUnconfirmed(cloud.client.uncertain); report(language === 'th' ? 'ยังตรวจสอบไม่ได้ กรุณาลองอีกครั้งเมื่อเชื่อมต่อได้' : 'Unable to check yet. Try again when connected.', true) }
    } finally { saving.current = false; setBusy(false) }
  }
  const props = { state, act, report, ask, leave }
  const account = cloud?.client.user ? {
    email: cloud.client.user.email,
    sendPasswordReset: async () => {
      try { await cloud.client.sendPasswordReset() }
      catch (error) {
        if (error instanceof CloudFailure && error.kind === 'session') cloud.sessionEnded()
        throw error
      }
    },
  } : undefined
  return <div className="shell"><header className="topbar"><Brand /><span className="local-label">{cloud ? (language === 'th' ? 'ข้อมูลร้านในบัญชีของคุณ' : 'Your account’s shop data') : t("ข้อมูลบนเครื่องนี้")}</span></header>{notice.message && notice.error && <div className="mb-5"><Notice error focusError>{notice.message}</Notice></div>}{notice.message && !notice.error && <div className="toast" key={notice.sequence}><Notice>{notice.message}</Notice><button type="button" className="toast-close" aria-label={t("ปิดข้อความ")} onClick={() => report('')}><Icon name="close" /></button></div>}{blocked && <Notice error>{t("ข้อมูลเดิมอ่านไม่ได้และยังไม่ถูกลบ ใช้ไฟล์สำรองเพื่อกู้ข้อมูลร้าน")}</Notice>}{!cloud && !blocked && !backupLater && page === 'catalog' && backupDue(state, backup) && <aside className="backup-reminder" aria-label={t("เตือนสำรองข้อมูล")}><Icon name="backup" /><p>{backup ? t("สำรองข้อมูลล่าสุด {0} วันก่อน และมีรายการใหม่ ข้อมูลร้านอยู่บนเครื่องนี้เท่านั้น", daysSince(backup.date)) : t("ยังไม่เคยสำรองข้อมูล ข้อมูลร้านอยู่บนเครื่องนี้เท่านั้น ถ้าล้างเว็บหรือเปลี่ยนเครื่องข้อมูลจะหาย")}</p><div className="backup-reminder-actions"><button type="button" className="button primary" onClick={() => void leave(() => { setSettingsStart('backup'); setPage('settings'); window.scrollTo({ top: 0 }) })}>{t("สำรองตอนนี้")}</button><button type="button" className="button secondary" onClick={() => setBackupLater(true)}>{t("ไว้ทีหลัง")}</button></div></aside>}<main key={recovered} onClickCapture={e => { if (e.target instanceof Element && e.target.closest('[data-draft]')) dirty.current = true }} onChangeCapture={e => { const element = e.target; if (element instanceof Element && element.hasAttribute('data-transient')) return; if ((element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) && (element.form || element.hasAttribute('data-stock-draft'))) dirty.current = true }}><fieldset disabled={busy || unconfirmed} className="border-0 m-0 p-0 min-w-0">{blocked ? <Settings {...props} restore={restore} damaged /> : <>{page === 'catalog' && <Catalog {...props} startTransaction={startTransaction} />}{page === 'bills' && <Bills {...props} intent={intent?.kind === 'sale' ? intent.variantId : undefined} />}{page === 'reservations' && <Reservations {...props} intent={intent?.kind === 'reserve' ? intent.variantId : undefined} />}{page === 'returns' && <Returns {...props} />}{page === 'settings' && <Settings {...props} restore={restore} damaged={blocked} cloud={!!cloud} account={account} onSignOut={cloud ? () => void leave(cloud.signOut) : undefined} backup={backup} onBackup={() => setBackup(recordBackup(state.revision))} initialPage={settingsStart} />}</>}</fieldset>{busy && <p className="loading-status" role="status">{t("กำลังบันทึก…")}</p>}{unconfirmed && <section className="section stack" aria-label={language === 'th' ? 'ตรวจสอบการบันทึก' : 'Check pending save'}><p className="notice warning" role="status">{language === 'th' ? 'อย่าเพิ่งปิดหน้านี้ รายการอาจบันทึกแล้ว ระบบจะตรวจรายการเดิมเพื่อป้องกันบันทึกซ้ำ' : 'Keep this page open. The entry may already be saved. We will check the same entry to avoid duplicates.'}</p><button type="button" className="button" disabled={busy} onClick={() => void reconcile()}>{language === 'th' ? 'ตรวจสอบรายการเดิม' : 'Check pending entry'}</button></section>}</main><nav className="app-nav" aria-label={t("เมนูหลัก")}>{pages.map(({ id, label, icon, accessible }) => <button key={id} disabled={busy || unconfirmed || (blocked && id !== 'settings')} aria-label={t(accessible ?? label)} aria-current={(blocked ? 'settings' : page) === id ? 'page' : undefined} onClick={() => void leave(() => { setSettingsStart(null); setIntent(null); setPage(id); window.scrollTo({ top: 0 }) })}><Icon name={icon} /><span>{language === 'en' && id === 'reservations' ? 'Reserve' : id === 'returns' && language === 'en' ? 'Returns' : t(label)}</span></button>)}</nav><ConfirmDialog request={question} /></div>
}
