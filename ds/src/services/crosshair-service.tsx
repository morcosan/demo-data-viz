'use client'

import { createContext, useContext, useMemo, useState } from 'react'

/**
 * Context
 */
type Store = {
  enabled: boolean
  setEnabled(value: boolean): void
}
const Context = createContext<Store>({
  enabled: false,
  setEnabled: () => {},
})
const useCrosshairService = () => useContext(Context)

/**
 * Provider
 */
const CrosshairService = ({ children }: ReactProps) => {
  const [enabled, setEnabled] = useState(true)

  const store: Store = useMemo(() => ({ enabled, setEnabled }), [enabled])

  return <Context.Provider value={store}>{children}</Context.Provider>
}

/**
 * Export
 */
/* eslint-disable react-refresh/only-export-components */
export { CrosshairService, useCrosshairService }
