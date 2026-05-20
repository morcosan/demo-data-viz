import { type ColorMode } from '@ds/core'
import { expect, test, type Locator, type Page } from '@playwright/test'
import { enJson, openApp } from '../_utils'

let _page: Page

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext()
  _page = await context.newPage()
  await openApp(_page)
})

test.describe('Sidebar', () => {
  let sidebar: Locator
  let pinButton: Locator
  let lightButton: Locator
  let darkButton: Locator
  const SIDEBAR_WIDTH = 100
  const expectMode = async (mode: ColorMode) => {
    return expect(_page.locator('html')).toHaveAttribute('data-color-mode', mode)
  }
  const getSidebarWidth = () => sidebar.evaluate((el) => el.getBoundingClientRect().width)
  const expectCollapsed = () => expect.poll(getSidebarWidth).toBeLessThan(SIDEBAR_WIDTH)
  const expectExpanded = () => expect.poll(getSidebarWidth).toBeGreaterThan(SIDEBAR_WIDTH)
  const collapseSidebar = () => pinButton.click()
  const expandSidebar = async () => {
    await sidebar.hover()
    await pinButton.click()
  }
  const openSettingsMenu = async () => {
    const button = _page.getByTestId('settings-button')
    const menu = _page.getByTestId('settings-menu')
    const isMenuOpen = await menu.isVisible()
    !isMenuOpen && (await button.click())
  }

  test.beforeEach(async () => {
    sidebar = _page.getByTestId('sidebar')
    pinButton = _page.getByTestId('pin-button')
    const toggle = _page.getByTestId('color-mode-toggle')
    lightButton = toggle.locator('button', { hasText: enJson.core.label.modeLight })
    darkButton = toggle.locator('button', { hasText: enJson.core.label.modeDark })
  })

  test('has logo', async () => {
    const logo = _page.getByTestId('app-logo')
    await expect.soft(logo).toBeVisible()
    await expect.soft(logo.locator('svg')).toBeVisible()
    await expect.soft(logo.locator('span')).toHaveText(enJson.core.label.appTitle)
  })

  test('is expanded by default', async () => {
    await expect(sidebar).toBeVisible()
    await expectExpanded()
  })

  test('can expand/collapse', async () => {
    await collapseSidebar()
    await expectCollapsed()
    await expandSidebar()
    await expectExpanded()
  })

  test('can expand/collapse and persist on refresh', async () => {
    await collapseSidebar()
    await expectCollapsed()
    await _page.reload()
    await expectCollapsed()
    await expandSidebar()
    await expectExpanded()
    await _page.reload()
    await expectExpanded()
  })

  test('can toggle settings menu', async () => {
    const button = _page.getByTestId('settings-button')
    const menu = _page.getByTestId('settings-menu')
    const isMenuOpen = await menu.isVisible()
    if (isMenuOpen) {
      await button.click()
      await expect(menu).not.toBeVisible()
      await button.click()
      await expect(menu).toBeVisible()
    } else {
      await button.click()
      await expect(menu).toBeVisible()
      await button.click()
      await expect(menu).not.toBeVisible()
    }
  })

  test('opens as light color mode', async () => {
    await expectMode('light')
  })

  test('opens as light color mode when "prefers-color-scheme: light"', async ({ browser }) => {
    await _page.context().close()
    const context = await browser.newContext({ colorScheme: 'light' })
    _page = await context.newPage()
    await _page.goto('/')
    await expectMode('light')
  })

  test('opens as dark color mode when "prefers-color-scheme: dark"', async ({ browser }) => {
    await _page.context().close()
    const context = await browser.newContext({ colorScheme: 'dark' })
    _page = await context.newPage()
    await _page.goto('/')
    await expectMode('dark')
  })

  test('can change color mode', async () => {
    await openSettingsMenu()
    await darkButton.click()
    await expectMode('dark')
    await lightButton.click()
    await expectMode('light')
  })

  test('can change color mode and persist on refresh', async () => {
    await openSettingsMenu()
    await darkButton.click()
    await expectMode('dark')
    await _page.reload()
    await expectMode('dark')
    await openSettingsMenu()
    await lightButton.click()
    await expectMode('light')
    await _page.reload()
    await expectMode('light')
  })
})
