import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api/auth': { target: 'http://127.0.0.1:5294', changeOrigin: false },
      '/api/inventory': { target: 'http://127.0.0.1:5294', changeOrigin: false },
    },
  },
  plugins: [
    {
      name: 'khonnai-landing-routes',
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          response.setHeader('X-Khonnai-Dev-Service', 'frontend')
          if (request.url) {
            const [path, query] = request.url.split('?')
            if (/^\/(?:auth|shop)(?:\/|$)/.test(path)) {
              response.setHeader('Cache-Control', 'private, no-store')
              response.setHeader('X-Robots-Tag', 'noindex, nofollow')
              response.setHeader('Referrer-Policy', 'no-referrer')
              response.setHeader('X-Frame-Options', 'DENY')
              response.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' ws://127.0.0.1:5293; frame-ancestors 'none'; base-uri 'none'; form-action 'self'")
            }
            if (path === '/') {
              response.writeHead(307, { Location: '/landing/' + (query ? '?' + query : '') })
              response.end()
              return
            }
            if (/^\/app\/?$/.test(path)) request.url = '/index.html' + (query ? '?' + query : '')
            if (/^\/(?:en\/)?landing\/?$/.test(path)) request.url = path.replace(/\/$/, '') + '/index.html' + (query ? '?' + query : '')
          }
          next()
        })
      },
      configurePreviewServer(server) {
        server.middlewares.use((request, response, next) => {
          if (request.url) {
            const [path, query] = request.url.split('?')
            if (path === '/') {
              response.writeHead(307, { Location: '/landing/' + (query ? '?' + query : '') })
              response.end()
              return
            }
            if (/^\/app\/?$/.test(path)) request.url = '/index.html' + (query ? '?' + query : '')
            if (/^\/(?:en\/)?landing\/?$/.test(path)) request.url = path.replace(/\/$/, '') + '/index.html' + (query ? '?' + query : '')
          }
          next()
        })
      },
    },
    react(), tailwindcss(),
  ],
})
