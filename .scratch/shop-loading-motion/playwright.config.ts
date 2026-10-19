import { fileURLToPath } from 'node:url'
import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: '../../tests',
  testMatch: 'shop-loading.spec.ts',
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:5296', viewport: { width: 390, height: 844 } },
  webServer: {
    cwd: fileURLToPath(new URL('../../', import.meta.url)),
    command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5296 --strictPort',
    url: 'http://127.0.0.1:5296',
    reuseExistingServer: false,
  },
})
