import { useI18n } from './languageContext'
import { useEffect, useRef, useId } from 'react'
import { Button } from './ui'
import { Icon } from './Icon'
// `danger` marks an ask whose confirm removes or replaces shop data; `cancel` names what staying put means for this ask.
export interface ConfirmOptions { danger?: boolean; cancel?: string }
export interface Confirmation extends ConfirmOptions { message: string; action: string; finish: (answer: boolean) => void }
export function ConfirmDialog({ request }: { request: Confirmation | null }) {
  const { t } = useI18n()

  const dialog = useRef<HTMLDialogElement>(null)
  const cancel = useRef<HTMLButtonElement>(null)
  const titleId = useId(), descriptionId = useId()
  useEffect(() => {
    if (request) { dialog.current?.showModal(); cancel.current?.focus() }
    else dialog.current?.close()
  }, [request])
  const answer = (value: boolean) => { dialog.current?.close(); request?.finish(value) }
  return <dialog ref={dialog} className={`confirmation${request?.danger ? ' danger' : ''}`} aria-labelledby={titleId} aria-describedby={descriptionId} onCancel={e => { e.preventDefault(); answer(false) }}><div className="stack"><h2 id={titleId}>{request?.danger && <Icon name="warning" />}{request ? t(request.action) : ''}</h2><p id={descriptionId}>{request ? t(request.message) : ''}</p><div className="row"><button ref={cancel} className="button secondary" onClick={() => answer(false)}>{t(request?.cancel ?? 'ปิด')}</button><Button variant={request?.danger ? 'danger' : 'primary'} onClick={() => answer(true)}>{request ? t(request.action) : ''}</Button></div></div></dialog>
}
