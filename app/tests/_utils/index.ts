import enJson from '@app/core/i18n/translations/en-US.json' with { type: 'json' }
import { type Page } from '@playwright/test'

const TEST_DATASET_INDEX = 7 // Use a small dataset ("Economic sentiment indicator")

const TIMEOUT = {
  DATASET_LISTING: 10_000,
  DATASET_DETAILS: 15_000,
} as const

const openApp = async (page: Page) => {
  await page.goto('./') // Must be local based on base path
  await page.waitForFunction(() => {
    const el = document.querySelector('[data-testid="loading-screen"]')
    return el && getComputedStyle(el).opacity === '0'
  })
}

export { enJson, openApp, TEST_DATASET_INDEX, TIMEOUT }
