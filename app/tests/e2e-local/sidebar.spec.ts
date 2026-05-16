import { type ColorTheme } from '@ds/core'
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
  const expectTheme = async (theme: ColorTheme) => {
    return expect(_page.locator('html')).toHaveAttribute('data-color-theme', theme)
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
    const toggle = _page.getByTestId('theme-toggle')
    lightButton = toggle.locator('button', { hasText: enJson.core.label.themeLight })
    darkButton = toggle.locator('button', { hasText: enJson.core.label.themeDark })
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

  test('opens as light theme', async () => {
    await expectTheme('light')
  })

  test('opens as light theme when "prefers-color-scheme: light"', async ({ browser }) => {
    await _page.context().close()
    const context = await browser.newContext({ colorScheme: 'light' })
    _page = await context.newPage()
    await _page.goto('/')
    await expectTheme('light')
  })

  test('opens as dark theme when "prefers-color-scheme: dark"', async ({ browser }) => {
    await _page.context().close()
    const context = await browser.newContext({ colorScheme: 'dark' })
    _page = await context.newPage()
    await _page.goto('/')
    await expectTheme('dark')
  })

  test('can change color theme', async () => {
    await openSettingsMenu()
    await darkButton.click()
    await expectTheme('dark')
    await lightButton.click()
    await expectTheme('light')
  })

  test('can change color theme and persist on refresh', async () => {
    await openSettingsMenu()
    await darkButton.click()
    await expectTheme('dark')
    await _page.reload()
    await expectTheme('dark')
    await openSettingsMenu()
    await lightButton.click()
    await expectTheme('light')
    await _page.reload()
    await expectTheme('light')
  })
})
