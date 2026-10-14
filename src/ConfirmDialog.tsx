import { useEffect, useRef, useId } from 'react'
import { Button } from './ui'
export interface Confirmation { message: string; action: string; finish: (answer: boolean) => void }
export function ConfirmDialog({ request }: { request: Confirmation | null }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const cancel = useRef<HTMLButtonElement>(null)
  const titleId = useId(), descriptionId = useId()
  useEffect(() => {
    if (request) { dialog.current?.showModal(); cancel.current?.focus() }
    else dialog.current?.close()
  }, [request])
  const answer = (value: boolean) => { dialog.current?.close(); request?.finish(value) }
  return <dialog ref={dialog} className="confirmation" aria-labelledby={titleId} aria-describedby={descriptionId} onCancel={e => { e.preventDefault(); answer(false) }}><div className="stack"><h2 id={titleId}>{request?.action}</h2><p id={descriptionId}>{request?.message}</p><div className="row"><button ref={cancel} className="button secondary" onClick={() => answer(false)}>กลับ</button><Button onClick={() => answer(true)}>{request?.action}</Button></div></div></dialog>
}
