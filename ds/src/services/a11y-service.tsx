'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Keyboard } from '../utilities/various-utils'

/**
 * Constants
 */
const ATTR_KEY__A11Y_MODE = 'data-a11y-mode'

/**
 * Context
 */
type A11yMode = 'default' | 'pointer'
type Store = {
  a11yMode: A11yMode
  isPointer: boolean
  forceA11yMode(mode: A11yMode): void
}
const Context = createContext<Store>({
  a11yMode: 'default',
  isPointer: false,
  forceA11yMode: () => {},
})
const useA11yService = () => useContext(Context)

/**
 * Provider
 */
const A11yService = ({ children }: ReactProps) => {
  const [a11yMode, setA11yMode] = useState<A11yMode>('default')

  const forceA11yMode = (mode: A11yMode) => {
    setA11yMode(mode)
    setHtmlAttr(mode)
  }

  const setHtmlAttr = (mode: A11yMode) => document.documentElement.setAttribute(ATTR_KEY__A11Y_MODE, mode)

  const handleWindowMouseDown = (event: MouseEvent) => {
    // NVDA keyboard triggers mousedown with event.detail == 0
    // Standard mousedown has event.detail == 1
    if (event.detail) {
      setA11yMode('pointer')
      setHtmlAttr('pointer')
    }
  }

  const handleWindowKeyDown = (event: KeyboardEvent) => {
    if (event.key === Keyboard.TAB) {
      setA11yMode('default')
      setHtmlAttr('default')
    }
  }

  useEffect(() => {
    window.addEventListener('mousedown', handleWindowMouseDown, true)
    window.addEventListener('keydown', handleWindowKeyDown, true)

    return () => {
      window.removeEventListener('mousedown', handleWindowMouseDown, true)
      window.removeEventListener('keydown', handleWindowKeyDown, true)
    }
  }, [])

  const store: Store = useMemo(
    () => ({
      a11yMode,
      isPointer: a11yMode === 'pointer',
      forceA11yMode,
    }),
    [a11yMode],
  )

  return <Context.Provider value={store}>{children}</Context.Provider>
}

/**
 * Utilities
 */
const isA11yModeDefault = () => {
  return (document.documentElement.getAttribute(ATTR_KEY__A11Y_MODE) as A11yMode) === 'default'
}
const isA11yModePointer = () => {
  return (document.documentElement.getAttribute(ATTR_KEY__A11Y_MODE) as A11yMode) === 'pointer'
}

/**
 * Export
 */
/* eslint-disable react-refresh/only-export-components */
export { A11yService, ATTR_KEY__A11Y_MODE, isA11yModeDefault, isA11yModePointer, useA11yService, type A11yMode }
