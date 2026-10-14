import { createContext } from 'react'

export const FormFailureContext = createContext({ message: '', sequence: 0 })
export const formFailureEvent = 'khonnai:form-failure'

export function focusedForm(): HTMLFormElement | null {
  return document.activeElement instanceof HTMLElement ? document.activeElement.closest('form') : null
}

export function reportFormFailure(form: HTMLFormElement | null, message: string) {
  return !!form?.isConnected && !form.dispatchEvent(new CustomEvent(formFailureEvent, { detail: message, cancelable: true }))
}
