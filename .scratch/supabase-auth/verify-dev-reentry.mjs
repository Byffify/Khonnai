import { spawnSync } from 'node:child_process'
import assert from 'node:assert/strict'
const result=spawnSync(process.execPath,['scripts/dev-auth-staging.mjs'],{encoding:'utf8',timeout:8000,windowsHide:true})
assert.equal(result.status,0,'Starting auth:dev twice must reuse the verified local services')
assert.match(result.stdout,/already running.*http:\/\/127\.0\.0\.1:5293\/auth/i)
console.log('PASS: repeat auth:dev recognizes the existing Khonnai services and exits successfully')
