import { Brand } from './Brand'
import './shop-loading.css'

export function ShopLoading({ label }: { label: string }) {
  return <main className="shop-loading">
    <div className="shop-loading-brand" aria-hidden="true"><Brand /></div>
    <div className="shop-loading-signals" aria-hidden="true"><span /><span /><span /></div>
    <p className="shop-loading-status" role="status" aria-live="polite" aria-atomic="true">{label}</p>
  </main>
}
