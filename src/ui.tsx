import { useContext, useEffect, useId, useRef, useState } from 'react'
import { FormFailureContext, formFailureEvent } from './formFeedback'
import { Icon } from './Icon'
import type { ButtonHTMLAttributes, FormHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'
export function Button({ variant = 'primary', children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }) {
  return <>{props.type === 'submit' && <FormFailure />}<button {...props} type={props.type ?? 'button'} onClick={props.onClick} className={`button ${variant} ${props.className ?? ''}`}>{children}</button></>
}
export function BackButton(props: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type' | 'className'>) {
  return <button {...props} type="button" className="back-button"><Icon name="back" /><span>กลับ</span></button>
}
function FormFailure() {
  const { message, sequence } = useContext(FormFailureContext)
  const ref = useRef<HTMLParagraphElement>(null)
  useEffect(() => { if (message) { ref.current?.focus({ preventScroll: true }); ref.current?.scrollIntoView({ block: 'center' }) } }, [message, sequence])
  return message ? <p ref={ref} role="alert" tabIndex={-1} className="notice error form-failure">{message}</p> : null
}
export function Field({ label, hint, suffix, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; suffix?: string }) {
  const id = useId()
  const description = [hint ? `${id}-hint` : '', suffix ? `${id}-suffix` : ''].filter(Boolean).join(' ') || undefined
  const input = <input {...props} id={id} aria-describedby={description} />
  return <div className="field"><label htmlFor={id}>{label}</label>{suffix ? <div className="input-with-suffix">{input}<span id={`${id}-suffix`} className="input-suffix">{suffix}</span></div> : input}{hint && <p id={`${id}-hint`} className="muted">{hint}</p>}</div>
}
export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="empty"><h2>{title}</h2>{children}</div>
}
export function Notice({ children, error = false, focusError = false }: { children: ReactNode; error?: boolean; focusError?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { if (error && focusError) { ref.current?.focus({ preventScroll: true }); ref.current?.scrollIntoView({ block: 'center' }) } }, [children, error, focusError])
  return <div ref={ref} tabIndex={error && focusError ? -1 : undefined} className={`notice ${error ? 'error' : ''}`} role={error ? 'alert' : 'status'}>{children}</div>
}
export function Form({ children, onSubmit, ...props }: FormHTMLAttributes<HTMLFormElement>) {
  const id = useId()
  const [error, setError] = useState('')
  const [failure, setFailure] = useState({ message: '', sequence: 0 })
  const formRef = useRef<HTMLFormElement>(null)
  useEffect(() => {
    const form = formRef.current
    const receive = (event: Event) => { if (event instanceof CustomEvent && typeof event.detail === 'string') { event.preventDefault(); const message: string = event.detail; setFailure(previous => ({ message, sequence: previous.sequence + 1 })) } }
    form?.addEventListener(formFailureEvent, receive)
    return () => form?.removeEventListener(formFailureEvent, receive)
  }, [])
  const invalid = useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>(null)
  const previousDescription = useRef<string | null>(null)
  const clear = () => {
    invalid.current?.removeAttribute('aria-invalid')
    if (invalid.current?.getAttribute('aria-describedby') === id) {
      if (previousDescription.current) invalid.current.setAttribute('aria-describedby', previousDescription.current)
      else invalid.current.removeAttribute('aria-describedby')
    }
    invalid.current = null; previousDescription.current = null; setError('')
  }
  return <FormFailureContext.Provider value={failure}><form {...props} ref={formRef} noValidate onChangeCapture={event => { setFailure(previous => ({ ...previous, message: '' })); if (invalid.current?.isSameNode(event.target)) clear() }} onSubmit={event => {
    setFailure(previous => ({ ...previous, message: '' }))
    clear()
    const field = [...event.currentTarget.elements].find(element => (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) && !element.disabled && (!element.validity.valid || (element.required && !element.value.trim())))
    if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) {
      event.preventDefault(); invalid.current = field; previousDescription.current = field.getAttribute('aria-describedby'); field.setAttribute('aria-invalid', 'true'); field.setAttribute('aria-describedby', id)
      setError('กรุณาตรวจช่อง ' + (field.labels?.[0]?.textContent?.trim() || 'ข้อมูลที่กรอก') + ' ให้ครบและตรงรูปแบบ'); field.focus(); return
    }
    onSubmit?.(event)
  }}>{error && <p id={id} role="alert" className="notice error">{error}</p>}{children}</form></FormFailureContext.Provider>
}
