import { lazy, Suspense } from 'react'
import { useI18n } from './languageContext'

const Page = lazy(() => import('./App'))
const AuthPage = lazy(() => import('./AuthPage'))
const CloudApp = lazy(() => import('./CloudApp'))

function LoadingPage() {
  const { language } = useI18n()
  return <p className="shell" role="status">{language === 'th' ? 'กำลังเปิดคนใน…' : 'Opening Khonnai…'}</p>
}

export function SiteEntry() {
  if (/^\/auth(?:\/|$)/.test(window.location.pathname)) return <Suspense fallback={<LoadingPage />}><AuthPage /></Suspense>
  if (/^\/shop\/?$/.test(window.location.pathname)) return <Suspense fallback={<LoadingPage />}><CloudApp /></Suspense>
  return <Suspense fallback={<LoadingPage />}><Page /></Suspense>
}
