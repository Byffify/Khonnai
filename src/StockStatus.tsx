import { useI18n } from './languageContext'
import { Icon } from './Icon'

// This is availability, not a publishing or sales state.
export function StockStatus({ available, shortage = available < 0 }: { available: number; shortage?: boolean }) {
  const { t } = useI18n()

  const status = shortage ? 'shortage' : available === 0 ? 'unavailable' : 'ready'
  return <span className={`stock-status ${status}`}><Icon name={status === 'ready' ? 'check' : status === 'shortage' ? 'warning' : 'empty'} />{status === 'ready' ? t("พร้อมขาย") : status === 'shortage' ? t("ของไม่พอ") : t("หมด")}</span>
}
