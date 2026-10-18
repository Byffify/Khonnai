import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { parseEmail, passwordChecks } from './authPolicy'
import './auth.css'

type Language = 'th' | 'en'
type Screen = 'welcome' | 'login-email' | 'login-password' | 'signup-email' | 'signup-password' | 'recovery' | 'reset' | 'confirmation' | 'session'
type AuthUser = { id: string; email: string }
type Session = { user: AuthUser | null; csrfToken: string | null }
type Callback = { tokenHash: string; type: 'signup' | 'recovery' }
type Notice = 'INVALID_INPUT' | 'INVALID_CREDENTIALS' | 'RATE_LIMITED' | 'UNAVAILABLE' | 'UNAUTHORIZED' | 'CSRF' | 'EXPIRED_LINK' | 'CHECK_EMAIL' | 'PASSWORD_UPDATED'
type FieldErrors = { email?: boolean; password?: boolean; confirmation?: boolean }

const words = {
  th: {
    language: 'ภาษา', welcome: 'ยินดีต้อนรับสู่คนใน', welcomeHint: 'เข้าสู่ระบบ เพื่อดูแลสต็อกร้านของคุณ',
    useEmail: 'เข้าสู่ระบบด้วยอีเมล', newAccount: 'ยังไม่มีบัญชี?', create: 'สร้างบัญชี', existingAccount: 'มีบัญชีแล้ว?', signIn: 'เข้าสู่ระบบ',
    emailTitle: 'กรอกอีเมลของคุณ', emailHint: 'ใช้อีเมลที่คุณสมัครไว้กับคนใน', email: 'อีเมล', next: 'ถัดไป', back: 'ย้อนกลับ',
    loginTitle: 'เข้าสู่ระบบด้วยรหัสผ่าน', usingEmail: 'อีเมลสำหรับเข้าสู่ระบบ', password: 'รหัสผ่าน', passwordPlaceholder: 'กรอกรหัสผ่านของคุณ',
    show: 'แสดงรหัสผ่าน', hide: 'ซ่อนรหัสผ่าน', forgot: 'ลืมรหัสผ่าน?',
    signupEmailTitle: 'เริ่มต้นด้วยอีเมล', signupEmailHint: 'ใช้อีเมลของคุณเพื่อสร้างบัญชีคนใน', signupTitle: 'ตั้งรหัสผ่านของคุณ',
    newPassword: 'รหัสผ่านใหม่', newPasswordPlaceholder: 'ตั้งรหัสผ่านของคุณ', confirmPassword: 'ยืนยันรหัสผ่าน', confirmPlaceholder: 'กรอกรหัสผ่านใหม่อีกครั้ง',
    length: 'อย่างน้อย 8 ตัวอักษร', letter: 'มี A–Z หรือ a–z อย่างน้อย 1 ตัว', number: 'มีตัวเลข 0–9 อย่างน้อย 1 ตัว', match: 'รหัสผ่านตรงกัน',
    met: 'ครบแล้ว', unmet: 'ยังไม่ครบ', invalidEmail: 'กรอกอีเมลให้ครบ เช่น name@example.com', requiredPassword: 'กรอกรหัสผ่านของคุณ',
    invalidPassword: 'ตั้งรหัสผ่านให้ครบตามรายการด้านล่าง', invalidConfirmation: 'กรอกรหัสผ่านให้ตรงกัน',
    recoveryTitle: 'ตั้งรหัสผ่านใหม่', recoveryHint: 'กรอกอีเมลเพื่อขอลิงก์ตั้งรหัสผ่านใหม่', recoveryAction: 'ขอลิงก์ตั้งรหัสผ่านใหม่',
    resetTitle: 'เลือกรหัสผ่านใหม่', resetHint: 'ตั้งรหัสผ่านใหม่สำหรับบัญชีของคุณ', savePassword: 'บันทึกรหัสผ่านใหม่',
    confirmTitle: 'ยืนยันอีเมลของคุณ', confirmHint: 'กดปุ่มด้านล่างเพื่อยืนยันอีเมลและดำเนินการต่อ', confirmAction: 'ยืนยันอีเมล',
    recoveryConfirmTitle: 'ตั้งรหัสผ่านใหม่', recoveryConfirmHint: 'กดปุ่มด้านล่างเพื่อเริ่มตั้งรหัสผ่านใหม่', recoveryConfirmAction: 'ดำเนินการต่อ',
    mailTitle: 'เช็กอีเมลของคุณ', mailHint: 'หากดำเนินการต่อได้ คุณจะได้รับอีเมลพร้อมขั้นตอนถัดไป ลองดูในจดหมายขยะด้วย',
    sessionTitle: 'เข้าสู่ระบบแล้ว', sessionHint: 'เปิดร้านเพื่อเริ่มเพิ่มสินค้าและบันทึกสต็อก', signedInAs: 'บัญชีที่ใช้งาน', logout: 'ออกจากระบบ',
    backLogin: 'กลับไปเข้าสู่ระบบ', backHome: 'กลับหน้าแรก', pending: 'กำลังดำเนินการ…', checking: 'กำลังตรวจสอบบัญชี…',
    INVALID_INPUT: 'ข้อมูลยังไม่ครบหรือรูปแบบไม่ถูกต้อง กรุณาตรวจสอบแล้วลองใหม่',
    INVALID_CREDENTIALS: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง ลองอีกครั้งได้', RATE_LIMITED: 'ลองหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่',
    UNAVAILABLE: 'เชื่อมต่อไม่ได้ในขณะนี้ กรุณาลองอีกครั้งในอีกสักครู่', UNAUTHORIZED: 'กรุณาเข้าสู่ระบบอีกครั้งเพื่อดำเนินการต่อ',
    CSRF: 'หน้านี้หมดอายุแล้ว กรุณาลองอีกครั้ง', EXPIRED_LINK: 'ลิงก์นี้ใช้ไม่ได้หรือหมดอายุแล้ว กรุณาขอลิงก์ใหม่',
    CHECK_EMAIL: 'หากดำเนินการต่อได้ คุณจะได้รับอีเมลพร้อมขั้นตอนถัดไป', PASSWORD_UPDATED: 'เปลี่ยนรหัสผ่านแล้ว',
  },
  en: {
    language: 'Language', welcome: 'Welcome to Khonnai', welcomeHint: 'Sign in to manage your shop’s stock.',
    useEmail: 'Continue with email', newAccount: 'New to Khonnai?', create: 'Create an account', existingAccount: 'Already have an account?', signIn: 'Sign in',
    emailTitle: 'Enter your email', emailHint: 'Use the email you registered with Khonnai.', email: 'Email', next: 'Continue', back: 'Back',
    loginTitle: 'Sign in with password', usingEmail: 'Sign in with', password: 'Password', passwordPlaceholder: 'Enter your password',
    show: 'Show password', hide: 'Hide password', forgot: 'Forgot password?',
    signupEmailTitle: 'Start with your email', signupEmailHint: 'Use your email to create a Khonnai account.', signupTitle: 'Create your password',
    newPassword: 'New password', newPasswordPlaceholder: 'Create your password', confirmPassword: 'Confirm password', confirmPlaceholder: 'Enter your new password again',
    length: 'At least 8 characters', letter: 'At least 1 letter, A–Z or a–z', number: 'At least 1 digit, 0–9', match: 'Passwords match',
    met: 'Complete', unmet: 'Not yet complete', invalidEmail: 'Enter a complete email, such as name@example.com.', requiredPassword: 'Enter your password.',
    invalidPassword: 'Meet the password requirements below.', invalidConfirmation: 'Enter the same password again.',
    recoveryTitle: 'Reset your password', recoveryHint: 'Enter your email to request a password reset link.', recoveryAction: 'Request a reset link',
    resetTitle: 'Choose a new password', resetHint: 'Create a new password for your account.', savePassword: 'Save new password',
    confirmTitle: 'Confirm your email', confirmHint: 'Use the button below to confirm your email and continue.', confirmAction: 'Confirm email',
    recoveryConfirmTitle: 'Reset your password', recoveryConfirmHint: 'Use the button below to start resetting your password.', recoveryConfirmAction: 'Continue',
    mailTitle: 'Check your email', mailHint: 'If the request can proceed, an email will explain the next steps. Check your spam folder too.',
    sessionTitle: 'You’re signed in', sessionHint: 'Open your shop to add products and manage stock.', signedInAs: 'Signed in as', logout: 'Sign out',
    backLogin: 'Back to sign in', backHome: 'Back to home', pending: 'Please wait…', checking: 'Checking your account…',
    INVALID_INPUT: 'Some details are missing or invalid. Please check and try again.',
    INVALID_CREDENTIALS: 'The email or password is incorrect. Please try again.', RATE_LIMITED: 'Too many attempts. Please wait a while and try again.',
    UNAVAILABLE: 'Unable to connect right now. Please try again shortly.', UNAUTHORIZED: 'Please sign in again to continue.',
    CSRF: 'This page has expired. Please try again.', EXPIRED_LINK: 'This link is invalid or has expired. Please request a new one.',
    CHECK_EMAIL: 'If the request can proceed, an email will explain the next steps.', PASSWORD_UPDATED: 'Your password has been changed.',
  },
}

function parseSession(value: unknown): Session | null {
  if (typeof value !== 'object' || value === null || !('user' in value)) return null
  const csrfToken = 'csrfToken' in value && typeof value.csrfToken === 'string' ? value.csrfToken : null
  if (value.user === null) return { user: null, csrfToken }
  const user = value.user
  if (typeof user !== 'object' || user === null || !('id' in user) || !('email' in user)) return null
  if (typeof user.id !== 'string' || typeof user.email !== 'string') return null
  return { user: { id: user.id, email: user.email }, csrfToken }
}

function errorCode(value: unknown): Notice {
  if (typeof value !== 'object' || value === null || !('error' in value)) return 'UNAVAILABLE'
  switch (value.error) {
    case 'INVALID_INPUT': case 'INVALID_CREDENTIALS': case 'RATE_LIMITED': case 'UNAVAILABLE': case 'UNAUTHORIZED': case 'CSRF': return value.error
    default: return 'UNAVAILABLE'
  }
}

function initialScreen(): Screen {
  if (window.location.pathname === '/signup') return 'signup-email'
  if (window.location.pathname === '/auth/confirm' || window.location.pathname === '/auth/reset-password') return 'confirmation'
  return 'welcome'
}

function EmailIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="4" /><path d="m4 7 8 6 8-6" /></svg>
}

function EyeIcon({ visible }: { visible: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M2.5 12s3.2-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.2 6.5-9.5 6.5S2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" />{visible && <path d="m4 3 16 18" />}</svg>
}

export default function AuthPage() {
  const [language, setLanguage] = useState<Language>('th')
  const [screen, setScreen] = useState<Screen>(initialScreen)
  const [email, setEmail] = useState('')
  const [notice, setNotice] = useState<Notice | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [pending, setPending] = useState(false)
  const [checking, setChecking] = useState(true)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [callbackReady, setCallbackReady] = useState(false)
  const [confirmationKind, setConfirmationKind] = useState<'link' | 'email'>('link')
  const [recoveryCallback, setRecoveryCallback] = useState(window.location.pathname === '/auth/reset-password')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [checks, setChecks] = useState(() => passwordChecks('', ''))
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmationRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const messageRef = useRef<HTMLParagraphElement>(null)
  const bootstrapCsrfRef = useRef<string | null>(null)
  const sessionCsrfRef = useRef<string | null>(null)
  const callbackRef = useRef<Callback | null>(null)
  const callbackCaptured = useRef(false)
  const busyRef = useRef(false)
  const mounted = useRef(true)
  const requestRef = useRef<AbortController | null>(null)
  const text = words[language]

  const clearPasswords = () => {
    if (passwordRef.current) passwordRef.current.value = ''
    if (confirmationRef.current) confirmationRef.current.value = ''
    setShowPassword(false)
    setShowConfirmation(false)
    setChecks(passwordChecks('', ''))
  }

  const move = (next: Screen) => {
    clearPasswords()
    setNotice(null)
    setErrors({})
    setScreen(next)
  }

  useEffect(() => {
    mounted.current = true
    if (!callbackCaptured.current) {
      callbackCaptured.current = true
      const parameters = new URLSearchParams(window.location.hash.slice(1))
      const tokenHash = parameters.get('token_hash')
      const type = parameters.get('type')
      if (window.location.hash) window.history.replaceState(null, '', window.location.pathname)
      if (initialScreen() === 'confirmation' && tokenHash && (type === 'signup' || type === 'recovery')) {
        callbackRef.current = { tokenHash, type }
      }
    }
    const controller = new AbortController()
    fetch('/api/auth/session', { credentials: 'same-origin', cache: 'no-store', redirect: 'error', signal: controller.signal })
      .then(async response => {
        const value: unknown = await response.json()
        const session = response.ok ? parseSession(value) : null
        if (!session) throw new Error('unavailable')
        if (!mounted.current || controller.signal.aborted) return
        sessionCsrfRef.current = session.csrfToken
        setUser(session.user)
        const resumeReset = window.location.pathname === '/auth/reset-password' && !callbackRef.current && session.user
        if (resumeReset) setScreen('reset')
        else if (initialScreen() !== 'confirmation' && session.user) setScreen('session')
        setCallbackReady(Boolean(callbackRef.current))
        if (initialScreen() === 'confirmation' && !callbackRef.current && !resumeReset) setNotice('EXPIRED_LINK')
      })
      .catch(() => {
        if (!mounted.current || controller.signal.aborted) return
        setCallbackReady(Boolean(callbackRef.current))
        setNotice(initialScreen() === 'confirmation' && !callbackRef.current ? 'EXPIRED_LINK' : 'UNAVAILABLE')
      })
      .finally(() => { if (mounted.current && !controller.signal.aborted) setChecking(false) })
    const clearOnExit = () => {
      if (passwordRef.current) passwordRef.current.value = ''
      if (confirmationRef.current) confirmationRef.current.value = ''
      callbackRef.current = null
      bootstrapCsrfRef.current = null
      sessionCsrfRef.current = null
    }
    window.addEventListener('pagehide', clearOnExit)
    return () => {
      mounted.current = false
      controller.abort()
      requestRef.current?.abort()
      window.removeEventListener('pagehide', clearOnExit)
    }
  }, [])

  useEffect(() => {
    titleRef.current?.focus()
  }, [screen])

  useEffect(() => {
    if (notice) messageRef.current?.focus()
  }, [notice])

  const getCsrf = async (path: string, signal: AbortSignal): Promise<string> => {
    if (path === 'password') {
      if (sessionCsrfRef.current) return sessionCsrfRef.current
      const response = await fetch('/api/auth/session', { credentials: 'same-origin', cache: 'no-store', redirect: 'error', signal })
      const value: unknown = await response.json()
      const session = response.ok ? parseSession(value) : null
      if (!session?.user || !session.csrfToken) throw new Error('UNAUTHORIZED')
      sessionCsrfRef.current = session.csrfToken
      return session.csrfToken
    }
    if (bootstrapCsrfRef.current) return bootstrapCsrfRef.current
    const response = await fetch('/api/auth/csrf', { credentials: 'same-origin', cache: 'no-store', redirect: 'error', signal })
    const value: unknown = await response.json()
    if (!response.ok || typeof value !== 'object' || value === null || !('csrfToken' in value) || typeof value.csrfToken !== 'string') throw new Error('UNAVAILABLE')
    bootstrapCsrfRef.current = value.csrfToken
    return value.csrfToken
  }

  const request = async (path: string, body: object, onSuccess: (signal: AbortSignal) => Promise<void> | void) => {
    if (busyRef.current) return
    busyRef.current = true
    setPending(true)
    setNotice(null)
    const controller = new AbortController()
    requestRef.current = controller
    try {
      const csrf = await getCsrf(path, controller.signal)
      const response = await fetch(`/api/auth/${path}`, {
        method: 'POST', credentials: 'same-origin', cache: 'no-store', redirect: 'error', signal: controller.signal,
        headers: { 'Content-Type': 'application/json', 'X-Khonnai-CSRF': csrf }, body: JSON.stringify(body),
      })
      const result: unknown = await response.json()
      if (!mounted.current || controller.signal.aborted) return
      if (!response.ok) {
        const error = errorCode(result)
        if (error === 'CSRF') {
          if (path === 'password') sessionCsrfRef.current = null
          else bootstrapCsrfRef.current = null
        }
        if (error === 'UNAUTHORIZED') {
          sessionCsrfRef.current = null
          setUser(null)
          setScreen('welcome')
        }
        setNotice(path === 'verify' && (error === 'INVALID_CREDENTIALS' || error === 'INVALID_INPUT') ? 'EXPIRED_LINK' : error)
        return
      }
      if (path === 'login' || path === 'verify' || path === 'password' || path === 'logout') {
        bootstrapCsrfRef.current = null
        sessionCsrfRef.current = null
      }
      await onSuccess(controller.signal)
    } catch (error) {
      if (mounted.current && !controller.signal.aborted) setNotice(error instanceof Error && error.message === 'UNAUTHORIZED' ? 'UNAUTHORIZED' : 'UNAVAILABLE')
    } finally {
      if (mounted.current && !controller.signal.aborted) {
        clearPasswords()
        setPending(false)
      }
      busyRef.current = false
    }
  }

  const refreshSession = async (signal: AbortSignal): Promise<AuthUser | null> => {
    const response = await fetch('/api/auth/session', { credentials: 'same-origin', cache: 'no-store', redirect: 'error', signal })
    const value: unknown = await response.json()
    const session = response.ok ? parseSession(value) : null
    if (!session) throw new Error('UNAVAILABLE')
    if (signal.aborted || !mounted.current) return null
    sessionCsrfRef.current = session.csrfToken
    setUser(session.user)
    return session.user
  }

  const emailValid = () => {
    const parsed = parseEmail(email)
    if (!parsed || emailRef.current?.validity.typeMismatch) {
      setErrors({ email: true })
      emailRef.current?.focus()
      return false
    }
    setEmail(parsed)
    setErrors({})
    return true
  }

  const updateChecks = () => setChecks(passwordChecks(passwordRef.current?.value ?? '', confirmationRef.current?.value ?? ''))

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (busyRef.current) return
    if (screen === 'login-email' || screen === 'signup-email') {
      if (emailValid()) move(screen === 'login-email' ? 'login-password' : 'signup-password')
      return
    }
    if (screen === 'recovery') {
      if (!emailValid()) return
      void request('recover', { email: parseEmail(email) }, () => {
        setConfirmationKind('email')
        move('confirmation')
      })
      return
    }
    const password = passwordRef.current?.value ?? ''
    const confirmation = confirmationRef.current?.value ?? ''
    if (screen === 'login-password') {
      if (!password) { setErrors({ password: true }); passwordRef.current?.focus(); return }
      setErrors({})
      void request('login', { email, password }, async signal => {
        const signedIn = await refreshSession(signal)
        if (!signedIn) { setNotice('UNAUTHORIZED'); return }
        move('session')
      })
      return
    }
    const result = passwordChecks(password, confirmation)
    setChecks(result)
    if (!result.length || !result.letter || !result.number || !result.match) {
      setErrors({ password: !result.length || !result.letter || !result.number, confirmation: !result.match })
      if (!result.length || !result.letter || !result.number) passwordRef.current?.focus()
      else confirmationRef.current?.focus()
      return
    }
    setErrors({})
    if (screen === 'signup-password') {
      void request('signup', { email, password, confirmation }, () => {
        setConfirmationKind('email')
        move('confirmation')
      })
    } else if (screen === 'reset') {
      void request('password', { password, confirmation }, async signal => {
        const current = await refreshSession(signal)
        move(current ? 'session' : 'welcome')
        setNotice('PASSWORD_UPDATED')
      })
    }
  }

  const verify = () => {
    const callback = callbackRef.current
    if (!callback) { setNotice('EXPIRED_LINK'); return }
    void request('verify', callback, async signal => {
      const current = await refreshSession(signal)
      if (!current) { setNotice('UNAUTHORIZED'); return }
      callbackRef.current = null
      setCallbackReady(false)
      move(callback.type === 'recovery' ? 'reset' : 'session')
    })
  }

  const signOut = () => {
    void request('logout', {}, () => {
      bootstrapCsrfRef.current = null
      sessionCsrfRef.current = null
      callbackRef.current = null
      setUser(null)
      setEmail('')
      move('welcome')
    })
  }

  const primary = (label: string) => <button className="kn-auth-button kn-auth-primary" type="submit" disabled={pending || checking} aria-busy={pending}>{pending ? text.pending : label}</button>
  const back = (to: Screen, label = text.back) => <button className="kn-auth-button kn-auth-secondary" type="button" disabled={pending} onClick={() => move(to)}>{label}</button>

  const emailField = <div className="kn-auth-field">
    <label htmlFor="auth-email">{text.email}</label>
    <input ref={emailRef} id="auth-email" name="email" type="email" inputMode="email" autoComplete="username" placeholder="name@example.com" required value={email} onChange={event => setEmail(event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'auth-email-error' : undefined} disabled={pending} />
    {errors.email && <p className="kn-auth-field-error" id="auth-email-error">{text.invalidEmail}</p>}
  </div>

  const passwordField = (isNew: boolean) => <>
    <input className="kn-auth-username" name="username" type="email" autoComplete="username" value={email} readOnly tabIndex={-1} aria-hidden="true" />
    <div className="kn-auth-field">
      <label htmlFor="auth-password">{isNew ? text.newPassword : text.password}</label>
      <div className="kn-auth-input-wrap">
        <input ref={passwordRef} id="auth-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={isNew ? 'new-password' : 'current-password'} placeholder={isNew ? text.newPasswordPlaceholder : text.passwordPlaceholder} required disabled={pending} onInput={isNew ? updateChecks : undefined} aria-invalid={Boolean(errors.password)} aria-describedby={[errors.password && 'auth-password-error', isNew && 'auth-password-checks'].filter(Boolean).join(' ') || undefined} />
        <button className="kn-auth-eye" type="button" disabled={pending} onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? text.hide : text.show} aria-pressed={showPassword}><EyeIcon visible={showPassword} /></button>
      </div>
      {errors.password && <p className="kn-auth-field-error" id="auth-password-error">{isNew ? text.invalidPassword : text.requiredPassword}</p>}
    </div>
    {isNew && <>
      <div className="kn-auth-field">
        <label htmlFor="auth-confirmation">{text.confirmPassword}</label>
        <div className="kn-auth-input-wrap">
          <input ref={confirmationRef} id="auth-confirmation" name="confirmation" type={showConfirmation ? 'text' : 'password'} autoComplete="new-password" placeholder={text.confirmPlaceholder} required disabled={pending} onInput={updateChecks} aria-invalid={Boolean(errors.confirmation)} aria-describedby={errors.confirmation ? 'auth-confirmation-error' : undefined} />
          <button className="kn-auth-eye" type="button" disabled={pending} onClick={() => setShowConfirmation(value => !value)} aria-label={showConfirmation ? text.hide : text.show} aria-pressed={showConfirmation}><EyeIcon visible={showConfirmation} /></button>
        </div>
        {errors.confirmation && <p className="kn-auth-field-error" id="auth-confirmation-error">{text.invalidConfirmation}</p>}
      </div>
      <ul className="kn-auth-checks" id="auth-password-checks">
        {(['length', 'letter', 'number', 'match'] satisfies (keyof typeof checks)[]).map(key => <li key={key} data-met={checks[key]}><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">{checks[key] ? <path d="m4 10 4 4 8-8" /> : <circle cx="10" cy="10" r="6" />}</svg><span>{text[key]}</span><span className="kn-auth-sr-only">{checks[key] ? text.met : text.unmet}</span></li>)}
      </ul>
    </>}
  </>

  let title: string = text.welcome
  let hint: ReactNode = text.welcomeHint
  let content: ReactNode

  switch (screen) {
    case 'welcome':
      content = <><button className="kn-auth-button kn-auth-primary" type="button" disabled={checking} onClick={() => move('login-email')}><EmailIcon />{text.useEmail}</button><p className="kn-auth-account-prompt">{text.newAccount} <button type="button" className="kn-auth-text-button" disabled={checking} onClick={() => move('signup-email')}>{text.create}</button></p></>
      break
    case 'login-email': case 'signup-email':
      title = screen === 'login-email' ? text.emailTitle : text.signupEmailTitle
      hint = screen === 'login-email' ? text.emailHint : text.signupEmailHint
      content = <><form noValidate onSubmit={submit}>{emailField}<div className="kn-auth-actions">{primary(text.next)}{back('welcome')}</div></form><p className="kn-auth-account-prompt">{screen === 'login-email' ? text.newAccount : text.existingAccount} <button type="button" className="kn-auth-text-button" onClick={() => move(screen === 'login-email' ? 'signup-email' : 'login-email')}>{screen === 'login-email' ? text.create : text.signIn}</button></p></>
      break
    case 'login-password':
      title = text.loginTitle
      hint = <>{text.usingEmail} <span className="kn-auth-email">{email}</span></>
      content = <form noValidate onSubmit={submit}>{passwordField(false)}<div className="kn-auth-recovery-link"><button className="kn-auth-text-button" type="button" disabled={pending} onClick={() => move('recovery')}>{text.forgot}</button></div><div className="kn-auth-actions">{primary(text.signIn)}{back('login-email')}</div></form>
      break
    case 'signup-password': case 'reset':
      title = screen === 'reset' ? text.resetTitle : text.signupTitle
      hint = screen === 'reset' ? text.resetHint : email
      content = <form noValidate onSubmit={submit}>{passwordField(true)}<div className="kn-auth-actions">{primary(screen === 'reset' ? text.savePassword : text.create)}{screen === 'reset' ? <button className="kn-auth-button kn-auth-secondary" type="button" disabled={pending} onClick={signOut}>{text.logout}</button> : back('signup-email')}</div></form>
      break
    case 'recovery':
      title = text.recoveryTitle
      hint = text.recoveryHint
      content = <form noValidate onSubmit={submit}>{emailField}<div className="kn-auth-actions">{primary(text.recoveryAction)}{back('login-email')}</div></form>
      break
    case 'confirmation':
      if (confirmationKind === 'email') {
        title = text.mailTitle
        hint = text.mailHint
        content = back('welcome', text.backLogin)
      } else {
        title = recoveryCallback ? text.recoveryConfirmTitle : text.confirmTitle
        hint = recoveryCallback ? text.recoveryConfirmHint : text.confirmHint
        content = <div className="kn-auth-actions">{callbackReady && <button className="kn-auth-button kn-auth-primary" type="button" disabled={pending || checking} onClick={verify} aria-busy={pending}>{pending ? text.pending : recoveryCallback ? text.recoveryConfirmAction : text.confirmAction}</button>}{!callbackReady && <button className="kn-auth-button kn-auth-primary" type="button" disabled={checking} onClick={() => { setRecoveryCallback(false); move(recoveryCallback ? 'recovery' : 'signup-email') }}>{recoveryCallback ? text.recoveryAction : text.create}</button>}{back('welcome', text.backLogin)}</div>
      }
      break
    case 'session':
      title = text.sessionTitle
      hint = text.sessionHint
      content = <><p className="kn-auth-session-email"><span>{text.signedInAs}</span><strong>{user?.email}</strong></p><div className="kn-auth-actions"><a className="kn-auth-button kn-auth-primary" href="/shop">{language === 'th' ? 'เปิดร้านของคุณ' : 'Open your shop'}</a><button className="kn-auth-button kn-auth-secondary" type="button" disabled={pending} onClick={signOut} aria-busy={pending}>{pending ? text.pending : text.logout}</button></div></>
      break
  }

  useEffect(() => {
    document.title = `${title} · Khonnai`
    document.documentElement.lang = language
  }, [title, language])

  return <div className="kn-auth" lang={language}>
    <header className="kn-auth-header">
      <a className="kn-auth-brand" href={language === 'th' ? '/landing/' : '/en/landing/'} aria-label="Khonnai"><img src="/brand/khonnai-mark.png" width="38" height="38" alt="" /><span>Khonnai</span></a>
      <label className="kn-auth-language"><span>{text.language}</span><select value={language} disabled={pending} onChange={event => { if (event.target.value === 'th' || event.target.value === 'en') setLanguage(event.target.value) }}><option value="th">ไทย</option><option value="en">English</option></select></label>
    </header>
    <main className="kn-auth-main"><section className="kn-auth-card" aria-labelledby="auth-title" aria-busy={pending || checking}>
      <div className="kn-auth-screen" key={screen}><h1 id="auth-title" ref={titleRef} tabIndex={-1}>{title}</h1><p className="kn-auth-subtitle">{hint}</p>
        {checking && <p className="kn-auth-notice" role="status">{text.checking}</p>}
        {notice && <p className="kn-auth-notice" data-error={notice !== 'CHECK_EMAIL' && notice !== 'PASSWORD_UPDATED'} role="status" tabIndex={-1} ref={messageRef}>{text[notice]}</p>}
        {content}
      </div>
    </section></main>
    <footer className="kn-auth-footer"><a href={language === 'th' ? '/landing/' : '/en/landing/'}>{text.backHome}</a></footer>
  </div>
}
