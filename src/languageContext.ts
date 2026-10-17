import { createContext, useCallback, useContext } from 'react'
import { translate } from './i18n'
import type { Language } from './i18n'

interface LanguageState { language: Language; preferenceSaved: boolean; changeLanguage: (language: Language) => void }
export const LanguageContext = createContext<LanguageState>({ language: 'th', preferenceSaved: true, changeLanguage: () => {} })
export function useI18n() {
  const context = useContext(LanguageContext)
  const t = useCallback((source: string, ...values: unknown[]) => translate(source, context.language, ...values), [context.language])
  return { ...context, t, locale: context.language === 'en' ? 'en-US' : 'th-TH' }
}
