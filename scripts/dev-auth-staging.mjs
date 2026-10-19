import { spawn } from 'node:child_process'
import { request } from 'node:http'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export function inspectDevService(port, service, path = '/') {
  return new Promise(resolve => {
    const probe = request({ hostname: '127.0.0.1', port, path, agent: false, headers: { Host: '127.0.0.1:5293' }, timeout: 2000 }, response => {
      response.resume()
      resolve(response.headers['x-khonnai-dev-service'] === service ? 'ours' : 'other')
    })
    probe.on('timeout', () => probe.destroy())
    probe.on('error', error => resolve(error.code === 'ECONNREFUSED' ? 'free' : 'other'))
    probe.end()
  })
}

async function main() {
  const [frontend, api] = await Promise.all([
    inspectDevService(5293, 'frontend'),
    inspectDevService(5294, 'auth-api', '/api/auth/session'),
  ])
  if (frontend === 'ours' && api === 'ours') {
    console.log('Khonnai Auth is already running: http://127.0.0.1:5293/auth')
    console.log('Reusing the existing services. No additional server was started.')
    return
  }
  if (frontend !== 'free' || api !== 'free') {
    const ports = [frontend !== 'free' && 5293, api !== 'free' && 5294].filter(Boolean).join(', ')
    console.error(`Cannot start Khonnai Auth: port(s) ${ports} are already in use. Stop the original server terminal before retrying. No processes were stopped.`)
    process.exitCode = 1
    return
  }
  const children = [
    spawn(process.execPath, ['server/main.ts'], { stdio: 'inherit', windowsHide: true }),
    spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5293', '--strictPort'], { stdio: 'inherit', windowsHide: true }),
  ]
  let closing = false
  function shutdown(code = 0) {
    if (closing) return
    closing = true
    children.forEach(child => child.kill())
    process.exitCode = code
  }
  for (const child of children) {
    child.on('error', () => { console.error('Could not launch a local Auth development process.'); shutdown(1) })
    child.on('exit', code => shutdown(code ?? 0))
  }
  process.on('SIGINT', () => shutdown())
  process.on('SIGTERM', () => shutdown())
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(() => { console.error('Could not inspect local Auth ports. No server was started.'); process.exitCode = 1 })
}
