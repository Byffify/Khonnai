import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { once } from 'node:events'
import { inspectDevService } from '../scripts/dev-auth-staging.mjs'

test('Auth launcher recognizes its service without assuming every occupied port is Khonnai', async () => {
  const server = createServer((request,response) => {
    if (request.url === '/owned') response.setHeader('X-Khonnai-Dev-Service','auth-api')
    response.end('ok')
  })
  server.listen(0,'127.0.0.1')
  await once(server,'listening')
  const port = server.address().port
  try {
    assert.equal(await inspectDevService(port,'auth-api','/owned'),'ours')
    assert.equal(await inspectDevService(port,'frontend','/owned'),'other')
    assert.equal(await inspectDevService(port,'auth-api','/foreign'),'other')
  } finally { await new Promise(resolve => server.close(resolve)) }
  assert.equal(await inspectDevService(port,'auth-api'),'free')
})
