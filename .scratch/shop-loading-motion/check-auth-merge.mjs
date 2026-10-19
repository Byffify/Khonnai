import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtemp, readFile, writeFile, rm, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createHash } from 'node:crypto'

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', windowsHide: true }).trimEnd()
const baseRef = git('merge-base', 'origin/main', 'authentication-feature')
const path = 'src/SiteEntry.tsx'
const base = git('show', baseRef + ':' + path) + '\n'
const auth = git('show', 'authentication-feature:' + path) + '\n'
const proposed = await readFile(path, 'utf8')
const hash = value => createHash('sha256').update(value).digest('hex')
const directory = await mkdtemp(join(tmpdir(), 'khonnai-loading-merge-'))
try {
  const paths = ['proposed.tsx', 'base.tsx', 'auth.tsx'].map(name => join(directory, name))
  for (const [index, value] of [proposed, base, auth].entries()) await writeFile(paths[index], value.replaceAll('\r\n', '\n'))
  const result = spawnSync('git', ['merge-file', '-p', ...paths], { encoding: 'utf8', windowsHide: true })
  assert.equal(result.status, 0, 'Shared SiteEntry text merge needs conflict resolution')
  assert.ok(result.stdout.includes('<ShopLoading label='))
  assert.ok(result.stdout.includes('<CloudApp />') && result.stdout.includes('<AuthPage />'))
  assert.equal(await readFile(path, 'utf8'), proposed)
  assert.equal(git('show', 'authentication-feature:' + path) + '\n', auth)
  await mkdir('outputs/shop-loading-motion', { recursive: true })
  const report = { checkedAt: new Date().toISOString(), passed: true, commonAncestor: baseRef, authCommit: git('rev-parse', 'authentication-feature'), mainCommit: git('rev-parse', 'origin/main'), sharedPath: path, proposedHash: hash(proposed), checks: ['Current SiteEntry text merges without conflict', 'Auth and cloud routes preserved alongside animated fallback', 'Neither source file nor Auth ref modified'], scope: 'Temporary three-way text rehearsal only. No actual branch merge and no live Supabase loading integration.' }
  await writeFile('outputs/shop-loading-motion/auth-merge.json', JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report, null, 2))
} finally { await rm(directory, { recursive: true, force: true }) }
