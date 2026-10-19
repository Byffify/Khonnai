import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { requireEmptyStaging, StagingNotEmptyError, saveVerificationReport } from '../scripts/auth-verification-report.mjs'

test('Auth fixtures require an empty project before creating accounts', () => {
  assert.doesNotThrow(() => requireEmptyStaging(0))
  for (const count of [1, 2]) {
    assert.throws(() => requireEmptyStaging(count), error =>
      error instanceof StagingNotEmptyError && error.code === 'STAGING_NOT_EMPTY')
  }
})

test('A not-run attempt preserves the previous verification and does not count as passing', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'khonnai-auth-report-'))
  try {
    const previous = { status: 'passed', passed: true, checks: ['executed check'] }
    await saveVerificationReport(directory, previous)
    const previousBytes = await readFile(join(directory, 'live-session-verification.json'), 'utf8')
    const attempt = { status: 'not_run', passed: null, reason: 'STAGING_NOT_EMPTY', checks: [] }
    await saveVerificationReport(directory, attempt)
    assert.equal(await readFile(join(directory, 'live-session-verification.json'), 'utf8'), previousBytes)
    assert.deepEqual(JSON.parse(await readFile(join(directory, 'live-session-attempt.json'), 'utf8')), attempt)
    const failed = { status: 'failed', passed: false, checks: [] }
    await saveVerificationReport(directory, failed)
    assert.deepEqual(JSON.parse(await readFile(join(directory, 'live-session-verification.json'), 'utf8')), failed)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
