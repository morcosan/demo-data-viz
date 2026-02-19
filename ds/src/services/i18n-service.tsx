'use client'

import { createContext, useContext, useMemo } from 'react'

/**
 * Context
 */
type TranslateFn = (key: string, params?: Record<string, any>) => string
type Store = {
  translate: TranslateFn
  loading?: boolean
}
const Context = createContext<Store>({
  translate: (key: string) => key,
  loading: false,
})
const useI18nService = () => useContext(Context)

/**
 * Provider
 */
interface Props extends ReactProps {
  translate: TranslateFn
  loading?: boolean
}

const I18nService = ({ translate, loading, children }: Props) => {
  const store: Store = useMemo(
    () => ({
      translate,
      loading,
    }),
    [translate, loading],
  )

  return <Context.Provider value={store}>{children}</Context.Provider>
}

/**
 * Export
 */
/* eslint-disable react-refresh/only-export-components */
export { I18nService, useI18nService }
