import type { State } from '../domain/inventory'

// When this device last downloaded a backup, and which data revision that file held.
// Kept outside the shop data so importing an old backup never claims a newer backup exists.
export const BACKUP_KEY = 'khonnai-last-backup'
export type BackupRecord = { date: string; revision: number }
const DAY = 86_400_000
export const REMIND_AFTER_DAYS = 7

export function readBackup(): BackupRecord | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(BACKUP_KEY) ?? 'null')
    if (value && typeof value === 'object' && 'date' in value && 'revision' in value && typeof value.date === 'string' && !Number.isNaN(Date.parse(value.date)) && typeof value.revision === 'number') return { date: value.date, revision: value.revision }
  } catch { /* An unreadable record counts as no backup. */ }
  return null
}
export function recordBackup(revision: number): BackupRecord {
  const record = { date: new Date().toISOString(), revision }
  try { localStorage.setItem(BACKUP_KEY, JSON.stringify(record)) } catch { /* The reminder stays on; the download itself already happened. */ }
  return record
}
export const daysSince = (date: string, now = Date.now()) => Math.max(0, Math.floor((now - Date.parse(date)) / DAY))
// Remind once there is a sale worth losing and no backup yet, or when the last backup is a week old and the data has changed since.
export function backupDue(state: State, record: BackupRecord | null, now = Date.now()) {
  if (!record) return state.bills.length > 0
  return record.revision !== state.revision && daysSince(record.date, now) >= REMIND_AFTER_DAYS
}
