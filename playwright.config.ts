import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests', testMatch: '**/browser.spec.ts', workers: 1,
  use: { baseURL: 'http://127.0.0.1:5199', viewport: { width: 390, height: 844 }, acceptDownloads: true },
  webServer: { command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5199 --strictPort', url: 'http://127.0.0.1:5199', reuseExistingServer: false },
})
