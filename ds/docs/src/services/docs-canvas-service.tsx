import { createContext, useContext, useMemo } from 'react'

/**
 * Context
 */
type DocsCanvasBg = 'tiles' | 'grid' | 'blank'
type Store = {
  canvasBg: DocsCanvasBg
  canvasBgClass: string
}
const Context = createContext<Store>({
  canvasBg: 'grid',
  canvasBgClass: '',
})
const useDocsCanvasService = () => useContext(Context)

/**
 * Provider
 */
interface Props extends ReactProps {
  canvasBg: DocsCanvasBg
}

const DocsCanvasService = ({ children, canvasBg }: Props) => {
  const canvasBgClass = cx({
    'docs-bg docs-bg-tiles': canvasBg === 'tiles',
    'docs-bg docs-bg-grid': canvasBg === 'grid',
    'docs-bg docs-bg-blank': canvasBg === 'blank',
  })
  const store: Store = useMemo(() => ({ canvasBgClass, canvasBg }), [canvasBg, canvasBgClass])

  return <Context.Provider value={store}>{children}</Context.Provider>
}

/**
 * Export
 */
/* eslint-disable react-refresh/only-export-components */
export { DocsCanvasService, useDocsCanvasService, type DocsCanvasBg }
