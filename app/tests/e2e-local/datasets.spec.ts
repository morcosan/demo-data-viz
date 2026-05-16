// noinspection DuplicatedCode

import { expect, type Page, test } from '@playwright/test'
import { enJson, openApp, TEST_DATASET_INDEX, TIMEOUT } from '../_utils'

let _page: Page

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext()
  _page = await context.newPage()
  await openApp(_page)
})

test.describe('Dataset page', () => {
  const openDatasetPage = async () => {
    const sidebar = _page.getByTestId('sidebar')
    const link = sidebar.locator('a', { hasText: enJson.appNav.label.datasets })
    await link.click()
    return _page.getByTestId('dataset-listing')
  }

  test('has dataset listing', async () => {
    const listing = await openDatasetPage()
    await expect(listing.locator('a').first()).toBeVisible({ timeout: TIMEOUT.DATASET_LISTING })
  })

  test('can open dataset details', async () => {
    const listing = await openDatasetPage()
    await listing.locator('a').nth(TEST_DATASET_INDEX).click({ timeout: TIMEOUT.DATASET_LISTING })
    const details = _page.getByTestId('dataset-details')
    await expect(details.locator('h2').first()).toBeVisible({ timeout: TIMEOUT.DATASET_DETAILS })
  })
})
