import { expect, type Page, test } from '@playwright/test'
import { enJson, openApp } from '../_utils'

let _page: Page

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext()
  _page = await context.newPage()
  await openApp(_page)
})

test.describe('HTML', () => {
  test('has title', async () => await expect(_page).toHaveTitle(enJson.core.label.appTitle))
})
