import { createContext, useContext, useEffect, useId } from 'react'

// Forms report whether they hold unsaved work from their own state, so items added by picking (search results,
// a pre-filled sale) are protected the same as typed fields. App asks before leaving while any draft is active.
export const DraftContext = createContext<(id: string, active: boolean) => void>(() => {})
export function useDraftGuard(active: boolean) {
  const report = useContext(DraftContext)
  const id = useId()
  useEffect(() => {
    report(id, active)
    return () => report(id, false)
  }, [report, id, active])
}
