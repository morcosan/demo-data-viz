import { defineConfig, devices } from '@playwright/test'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { initEnv } from '../scripts/env.ts'

initEnv()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ROOT_DIR = path.resolve(__dirname, '..')
const OUT_DIR = process.env.LOCAL__E2E_LOCAL_OUT_DIR || ''
const IS_PIPELINE = process.env.CI // Set "true" by GitHub Actions
const IS_UI_MODE = process.argv.includes('--ui')
const SERVER_PORT = process.env.LOCAL__APP_PORT || 0
const SERVER_CMD = IS_UI_MODE ? 'pnpm app--dev' : 'pnpm app--preview'

export default defineConfig({
  testDir: path.resolve(__dirname, './e2e-local'),
  tsconfig: path.resolve(ROOT_DIR, 'tsconfig-tests.json'),
  outputDir: path.resolve(ROOT_DIR, 'node_modules/.tmp/playwright-test-results'),
  fullyParallel: true,
  forbidOnly: Boolean(IS_PIPELINE),
  timeout: IS_PIPELINE ? 30_000 : 10_000,
  expect: { timeout: IS_PIPELINE ? 5000 : 2000 },
  retries: IS_PIPELINE ? 2 : 0,
  workers: IS_PIPELINE ? 1 : undefined, // Needed for stability in CI/CD
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  reporter: [
    [
      'html',
      {
        outputFolder: path.resolve(ROOT_DIR, OUT_DIR),
        open: IS_PIPELINE || IS_UI_MODE ? 'never' : 'always',
      },
    ],
  ],
  use: {
    baseURL: `http://localhost:${SERVER_PORT}`,
    trace: 'on-first-retry',
  },
  webServer: {
    command: SERVER_CMD,
    url: `http://localhost:${SERVER_PORT}`,
    reuseExistingServer: true,
    stdout: 'pipe', // But doesn't work in dev UI
    stderr: 'pipe', // But doesn't work in dev UI
  },
})
