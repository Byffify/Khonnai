import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { parseEnv } from 'node:util'

const environment = parseEnv(await readFile('.env.staging.local', 'utf8'))
const secrets = []
for (const [name, value] of Object.entries(environment)) {
  if (!value || !/KEY|DATABASE_URL/.test(name)) continue
  secrets.push({ name, value })
  if (/DATABASE_URL/.test(name)) {
    const password = decodeURIComponent(new URL(value).password)
    if (password.length >= 12) secrets.push({ name, value: password })
  }
}
const paths = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'], { encoding: 'utf8', windowsHide: true }).split('\0').filter(Boolean)
const findings = []
for (const path of paths) {
  if (/(?:^|\/)(?:\.env(?:\.|$)|\.temp\/)|\.local$|\.(?:key|p12|pfx)$/i.test(path)) findings.push({ path, reason: 'private-or-local-file' })
  const content = execFileSync('git', ['show', `:${path}`], { windowsHide: true, maxBuffer: 32 * 1024 * 1024 }).toString('utf8')
  for (const secret of secrets) if (content.includes(secret.value)) findings.push({ path, field: secret.name })
  for (const match of content.matchAll(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g)) {
    try {
      const claims = JSON.parse(Buffer.from(match[0].split('.')[1], 'base64url').toString('utf8'))
      if (claims.role === 'service_role') findings.push({ path, reason: 'privileged-jwt' })
    } catch { /* Only decoded privileged tokens are classified here. */ }
  }
}
console.log(JSON.stringify({ filesChecked: paths.length, findings }, null, 2))
if (!paths.length || findings.length) process.exitCode = 1
