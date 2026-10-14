import { Icon } from './Icon'

// This is availability, not a publishing or sales state.
export function StockStatus({ available, shortage = available < 0 }: { available: number; shortage?: boolean }) {
  const status = shortage ? 'shortage' : available === 0 ? 'unavailable' : 'ready'
  return <span className={`stock-status ${status}`}><Icon name={status === 'ready' ? 'check' : status === 'shortage' ? 'warning' : 'empty'} />{status === 'ready' ? 'พร้อมขาย' : status === 'shortage' ? 'ของไม่พอ' : 'หมด'}</span>
}
