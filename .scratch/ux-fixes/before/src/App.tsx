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
import type { Confirmation } from './ConfirmDialog'

type Page = 'catalog' | 'bills' | 'reservations' | 'returns' | 'settings'
const pages: { id: Page; label: string; icon: IconName; accessible?: string }[] = [
  { id: 'catalog', label: 'สินค้า', icon: 'product' },
  { id: 'bills', label: 'บิล', icon: 'bill' },
  { id: 'reservations', label: 'จอง', icon: 'reservation' },
  { id: 'returns', label: 'คืน/เปลี่ยน', icon: 'return' },
  { id: 'settings', label: 'ข้อมูลร้าน', accessible: 'สำรอง / ข้อมูลร้าน', icon: 'settings' },
]
const hasUnsavedStock = () => [...document.querySelectorAll<HTMLInputElement>('input[data-stock-draft]')].some(input => input.value !== '')
function initial() {
  try { return { state: load(localStorage), error: '' } }
  catch (error) { return { state: emptyState(), error: error instanceof Error ? error.message : 'อ่านข้อมูลไม่ได้' } }
}
export default function App() {
  const [boot] = useState(initial)
  const [state, setState] = useState(boot.state)
  const current = useRef(state)
  const saving = useRef(false)
  const dirty = useRef(false)
  const [busy, setBusy] = useState(false)
  const [blocked, setBlocked] = useState(!!boot.error)
  const [notice, setNotice] = useState({ message: boot.error, error: !!boot.error })
  const [page, setPage] = useState<Page>('catalog')
  const [question, setQuestion] = useState<Confirmation | null>(null)
  const pendingQuestion = useRef(false)
  const ask = (message: string, action: string): Promise<boolean> => {
    if (pendingQuestion.current) return Promise.resolve(false)
    pendingQuestion.current = true
    return new Promise(resolve => setQuestion({ message, action, finish: answer => { pendingQuestion.current = false; setQuestion(null); resolve(answer) } }))
  }
  const report = (message: string, error = false) => setNotice({ message, error })
  const leave = async (next: () => void) => {
    if ((dirty.current || hasUnsavedStock()) && !await ask('มีข้อมูลที่ยังไม่ได้บันทึก ต้องการออกจากหน้านี้และทิ้งข้อมูลที่กรอกหรือไม่?', 'ทิ้งข้อมูลที่ยังไม่บันทึก')) return
    dirty.current = false; next(); report('')
  }
  const update = (next: State) => { current.current = next; setState(next) }
  useEffect(() => {
    const changed = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY && event.key !== null) return
      try { const latest = load(localStorage); current.current = latest; setState(latest); setNotice({ message: 'โหลดข้อมูลล่าสุดจากอีกแท็บแล้ว', error: false }) }
      catch (error) { setBlocked(true); setNotice({ message: String(error), error: true }) }
    }
    window.addEventListener('storage', changed)
    const unload = (event: BeforeUnloadEvent) => { if (dirty.current || hasUnsavedStock()) { event.preventDefault(); event.returnValue = '' } }
    window.addEventListener('beforeunload', unload)
    return () => { window.removeEventListener('storage', changed); window.removeEventListener('beforeunload', unload) }
  }, [])
  async function act(command: Command) {
    if (blocked) { report('ข้อมูลเดิมอ่านไม่ได้ กรุณานำเข้าไฟล์สำรองก่อน ระบบจะไม่เขียนทับข้อมูลเดิม', true); return false }
    if (saving.current) return false
    saving.current = true; setBusy(true)
    try {
      const save = () => commit(localStorage, current.current, command)
      const next = navigator.locks ? await navigator.locks.request(STORAGE_KEY, save) : save()
      update(next); dirty.current = false; report('บันทึกแล้ว'); return true
    } catch (error) {
      report(error instanceof Error ? error.message : 'บันทึกไม่สำเร็จ', true)
      return false
    } finally { saving.current = false; setBusy(false) }
  }
  async function restore(file: File) {
    try {
      if (file.size > 4_500_000) throw new Error('ไฟล์สำรองใหญ่เกินขนาดที่รองรับ')
      const next = parseBackup(await file.text())
      if (!await ask('นำเข้าและแทนที่ข้อมูลปัจจุบัน? ตรวจว่าคุณสำรองข้อมูลเดิมแล้ว', 'นำเข้าข้อมูล')) return
      const replace = () => { next.revision = load(localStorage).revision + 1; localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) }
      if (blocked) { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) }
      else if (navigator.locks) await navigator.locks.request(STORAGE_KEY, replace)
      else replace()
      update(next); setBlocked(false); report('นำเข้าข้อมูลสำเร็จ')
    } catch (error) { report(error instanceof Error ? error.message : 'นำเข้าไม่ได้', true) }
  }
  const props = { state, act, report, ask, leave }
  return <div className="shell"><header className="topbar"><span className="brand-mark"><Icon name="product" /></span><div><p className="brand">Micro-ERP</p><span className="local-label">ข้อมูลบนเครื่องนี้</span></div></header>{notice.message && <div className="mb-5"><Notice error={notice.error}>{notice.message}</Notice></div>}{blocked && <Notice error>ข้อมูลเดิมอ่านไม่ได้และยังไม่ถูกลบ เปิดสำรอง / ข้อมูลร้าน เพื่อนำเข้าไฟล์สำรอง</Notice>}<main onClickCapture={e => { if (e.target instanceof Element && e.target.closest('[data-draft]')) dirty.current = true }} onChangeCapture={e => { const element = e.target; if ((element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) && (element.form || element.hasAttribute('data-stock-draft'))) dirty.current = true }}><fieldset disabled={busy} className="border-0 m-0 p-0 min-w-0">{page === 'catalog' && <Catalog {...props} />}{page === 'bills' && <Bills {...props} />}{page === 'reservations' && <Reservations {...props} />}{page === 'returns' && <Returns {...props} />}{page === 'settings' && <Settings {...props} restore={restore} damaged={blocked} />}</fieldset>{busy && <p role="status">กำลังบันทึก…</p>}</main><nav className="app-nav" aria-label="เมนูหลัก"><div className="nav-brand"><span className="brand-mark"><Icon name="product" /></span><strong>Micro-ERP</strong></div>{pages.map(({ id, label, icon, accessible }) => <button key={id} disabled={busy} aria-label={accessible} aria-current={page === id ? 'page' : undefined} onClick={() => void leave(() => { setPage(id); window.scrollTo({ top: 0 }) })}><Icon name={icon} /><span>{label}</span></button>)}<p className="nav-local">ข้อมูลบนเครื่องนี้</p></nav><ConfirmDialog request={question} /></div>
}
