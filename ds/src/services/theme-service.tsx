'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { type ColorMode, type ColorTheme } from '../styles/tokens'
import { darkModeTokens, lightModeTokens, type ThemeTokens } from './_partials/theme-config'

/**
 * Constants
 */
const ATTR_KEY__COLOR_THEME = 'data-color-theme'
const ATTR_KEY__COLOR_MODE = 'data-color-mode'
const MEDIA_QUERY_DARK = '(prefers-color-scheme: dark)'
const COLOR_THEMES: ColorMode[] = ['light', 'dark']

/**
 * Context
 */
interface Store {
  tokens: ThemeTokens
  colorMode: ColorMode
  colorTheme: ColorTheme
  isUiDark: boolean
  isUiLight: boolean
  changeColorMode(mode: ColorMode): void
}
const Context = createContext<Store>({
  tokens: lightModeTokens,
  colorMode: 'light',
  colorTheme: 'simple',
  isUiDark: false,
  isUiLight: true,
  changeColorMode() {},
})
const useThemeService = () => useContext(Context)

/**
 * Provider
 */
interface Props extends ReactProps {
  cookieKeyMode: string
  cookieKeyTheme: string
  colorMode?: ColorMode
}

const ThemeService = (props: Props) => {
  const { colorMode: colorModeProp, cookieKeyMode, cookieKeyTheme, children } = props
  const [colorMode, setColorMode] = useState<ColorMode>('light')
  const [colorTheme, setColorTheme] = useState<ColorTheme>('simple')
  const [tokens, setTokens] = useState<ThemeTokens>(lightModeTokens)

  const isUiDark = colorMode === 'dark'
  const isUiLight = colorMode === 'light'

  const setModeHtmlAttr = (mode: ColorMode) => document.documentElement.setAttribute(ATTR_KEY__COLOR_MODE, mode)
  const setModeCookie = (mode: ColorMode) => localStorage.setItem(cookieKeyMode, mode)
  const getModeCookie = () => localStorage.getItem(cookieKeyMode) as ColorMode | null

  const setThemeHtmlAttr = (mode: ColorTheme) => document.documentElement.setAttribute(ATTR_KEY__COLOR_THEME, mode)
  const setThemeCookie = (mode: ColorTheme) => localStorage.setItem(cookieKeyTheme, mode)
  const getThemeCookie = () => localStorage.getItem(cookieKeyTheme) as ColorTheme | null

  const changeColorMode = (mode: ColorMode) => {
    setModeCookie(mode)
    setModeHtmlAttr(mode)
    setColorMode(mode)
    setTokens(mode === 'light' ? lightModeTokens : darkModeTokens)
  }

  useEffect(() => {
    if (colorModeProp) {
      changeColorMode(colorModeProp)
      return
    }

    const mode = getModeCookie()

    if (mode && COLOR_THEMES.includes(mode)) {
      changeColorMode(mode)
    } else {
      changeColorMode(window.matchMedia(MEDIA_QUERY_DARK).matches ? 'dark' : 'light')
    }
  }, [])

  useEffect(() => {
    colorModeProp && changeColorMode(colorModeProp)
  }, [colorModeProp])

  const store: Store = useMemo(
    () => ({ tokens, colorMode, colorTheme, isUiDark, isUiLight, changeColorMode }),
    [tokens, colorMode, colorTheme, isUiDark, isUiLight, changeColorMode],
  )

  return <Context.Provider value={store}>{children}</Context.Provider>
}

/**
 * Export
 */
// eslint-disable-next-line react-refresh/only-export-components
export { ATTR_KEY__COLOR_MODE, ATTR_KEY__COLOR_THEME, ThemeService, useThemeService }
export type { ThemeTokens }
