import { LanguageSettings } from '../LanguageSettings'
import { useI18n } from '../languageContext'
import { useEffect, useRef, useState } from 'react'
import { Icon, type IconName } from '../Icon'
import { STORAGE_KEY } from '../data/storage'
import { Button, Field, Form } from '../ui'
import { download } from './BillImage'
import type { FeatureProps } from './types'

type SettingsPage = 'account' | 'shop' | 'language' | 'backup' | 'history'
type AccountSettings = { email: string; sendPasswordReset: () => Promise<void> }

export function Settings({ state, act, report, restore, damaged = false, cloud = false, onSignOut, account }: FeatureProps & { restore: (file: File) => Promise<void>; damaged?: boolean; cloud?: boolean; onSignOut?: () => void; account?: AccountSettings }) {
  const { t, locale, language } = useI18n()
  const [page, setPage] = useState<SettingsPage | null>(null)
  const [name, setName] = useState(state.shop.name)
  const [phone, setPhone] = useState(state.shop.phone)
  const [sourceRevision, setSourceRevision] = useState(state.revision)
  const heading = useRef<HTMLHeadingElement>(null)
  const origin = useRef<HTMLButtonElement | null>(null)
  const navigating = useRef(false)
  const resetBusy = useRef(false)
  const [resetStatus, setResetStatus] = useState<'idle' | 'pending' | 'sent' | 'error' | 'limited'>('idle')
  const accountGroup = language === 'th' ? 'บัญชีของคุณ' : 'Your account'
  const sendReset = async () => {
    if (!account || resetBusy.current) return
    resetBusy.current = true; setResetStatus('pending')
    try { await account.sendPasswordReset(); setResetStatus('sent') }
    catch (error) { setResetStatus(error instanceof Error && error.message === 'RESET_RATE_LIMITED' ? 'limited' : 'error') }
    finally { resetBusy.current = false }
  }
  useEffect(() => {
    if (!navigating.current) return
    if (page) heading.current?.focus()
    else origin.current?.focus()
    window.scrollTo({ top: 0 })
  }, [page])
  const categories: { id: SettingsPage; group: string; title: string; description: string; icon: IconName; value?: string }[] = [
    { id: 'shop', group: 'ร้านของคุณ', title: 'ข้อมูลร้าน', description: 'ชื่อร้านและเบอร์ติดต่อที่แสดงบนบิล', icon: 'product' },
    { id: 'language', group: 'การใช้งาน', title: 'ภาษา / Language', description: 'เลือกภาษาไทยหรือภาษาอังกฤษสำหรับแอป', icon: 'language', value: language === 'th' ? 'ไทย' : 'English' },
    { id: 'backup', group: 'ข้อมูลและประวัติ', title: cloud ? (language === 'th' ? 'สำรองข้อมูล' : 'Back up data') : 'สำรองและกู้ข้อมูล', description: cloud ? 'ดาวน์โหลดไฟล์สำรอง' : 'ดาวน์โหลดไฟล์สำรอง หรือนำข้อมูลกลับจากไฟล์', icon: 'backup' },
    { id: 'history', group: 'ข้อมูลและประวัติ', title: 'ประวัติการเคลื่อนไหว', description: 'ดูรายการเปลี่ยนแปลงสินค้า สต็อก และบิล', icon: 'activity' },
  ]
  if (account) categories.unshift({ id: 'account', group: accountGroup, title: language === 'th' ? 'บัญชีและความปลอดภัย' : 'Account and security', description: language === 'th' ? 'อีเมลที่ใช้งานและเปลี่ยนรหัสผ่าน' : 'Signed-in email and password changes', icon: 'settings' })
  const active = categories.find(category => category.id === page)
  const exportBackup = () => {
    download(new Blob([damaged ? localStorage.getItem(STORAGE_KEY) ?? '' : JSON.stringify(state, null, 2)], { type: 'application/json' }), `micro-erp-${damaged ? 'recovery' : 'backup'}-${new Date().toISOString().slice(0, 10)}.json`)
    report(damaged ? 'ดาวน์โหลดข้อมูลเดิมแล้ว เก็บไฟล์นี้ไว้เพื่อช่วยกู้ข้อมูล' : 'ดาวน์โหลดไฟล์สำรองแล้ว เก็บไว้ในที่ที่หาเจอ')
  }
  return <div className="stack settings-page">
    {!damaged && page && <button type="button" className="back-button settings-back" onClick={() => { navigating.current = true; setPage(null) }}><Icon name="back" /><span>{t('กลับไปตั้งค่า')}</span></button>}
    <header className="stack settings-heading">
      <h1 ref={heading} tabIndex={-1}>{damaged ? t('กู้ข้อมูลร้าน') : page ? t(active!.title) : t('ตั้งค่า')}</h1>
      {!damaged && <p className="muted">{t(active?.description ?? 'จัดการร้าน ภาษา และข้อมูลของคุณ')}</p>}
    </header>
    {!damaged && <div hidden={page !== null} className="settings-menu">
      {[...(account ? [accountGroup] : []), 'ร้านของคุณ', 'การใช้งาน', 'ข้อมูลและประวัติ'].map(group => <section className="settings-group" aria-label={t(group)} key={group}>
        <h2>{t(group)}</h2>
        {categories.filter(category => category.group === group).map(category => <button key={category.id} type="button" className="settings-menu-row" aria-label={t(category.title)} onClick={event => { origin.current = event.currentTarget; navigating.current = true; setPage(category.id) }}>
          <Icon name={category.icon} /><span className="settings-menu-copy"><span className="settings-menu-title">{t(category.title)}</span><span className="muted">{t(category.description)}</span></span>
          <span className="settings-menu-end">{category.value && <span className="muted">{category.value}</span>}<Icon name="next" /></span>
        </button>)}
      </section>)}
      <p className="muted settings-local-note">{cloud ? (language === 'th' ? 'ข้อมูลร้านบันทึกในบัญชีของคุณ ดาวน์โหลดไฟล์สำรองเก็บไว้ได้ ข้อมูลสาธิตบนเครื่องยังอยู่แยกกัน' : 'Shop data is saved to your account. You can download a backup. The local demo remains separate.') : t('ข้อมูลร้านอยู่ในแอปบนเครื่องนี้ การล้างข้อมูลเว็บหรือเปลี่ยนเครื่องอาจทำให้ข้อมูลหาย ดาวน์โหลดไฟล์สำรองไว้สม่ำเสมอ')}</p>
      {cloud && onSignOut && <Button variant="secondary" onClick={onSignOut}>{language === 'th' ? 'ออกจากระบบ' : 'Sign out'}</Button>}
    </div>}
    {account && <div hidden={page !== 'account'}><section className="section stack">
      <dl className="settings-account-email"><dt className="muted">{language === 'th' ? 'อีเมลที่เข้าสู่ระบบ' : 'Signed-in email'}</dt><dd>{account.email}</dd></dl>
      <div className="stack"><h2>{language === 'th' ? 'เปลี่ยนรหัสผ่าน' : 'Change password'}</h2><p className="muted">{language === 'th' ? 'รับลิงก์ทางอีเมลเพื่อยืนยันว่าเป็นคุณ แล้วตั้งรหัสผ่านใหม่' : 'Receive an email link to verify it’s you, then set a new password.'}</p></div>
      <Button disabled={resetStatus === 'pending'} aria-busy={resetStatus === 'pending'} onClick={() => void sendReset()}>{language === 'th' ? resetStatus === 'pending' ? 'กำลังส่งลิงก์…' : 'ส่งลิงก์เปลี่ยนรหัสผ่าน' : resetStatus === 'pending' ? 'Sending link…' : 'Send password reset link'}</Button>
      {resetStatus !== 'idle' && resetStatus !== 'pending' && <p role="status" className={resetStatus === 'sent' ? 'notice' : 'notice error'}>{language === 'th' ? resetStatus === 'sent' ? 'ตรวจอีเมลของคุณ แล้วเปิดลิงก์เพื่อตั้งรหัสผ่านใหม่ หากไม่พบให้ดูในจดหมายขยะ' : resetStatus === 'limited' ? 'ส่งคำขอหลายครั้งแล้ว กรุณารอสักครู่แล้วลองใหม่' : 'ส่งลิงก์ไม่ได้ กรุณาตรวจการเชื่อมต่อแล้วลองอีกครั้ง' : resetStatus === 'sent' ? 'Check your email and open the link to set a new password. Check spam if needed.' : resetStatus === 'limited' ? 'Too many requests. Wait a little before trying again.' : 'Unable to send the link. Check your connection and try again.'}</p>}
    </section></div>}
    <div hidden={!damaged && page !== 'language'}><LanguageSettings /></div>
    {!damaged && <div hidden={page !== 'shop'}><Form noValidate className="stack section" onSubmit={async e => { e.preventDefault(); if (await act({ id: crypto.randomUUID(), type: 'shop', name, phone, expectedRevision: sourceRevision })) setSourceRevision(state.revision + 1) }}>
      <Field label={t('ชื่อร้านบนบิล')} value={name} onChange={e => setName(e.target.value)} />
      <Field label={t('เบอร์ติดต่อบนบิล')} type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
      <Button type="submit">{t('บันทึกข้อมูลร้าน')}</Button>
    </Form></div>}
    <div hidden={!damaged && page !== 'backup'}><section className="section stack">
      <h2>{cloud ? (language === 'th' ? 'สำรองข้อมูลร้าน' : 'Back up shop data') : damaged ? t('เก็บข้อมูลเดิมและกู้จากไฟล์สำรอง') : t('สำรองและย้ายข้อมูลด้วยมือ')}</h2>
      <p className="notice warning">{cloud ? (language === 'th' ? 'ดาวน์โหลดข้อมูลร้านในบัญชีนี้เก็บไว้ได้ ยังไม่เปิดให้นำเข้าไฟล์สำรองในระบบออนไลน์' : 'Download a copy of this account’s shop data. Importing backups into the online shop is not available yet.') : damaged ? t('ข้อมูลเดิมยังอยู่ กรุณาเก็บไฟล์ข้อมูลเดิมก่อน แล้วเลือกไฟล์สำรองที่เคยดาวน์โหลดไว้ ระบบจะไม่สร้างร้านใหม่ทับข้อมูลนี้') : t('ข้อมูลร้านอยู่ในแอปบนเครื่องนี้ การล้างข้อมูลเว็บหรือเปลี่ยนเครื่องอาจทำให้ข้อมูลหาย ดาวน์โหลดไฟล์สำรองไว้สม่ำเสมอ')}</p>
      <Button variant="secondary" onClick={exportBackup}>{damaged ? t('ดาวน์โหลดข้อมูลเดิมเพื่อกู้คืน') : t('ดาวน์โหลดไฟล์สำรอง')}</Button>
      <p className="muted">{damaged ? t('ไฟล์ข้อมูลเดิมนี้ใช้ช่วยตรวจปัญหา อาจนำเข้ากลับทันทีไม่ได้ ให้เก็บไว้ก่อน') : t('ไฟล์สำรองเก็บสินค้า สต็อก บิล จอง และคืนสินค้าในไฟล์เดียว (.json)')}</p>
      {!cloud && <><label className="field backup-picker"><span>{t('นำเข้าไฟล์สำรอง')}</span><span className="backup-file-control"><span>{t('เลือกไฟล์สำรอง')}</span><input className="file-input" aria-label={t('นำเข้าไฟล์สำรอง')} type="file" accept="application/json,.json" onChange={e => { const file = e.target.files?.[0]; if (file) void restore(file); e.target.value = '' }} /></span></label>
      <p className="muted">{t('เลือกไฟล์สำรองที่เคยดาวน์โหลดจากแอปนี้ การนำเข้าจะแทนที่ข้อมูลบนเครื่องหลังยืนยัน')}</p>
      {!damaged && <p className="muted">{t('ดาวน์โหลดไฟล์สำรองของข้อมูลปัจจุบันก่อนนำเข้าเสมอ')}</p>}</>}
    </section></div>
    {!damaged && <div hidden={page !== 'history'}><section className="section stack">
      <h2>{t('ประวัติการเคลื่อนไหว')}</h2>
      {state.movements.length ? state.movements.slice(0, 100).map(m => <p className="muted" key={m.id}>{new Date(m.date).toLocaleString(locale, { timeZone: 'Asia/Bangkok' })} · {({ product: t('บันทึกสินค้า'), receive: t('รับเข้า'), adjust: t('ปรับยอด'), sale: t('ขาย'), reserve: t('จอง'), convert: t('ขายจากจอง'), 'cancel-reservation': t('ยกเลิกจอง'), 'edit-bill': t('แก้บิล'), 'cancel-bill': t('ยกเลิกบิล'), return: t('รับคืน'), exchange: t('เปลี่ยน'), shop: t('แก้ข้อมูลร้าน') } as Record<string, string>)[m.text] ?? m.text}</p>) : <p className="muted">{t('ยังไม่มีการเคลื่อนไหว')}</p>}
    </section></div>}
  </div>
}
