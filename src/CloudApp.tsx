import { useEffect, useState } from 'react'
import App from './App'
import { createCloudInventory, CloudFailure } from './data/cloud'
import type { State } from './domain/inventory'
import { useI18n } from './languageContext'
import { Brand } from './Brand'
import { Button, Notice } from './ui'

type Screen = { kind: 'loading' } | { kind: 'ready'; state: State } | { kind: 'error' } | { kind: 'session' }
export default function CloudApp() {
  const { language } = useI18n()
  const [client] = useState(() => createCloudInventory())
  const [screen, setScreen] = useState<Screen>({ kind: 'loading' })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    void client.load().then(state => { if (active) setScreen({ kind: 'ready', state }) }).catch(error => {
      if (active) setScreen({ kind: error instanceof CloudFailure && error.kind === 'session' ? 'session' : 'error' })
    })
    return () => { active = false }
  }, [client, attempt])
  const sessionEnded = () => { client.clear(); setScreen({ kind: 'session' }) }
  const signOut = async () => {
    // Hide the prior account immediately, including when the network is unavailable.
    sessionEnded()
    try {
      const bootstrap = await fetch('/api/auth/csrf', { credentials: 'same-origin', cache: 'no-store' })
      const value: unknown = await bootstrap.json()
      if (!bootstrap.ok || typeof value !== 'object' || value === null || !('csrfToken' in value) || typeof value.csrfToken !== 'string') throw new Error('CSRF')
      const result = await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin', cache: 'no-store', headers: { 'Content-Type': 'application/json', 'X-Khonnai-CSRF': value.csrfToken }, body: '{}' })
      if (!result.ok) throw new Error('LOGOUT_FAILED')
      window.location.assign('/auth?returnTo=shop')
    } catch { setScreen({ kind: 'error' }) }
  }
  if (screen.kind === 'ready') return <App cloud={{ client, state: screen.state, sessionEnded, signOut: () => void signOut() }} />
  return <main className="shell stack"><Brand />{screen.kind === 'loading' ? <p role="status">{language === 'th' ? 'กำลังเปิดข้อมูลร้าน…' : 'Opening shop data…'}</p> : screen.kind === 'session' ? <><Notice>{language === 'th' ? 'กรุณาเข้าสู่ระบบเพื่อเปิดร้านของคุณ ข้อมูลร้านเดิมถูกปิดแล้ว' : 'Sign in to open your shop. The previous account’s data is closed.'}</Notice><a className="button primary" href="/auth?returnTo=shop">{language === 'th' ? 'เข้าสู่ระบบ' : 'Sign in'}</a></> : <><Notice error>{language === 'th' ? 'เชื่อมต่อไม่ได้ ข้อมูลร้านยังไม่เปิด หากเพิ่งออกจากระบบ กรุณาออกจากระบบอีกครั้งเมื่อเชื่อมต่อได้' : 'Unable to connect. Shop data is closed. If sign-out failed, sign out again when connected.'}</Notice><Button onClick={() => { setScreen({ kind: 'loading' }); setAttempt(value => value + 1) }}>{language === 'th' ? 'ลองเชื่อมต่ออีกครั้ง' : 'Try connecting again'}</Button><a href="/auth">{language === 'th' ? 'จัดการบัญชี' : 'Manage account'}</a></>}</main>
}
