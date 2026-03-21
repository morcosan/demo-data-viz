import { EurostatConfig, type JsonStatData } from '@app/shared/utils/json-stat'
import { deleteUrlParam, getUrlParam, getUrlParamArray, setUrlParam } from '@app/shared/utils/url-query'
import { create } from 'zustand'

interface TableStore {
  indexKey: string
  pivotKey: string
  pivotQuery: string[]
  filterByCol: Record<string, string>
  initTableStore: (data: JsonStatData) => Promise<void>
  resetColQuery: (data: JsonStatData) => Promise<void>
  setIndexKey: (value: string | null) => void
  setPivotKey: (value: string | null) => void
  setPivotQuery: (value: string[]) => void
  setFilterByCol: (value: string | null, key: string) => void
}

const useTableStore = create<TableStore>((set) => ({
  indexKey: '',
  pivotKey: '',
  pivotQuery: [],
  filterByCol: {},

  initTableStore: async (data: JsonStatData) => {
    if (data.source !== 'eurostat') return

    const { DEFAULT_INDEX_KEY, DEFAULT_PIVOT_KEY, DEFAULT_FILTERS } = EurostatConfig

    const defaultIndexKey = data.cellsByCol[DEFAULT_INDEX_KEY] ? DEFAULT_INDEX_KEY : ''
    const defaultPivotKey = data.cellsByCol[DEFAULT_PIVOT_KEY] ? DEFAULT_PIVOT_KEY : ''
    let indexKey = getUrlParam(UrlKey.INDEX_KEY)
    let pivotKey = getUrlParam(UrlKey.PIVOT_KEY)
    indexKey = indexKey !== null && (indexKey === '' || data.cellsByCol[indexKey]) ? indexKey : defaultIndexKey
    pivotKey = pivotKey !== null && (pivotKey === '' || data.cellsByCol[pivotKey]) ? pivotKey : defaultPivotKey

    const pivotQuery = getUrlParamArray(UrlKey.PIVOT_QUERY) || computePivotQuery(pivotKey)

    const getDefaultFilter = (key: string) => {
      const defaultCode = DEFAULT_FILTERS[key as keyof typeof DEFAULT_FILTERS]
      const cell = defaultCode
        ? data.cellsByCol[key]?.find((cell) => cell.code === defaultCode)
        : data.cellsByCol[key]?.[0]
      return String(cell?.code ?? '')
    }
    const filterByCol = Object.keys(data.cellsByCol).reduce(
      (acc, key) => {
        const code = getUrlParam(UrlKey.PREFIX + key)
        const isValid = code !== null && data.cellsByCol[key]?.some((cell) => String(cell.code) === code)
        return { ...acc, [key]: isValid ? code : getDefaultFilter(key) }
      },
      {} as Record<string, string>,
    )

    setUrlParam(UrlKey.INDEX_KEY, indexKey)
    setUrlParam(UrlKey.PIVOT_KEY, pivotKey)
    setUrlParam(UrlKey.PIVOT_QUERY, pivotQuery)
    Object.entries(filterByCol).forEach(([key, value]) => setUrlParam(UrlKey.PREFIX + key, value))
    set({ indexKey, pivotKey, pivotQuery, filterByCol })
  },

  resetColQuery: async (data: JsonStatData) => {
    if (data.source !== 'eurostat') return

    set((state) => {
      const pivotQuery = getUrlParamArray(UrlKey.PIVOT_QUERY) || computePivotQuery(state.pivotKey)
      setUrlParam(UrlKey.PIVOT_QUERY, pivotQuery)
      return { pivotQuery }
    })
  },

  setIndexKey: (value: string | null) => {
    setUrlParam(UrlKey.INDEX_KEY, value || '')
    set({ indexKey: value || '' })
  },
  setPivotKey: (value: string | null) => {
    setUrlParam(UrlKey.PIVOT_KEY, value || '')
    deleteUrlParam(UrlKey.PIVOT_QUERY) // Recompute query when changing pivot key
    set({ pivotKey: value || '' })
  },
  setPivotQuery: (value: string[]) => {
    setUrlParam(UrlKey.PIVOT_QUERY, value)
    set({ pivotQuery: value })
  },
  setFilterByCol: (value: string | null, key: string) => {
    setUrlParam(UrlKey.PREFIX + key, value || '')
    set((state) => ({ filterByCol: { ...state.filterByCol, [key]: value || '' } }))
  },
}))

const computePivotQuery = (pivotKey: string) => {
  const currentYear = new Date().getFullYear()
  const timeQuery = [String(currentYear - 1), String(currentYear)]
  return pivotKey === EurostatConfig.TIME_KEY ? timeQuery : []
}

const UrlKey = {
  INDEX_KEY: 'indexKey',
  PIVOT_KEY: 'pivotKey',
  PIVOT_QUERY: 'pivotQuery',
  PREFIX: '_',
} as const

export { UrlKey, useTableStore }
