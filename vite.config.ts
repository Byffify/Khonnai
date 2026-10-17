import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'khonnai-landing-routes',
      configureServer(server) {
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
