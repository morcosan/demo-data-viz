'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { type ColorTheme } from '../styling/tokens/index'
import { darkThemeTokens, lightThemeTokens, type ThemeTokens } from './_partials/theme-config'

/**
 * Constants
 */
const ATTR_KEY__COLOR_THEME = 'data-color-theme'
const MEDIA_QUERY_DARK = '(prefers-color-scheme: dark)'
const COLOR_THEMES: ColorTheme[] = ['light', 'dark']

/**
 * Context
 */
interface Store extends ThemeTokens {
  colorTheme: ColorTheme
  isUiDark: boolean
  isUiLight: boolean
  changeColorTheme(theme: ColorTheme): void
}
const Context = createContext<Store>({
  ...lightThemeTokens,
  colorTheme: 'light',
  isUiDark: false,
  isUiLight: true,
  changeColorTheme() {},
})
const useThemeService = () => useContext(Context)

/**
 * Provider
 */
interface Props extends ReactProps {
  cookieKey: string
  colorTheme?: ColorTheme
}

const ThemeService = (props: Props) => {
  const [colorTheme, setColorTheme] = useState<ColorTheme>('light')
  const [tokens, setTokens] = useState<ThemeTokens>(lightThemeTokens)

  const isUiDark = colorTheme === 'dark'
  const isUiLight = colorTheme === 'light'

  const setHtmlAttr = (theme: ColorTheme) => document.documentElement.setAttribute(ATTR_KEY__COLOR_THEME, theme)
  const setCookie = (theme: ColorTheme) => localStorage.setItem(props.cookieKey, theme)
  const getCookie = () => localStorage.getItem(props.cookieKey) as ColorTheme | null

  const changeUiTheme = (theme: ColorTheme) => {
    setCookie(theme)
    setHtmlAttr(theme)
    setColorTheme(theme)
    setTokens(theme === 'light' ? lightThemeTokens : darkThemeTokens)
  }

  useEffect(() => {
    if (props.colorTheme) {
      changeUiTheme(props.colorTheme)
      return
    }

    const theme = getCookie()

    if (theme && COLOR_THEMES.includes(theme)) {
      changeUiTheme(theme)
    } else {
      changeUiTheme(window.matchMedia(MEDIA_QUERY_DARK).matches ? 'dark' : 'light')
    }
  }, [])

  useEffect(() => {
    props.colorTheme && changeUiTheme(props.colorTheme)
  }, [props.colorTheme])

  const store: Store = useMemo(
    () => ({ ...tokens, colorTheme: colorTheme, isUiDark, isUiLight, changeColorTheme: changeUiTheme }),
    [tokens, colorTheme, isUiDark, isUiLight, changeUiTheme],
  )

  return <Context.Provider value={store}>{props.children}</Context.Provider>
}

/**
 * Export
 */
// eslint-disable-next-line react-refresh/only-export-components
export { ATTR_KEY__COLOR_THEME, ThemeService, useThemeService }
