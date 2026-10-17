import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { LanguageProvider } from './LanguageProvider'
import { SiteEntry } from './SiteEntry'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider><SiteEntry /></LanguageProvider>
  </StrictMode>,
)
