import { defineConfig, devices } from '@playwright/test'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { initEnv } from '../scripts/env.ts'

initEnv()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const OUT_DIR = process.env.LOCAL__E2E_LIVE_OUT_DIR || ''
const IS_PIPELINE = process.env.CI // Set "true" by GitHub Actions
const BASE_URL = process.env.PUBLIC__BASE_URL || ''
const BASE_PATH = process.env.PUBLIC__BASE_PATH || ''
const ROOT_DIR = path.resolve(__dirname, '..')

export default defineConfig({
  testDir: path.resolve(__dirname, './e2e-live'),
  tsconfig: path.resolve(ROOT_DIR, './tsconfig-tests.json'),
  outputDir: path.resolve(ROOT_DIR, 'node_modules/.tmp/playwright-test-results'),
  fullyParallel: true,
  forbidOnly: Boolean(IS_PIPELINE),
  timeout: 30_000,
  expect: { timeout: 5000 },
  retries: IS_PIPELINE ? 2 : 0,
  workers: IS_PIPELINE ? 1 : undefined, // Needed for stability in CI/CD
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  reporter: [
    [
      'html',
      {
        outputFolder: path.resolve(ROOT_DIR, OUT_DIR),
        open: IS_PIPELINE ? 'never' : 'always',
      },
    ],
  ],
  use: {
    baseURL: BASE_URL + BASE_PATH + '/', // Must have trailing slash
    trace: 'on-first-retry',
  },
})
