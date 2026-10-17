import { useId } from 'react'
import { useI18n } from './languageContext'

export function LanguageSettings() {
  const { language, changeLanguage, preferenceSaved, t } = useI18n()
  const id = useId()
  return <section className="section stack language-settings">
    <label className="field" htmlFor={id}>
      <span>{t('เลือกภาษาที่ใช้แสดงในแอปบนเครื่องนี้')}</span>
      <select id={id} aria-label="ภาษา / Language" aria-describedby={`${id}-hint`} data-transient value={language} onChange={event => changeLanguage(event.target.value === 'en' ? 'en' : 'th')}>
        <option value="th" lang="th">ไทย</option><option value="en" lang="en">English</option>
      </select>
    </label>
    <p className="muted" id={`${id}-hint`}>{t('การเปลี่ยนภาษาไม่เปลี่ยนข้อมูลร้าน สินค้า หรือรูปบิล')}</p>
    {!preferenceSaved && <p className="notice warning" role="status">{t('เปลี่ยนภาษาแล้ว แต่เครื่องนี้บันทึกตัวเลือกภาษาไม่ได้ จะใช้ภาษานี้ในรอบการใช้งานนี้')}</p>}
  </section>
}
