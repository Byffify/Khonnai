import http from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
const root = process.cwd()
const types = { '.html': 'text/html; charset=utf-8', '.ttf': 'font/ttf', '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.webm':'video/webm' }
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  if (url.pathname === '/') { res.writeHead(302, { Location: 'http://127.0.0.1:5198/' }); res.end(); return }
  const asset = /^\/(fonts|brand)\//.test(url.pathname) || url.pathname === '/icons.svg'
  const base = path.resolve(root, asset ? 'public' : '.scratch/landing-v2-prototypes')
  const target = path.resolve(base, '.' + decodeURIComponent(url.pathname))
  if (!target.startsWith(base + path.sep)) { res.writeHead(403); res.end(); return }
  try { const bytes = await readFile(target); res.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); res.end(bytes) }
  catch { res.writeHead(404); res.end('Not found') }
}).listen(5288, '127.0.0.1', () => console.log('Prototype preview http://127.0.0.1:5288/index.html'))
