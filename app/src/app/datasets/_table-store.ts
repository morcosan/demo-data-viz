import { EurostatConfig, type JsonStatData } from '@app/shared/utils/json-stat'
import { getUrlParam, setUrlParam } from '@app/shared/utils/url-query'
import { create } from 'zustand'

interface TableStore {
  indexKey: string
  pivotKey: string
  filterByCol: Record<string, string>
  colQuery: string[]
  initTableStore: (data: JsonStatData) => Promise<void>
  resetColQuery: (data: JsonStatData) => Promise<void>
  setIndexKey: (value: string | null) => void
  setPivotKey: (value: string | null) => void
  setColQuery: (value: string[]) => void
  setFilterByCol: (value: string | null, key: string) => void
}

const useTableStore = create<TableStore>((set) => ({
  indexKey: '',
  pivotKey: '',
  filterByCol: {},
  colQuery: [],

  initTableStore: async (data: JsonStatData) => {
    if (data.source !== 'eurostat') return

    const { DEFAULT_INDEX_KEY, DEFAULT_PIVOT_KEY, DEFAULT_FILTERS } = EurostatConfig
    const colQuery = getUrlParam<string[]>(UrlKey.COL_QUERY) || []

    const defaultIndexKey = data.cellsByCol[DEFAULT_INDEX_KEY] ? DEFAULT_INDEX_KEY : ''
    const defaultPivotKey = data.cellsByCol[DEFAULT_PIVOT_KEY] ? DEFAULT_PIVOT_KEY : ''
    let indexKey = getUrlParam<string>(UrlKey.INDEX_KEY)
    let pivotKey = getUrlParam<string>(UrlKey.PIVOT_KEY)
    indexKey = indexKey !== null && (indexKey === '' || data.cellsByCol[indexKey]) ? indexKey : defaultIndexKey
    pivotKey = pivotKey !== null && (pivotKey === '' || data.cellsByCol[pivotKey]) ? pivotKey : defaultPivotKey

    const getDefaultFilter = (key: string) => {
      const defaultCode = DEFAULT_FILTERS[key as keyof typeof DEFAULT_FILTERS]
      const cell = defaultCode
        ? data.cellsByCol[key]?.find((cell) => cell.code === defaultCode)
        : data.cellsByCol[key]?.[0]
      return String(cell?.code ?? '')
    }
    const filterByCol = Object.keys(data.cellsByCol).reduce(
      (acc, key) => {
        const code = getUrlParam<string>(UrlKey.PREFIX + key)
        const isValid = code !== null && data.cellsByCol[key]?.some((cell) => String(cell.code) === code)
        return { ...acc, [key]: isValid ? code : getDefaultFilter(key) }
      },
      {} as Record<string, string>,
    )

    setUrlParam(UrlKey.INDEX_KEY, indexKey)
    setUrlParam(UrlKey.PIVOT_KEY, pivotKey)
    setUrlParam(UrlKey.COL_QUERY, colQuery)
    Object.entries(filterByCol).forEach(([key, value]) => setUrlParam(UrlKey.PREFIX + key, value))
    set({ indexKey, pivotKey, colQuery, filterByCol })
  },

  resetColQuery: async (data: JsonStatData) => {
    if (data.source !== 'eurostat') return

    const currentYear = new Date().getFullYear()
    const timeQuery = [String(currentYear - 1), String(currentYear)]

    set((state) => {
      const colQuery = state.pivotKey === EurostatConfig.TIME_KEY ? timeQuery : []
      setUrlParam(UrlKey.COL_QUERY, colQuery)
      return { colQuery }
    })
  },

  setIndexKey: (value: string | null) => {
    setUrlParam(UrlKey.INDEX_KEY, value || '')
    set({ indexKey: value || '' })
  },
  setPivotKey: (value: string | null) => {
    setUrlParam(UrlKey.PIVOT_KEY, value || '')
    set({ pivotKey: value || '' })
  },
  setColQuery: (value: string[]) => {
    setUrlParam(UrlKey.COL_QUERY, value)
    set({ colQuery: value })
  },
  setFilterByCol: (value: string | null, key: string) => {
    setUrlParam(UrlKey.PREFIX + key, value || '')
    set((state) => ({ filterByCol: { ...state.filterByCol, [key]: value || '' } }))
  },
}))

const UrlKey = {
  INDEX_KEY: 'indexKey',
  PIVOT_KEY: 'pivotKey',
  COL_QUERY: 'colQuery',
  PREFIX: '_',
} as const

export { UrlKey, useTableStore }
