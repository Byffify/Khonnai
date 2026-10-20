import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'

const root = resolve('outputs/hero-phone-concept')
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.woff2':'font/woff2', '.mp4':'video/mp4', '.webm':'video/webm', '.json':'application/json' }
createServer(async (request,response) => {
  const url = new URL(request.url, 'http://127.0.0.1:5308')
  if (url.pathname === '/app' || url.pathname.startsWith('/landing')) {
    response.writeHead(302,{Location:`http://127.0.0.1:5307${url.pathname}${url.search}`}); response.end(); return
  }
  const path = resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname))
  if (!path.startsWith(root + sep)) { response.writeHead(403); response.end(); return }
  try {
    const body = await readFile(path)
    const size = (await stat(path)).size
    const headers = { 'Content-Type':types[extname(path)]??'application/octet-stream', 'Accept-Ranges':'bytes', 'Cache-Control':'no-store' }
    const range = request.headers.range?.match(/^bytes=(\d+)-(\d*)$/)
    if(range){
      const start=Number(range[1]),end=range[2]?Math.min(Number(range[2]),size-1):size-1
      if(start>end||start>=size){response.writeHead(416,{'Content-Range':`bytes */${size}`});response.end();return}
      response.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1})
      response.end(body.subarray(start,end+1));return
    }
    response.writeHead(200,{...headers,'Content-Length':size});response.end(body)
  } catch { response.writeHead(404);response.end('Not found') }
}).listen(5308,'127.0.0.1',()=>console.log('Hero preview: http://127.0.0.1:5308/'))
