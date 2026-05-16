// noinspection DuplicatedCode

import { expect, type Locator, type Page, test } from '@playwright/test'
import { enJson, openApp, TEST_DATASET_INDEX, TIMEOUT } from '../_utils'

let _page: Page

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext()
  _page = await context.newPage()
  await openApp(_page)
})

test.describe('App', () => {
  const openSettingsMenu = async () => {
    const button = _page.getByTestId('settings-button')
    const menu = _page.getByTestId('settings-menu')
    const isMenuOpen = await menu.isVisible()
    !isMenuOpen && (await button.click())
    return menu
  }
  const openNewPage = async (link: Locator) => {
    const [newPage] = await Promise.all([_page.context().waitForEvent('page'), link.click()])
    await newPage.waitForLoadState('networkidle')
    return newPage
  }
  const openDatasetPage = async () => {
    const sidebar = _page.getByTestId('sidebar')
    const link = sidebar.locator('a', { hasText: enJson.appNav.label.datasets })
    await link.click()
    return _page.getByTestId('dataset-listing')
  }

  test('can open DS Storybook page', async () => {
    const menu = await openSettingsMenu()
    const newPage = await openNewPage(menu.locator('a', { hasText: enJson.core.label.dsStorybook }))
    expect(newPage.url()).toContain('/design-system')
    await expect(newPage.frameLocator('iframe').locator('.sb-show-main')).toBeVisible()
  })

  test('can open App Storybook page', async () => {
    const menu = await openSettingsMenu()
    const newPage = await openNewPage(menu.locator('a', { hasText: enJson.core.label.appStorybook }))
    expect(newPage.url()).toContain('/storybook')
    await expect(newPage.frameLocator('iframe').locator('.sb-show-main')).toBeVisible()
  })

  test('can open E2E Tests page', async () => {
    const menu = await openSettingsMenu()
    const newPage = await openNewPage(menu.locator('a', { hasText: enJson.core.label.e2eTests }))
    expect(newPage.url()).toContain('/e2e-tests')
    await expect(newPage.locator('.htmlreport')).toBeVisible()
  })

  test('can open GitHub repo', async () => {
    const repoName = process.env.PUBLIC__BASE_PATH?.replace('/', '')
    if (!repoName) throw new Error('Missing BASE_PATH')
    const menu = await openSettingsMenu()
    const newPage = await openNewPage(menu.locator('a', { hasText: enJson.core.label.githubRepo }))
    expect(newPage.url()).toContain('https://github.com')
    expect(await newPage.content()).toContain(repoName)
  })

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
