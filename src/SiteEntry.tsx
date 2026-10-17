import { lazy, Suspense } from 'react'
import { useI18n } from './languageContext'

const Page = lazy(() => import('./App'))

function LoadingPage() {
  const { language } = useI18n()
  return <p className="shell" role="status">{language === 'th' ? 'กำลังเปิดคนใน…' : 'Opening Khonnai…'}</p>
}

export function SiteEntry() {
  return <Suspense fallback={<LoadingPage />}><Page /></Suspense>
}
