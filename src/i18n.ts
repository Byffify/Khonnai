import { english } from './messages.ts'

export type Language = 'th' | 'en'
export const LANGUAGE_KEY = 'khonnai-language'
export const isLanguage = (value: unknown): value is Language => value === 'th' || value === 'en'
const reverse = new Map(Object.entries(english).map(([key, value]) => [value, key]))
const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const templates = Object.entries(english).filter(([key]) => /\{\d+\}/.test(key)).flatMap(([key, value]) => [key, value].map(pattern => {
  const slots = [...pattern.matchAll(/\{(\d+)\}/g)].map(match => Number(match[1]))
  return { key, slots, expression: new RegExp('^' + pattern.split(/\{\d+\}/).map(escape).join('([\\s\\S]*?)') + '$', 'u') }
}))
function resolve(source: string): { key: string; values: unknown[] } {
  if (Object.hasOwn(english, source)) return { key: source, values: [] }
  const original = reverse.get(source)
  if (original) return { key: original, values: [] }
  for (const template of templates) {
    const match = template.expression.exec(source)
    if (match) {
      const values: unknown[] = []
      template.slots.forEach((slot, index) => { values[slot] = match[index + 1] })
      return { key: template.key, values }
    }
  }
  return { key: source, values: [] }
}
const fill = (pattern: string, values: unknown[]) => pattern.replace(/\{(\d+)\}/g, (slot, index) => values[Number(index)] === undefined ? slot : String(values[Number(index)]))
// Canonicalize system labels captured by validation; never canonicalize shop-entered data.
export function canonicalMessage(source: string) {
  const result = resolve(source.trim())
  return fill(result.key, result.values)
}
export function translate(source: string, language: Language, ...values: unknown[]): string {
  const leading = source.match(/^\s*/)?.[0] ?? '', trailing = source.match(/\s*$/)?.[0] ?? ''
  const text = source.trim()
  if (!text) return source
  if (text.startsWith('Error: ')) return leading + 'Error: ' + translate(text.slice(7), language) + trailing
  const result = resolve(text)
  return leading + fill(language === 'en' ? english[result.key] ?? result.key : result.key, values.length ? values : result.values) + trailing
}
