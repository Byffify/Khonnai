import { useId, useRef, useState } from 'react'
import type { ButtonHTMLAttributes, FormHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'
export function Button({ variant = 'primary', children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }) {
  return <button type="button" {...props} className={`button ${variant} ${props.className ?? ''}`}>{children}</button>
}
export function Field({ label, hint, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  const id = useId()
  return <div className="field"><label htmlFor={id}>{label}</label><input {...props} id={id} aria-describedby={hint ? `${id}-hint` : undefined} />{hint && <p id={`${id}-hint`} className="muted">{hint}</p>}</div>
}
export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="empty"><h2>{title}</h2>{children}</div>
}
export function Notice({ children, error = false }: { children: ReactNode; error?: boolean }) {
  return <div className={`notice ${error ? 'error' : ''}`} role={error ? 'alert' : 'status'}>{children}</div>
}
export function Form({ children, onSubmit, ...props }: FormHTMLAttributes<HTMLFormElement>) {
  const id = useId()
  const [error, setError] = useState('')
  const invalid = useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>(null)
  const clear = () => { invalid.current?.removeAttribute('aria-invalid'); if (invalid.current?.getAttribute('aria-describedby') === id) invalid.current.removeAttribute('aria-describedby'); invalid.current = null; setError('') }
  return <form {...props} noValidate onChangeCapture={event => { if (invalid.current?.isSameNode(event.target)) clear() }} onSubmit={event => {
    clear()
    const field = [...event.currentTarget.elements].find(element => (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) && !element.disabled && (!element.validity.valid || (element.required && !element.value.trim())))
    if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) {
      event.preventDefault(); invalid.current = field; field.setAttribute('aria-invalid', 'true'); field.setAttribute('aria-describedby', id)
      setError('กรุณาตรวจช่อง ' + (field.labels?.[0]?.textContent?.trim() || 'ข้อมูลที่กรอก') + ' ให้ครบและตรงรูปแบบ'); field.focus(); return
    }
    onSubmit?.(event)
  }}>{error && <p id={id} role="alert" className="notice error">{error}</p>}{children}</form>
}
