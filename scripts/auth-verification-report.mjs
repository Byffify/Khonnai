import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export class StagingNotEmptyError extends Error {
  constructor() {
    super('Staging contains existing accounts. Fixture verification requires an empty disposable project. No test accounts were created. Keep existing accounts; test their email confirmation, login and password recovery through /auth instead.')
    this.code = 'STAGING_NOT_EMPTY'
  }
}

export function requireEmptyStaging(userCount) {
  if (userCount !== 0) throw new StagingNotEmptyError()
}

export async function saveVerificationReport(directory, report) {
  await mkdir(directory, { recursive: true })
  const content = JSON.stringify(report, null, 2) + '\n'
  await writeFile(join(directory, 'live-session-attempt.json'), content)
  if (report.status !== 'not_run') {
    await writeFile(join(directory, 'live-session-verification.json'), content)
  }
}
