import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { isLanguage, LANGUAGE_KEY } from './i18n'
import type { Language } from './i18n'
import { LanguageContext } from './languageContext'

function initialLanguage(): Language {
  try { const value = localStorage.getItem(LANGUAGE_KEY); return isLanguage(value) ? value : 'th' } catch { return 'th' }
}
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState(initialLanguage)
  const [preferenceSaved, setPreferenceSaved] = useState(true)
  useEffect(() => { document.documentElement.lang = language }, [language])
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === LANGUAGE_KEY) { setLanguage(isLanguage(event.newValue) ? event.newValue : 'th'); setPreferenceSaved(true) }
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])
  const changeLanguage = (next: Language) => {
    try { localStorage.setItem(LANGUAGE_KEY, next); setPreferenceSaved(true) } catch { setPreferenceSaved(false) }
    setLanguage(next)
  }
  return <LanguageContext.Provider value={{ language, preferenceSaved, changeLanguage }}>{children}</LanguageContext.Provider>
}
