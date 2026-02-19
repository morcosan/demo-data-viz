'use client'

import { debounce } from 'lodash'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { type DesignToken, TOKENS__BREAKPOINT } from '../styling/tokens/index'

/**
 * Context
 */
interface Store {
  viewportWidth: number

  isViewportMinXS: boolean
  isViewportMinSM: boolean
  isViewportMinMD: boolean
  isViewportMinLG: boolean
  isViewportMinXL: boolean
  isViewportMinXXL: boolean

  isViewportMaxXS: boolean
  isViewportMaxSM: boolean
  isViewportMaxMD: boolean
  isViewportMaxLG: boolean
  isViewportMaxXL: boolean
  isViewportMaxXXL: boolean

  isViewportXS: boolean
  isViewportSM: boolean
  isViewportMD: boolean
  isViewportLG: boolean
  isViewportXL: boolean
  isViewportXXL: boolean
}
const Context = createContext<Store>({
  viewportWidth: 0,

  isViewportMinXS: false,
  isViewportMinSM: false,
  isViewportMinMD: false,
  isViewportMinLG: false,
  isViewportMinXL: false,
  isViewportMinXXL: false,

  isViewportMaxXS: false,
  isViewportMaxSM: false,
  isViewportMaxMD: false,
  isViewportMaxLG: false,
  isViewportMaxXL: false,
  isViewportMaxXXL: false,

  isViewportXS: false,
  isViewportSM: false,
  isViewportMD: false,
  isViewportLG: false,
  isViewportXL: false,
  isViewportXXL: false,
})
const useViewportService = () => useContext(Context)

/**
 * Provider
 */
const ViewportService = ({ children }: ReactProps) => {
  const [viewportWidth, setViewportWidth] = useState(0)

  const resizeWindow = () => setViewportWidth(window.innerWidth)
  const handleWindowResize = debounce(resizeWindow, 100)

  useEffect(() => {
    resizeWindow()
    window.addEventListener('resize', handleWindowResize, true)
    return () => window.removeEventListener('resize', handleWindowResize, true)
  }, [])

  const breakpoint = Object.fromEntries(
    Object.entries(TOKENS__BREAKPOINT).map(([key, token]: [string, DesignToken]) => [
      key,
      parseInt(token.$value as string),
    ]),
  )

  const store: Store = useMemo(() => {
    const isViewportMinXS = viewportWidth >= breakpoint['xs']
    const isViewportMinSM = viewportWidth >= breakpoint['sm']
    const isViewportMinMD = viewportWidth >= breakpoint['md']
    const isViewportMinLG = viewportWidth >= breakpoint['lg']
    const isViewportMinXL = viewportWidth >= breakpoint['xl']
    const isViewportMinXXL = viewportWidth >= breakpoint['xxl']

    const isViewportMaxXS = viewportWidth < breakpoint['xs']
    const isViewportMaxSM = viewportWidth < breakpoint['sm']
    const isViewportMaxMD = viewportWidth < breakpoint['md']
    const isViewportMaxLG = viewportWidth < breakpoint['lg']
    const isViewportMaxXL = viewportWidth < breakpoint['xl']
    const isViewportMaxXXL = viewportWidth < breakpoint['xxl']

    const isViewportXS = isViewportMinXS && isViewportMaxSM
    const isViewportSM = isViewportMinSM && isViewportMaxMD
    const isViewportMD = isViewportMinMD && isViewportMaxLG
    const isViewportLG = isViewportMinLG && isViewportMaxXL
    const isViewportXL = isViewportMinXL && isViewportMaxXXL
    const isViewportXXL = isViewportMinXXL

    return {
      viewportWidth,

      isViewportMinXS,
      isViewportMinSM,
      isViewportMinMD,
      isViewportMinLG,
      isViewportMinXL,
      isViewportMinXXL,

      isViewportMaxXS,
      isViewportMaxSM,
      isViewportMaxMD,
      isViewportMaxLG,
      isViewportMaxXL,
      isViewportMaxXXL,

      isViewportXS,
      isViewportSM,
      isViewportMD,
      isViewportLG,
      isViewportXL,
      isViewportXXL,
    }
  }, [viewportWidth])

  return <Context.Provider value={store}>{children}</Context.Provider>
}

/**
 * Export
 */
// eslint-disable-next-line react-refresh/only-export-components
export { useViewportService, ViewportService }
