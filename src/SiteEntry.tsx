import { ShopLoading } from './ShopLoading'
import { lazy, Suspense } from 'react'
import { useI18n } from './languageContext'

const Page = lazy(() => import('./App'))

function LoadingPage() {
  const { language } = useI18n()
  return <ShopLoading label={language === 'th' ? 'กำลังเปิดคนใน…' : 'Opening Khonnai…'} />
}

export function SiteEntry() {
  return <Suspense fallback={<LoadingPage />}><Page /></Suspense>
}
