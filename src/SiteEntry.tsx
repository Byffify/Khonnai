import { ShopLoading } from './ShopLoading'
import { lazy, Suspense } from 'react'
import { useI18n } from './languageContext'
import { ShopLoading } from './ShopLoading'

const Page = lazy(() => import('./App'))
const AuthPage = lazy(() => import('./AuthPage'))
const CloudApp = lazy(() => import('./CloudApp'))

function LoadingPage() {
  const { language } = useI18n()
  return <ShopLoading label={language === 'th' ? 'กำลังเปิดคนใน…' : 'Opening Khonnai…'} />
}

export function SiteEntry() {
  if (/^\/auth(?:\/|$)/.test(window.location.pathname)) return <Suspense fallback={<LoadingPage />}><AuthPage /></Suspense>
  if (/^\/shop\/?$/.test(window.location.pathname)) return <Suspense fallback={<LoadingPage />}><CloudApp /></Suspense>
  return <Suspense fallback={<LoadingPage />}><Page /></Suspense>
}
