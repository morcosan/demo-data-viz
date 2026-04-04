import { EurostatConfig, type JsonStatData } from '@app/shared/utils/json-stat'
import { deleteUrlParam, getUrlParam, getUrlParamArray, setUrlParam } from '@app/shared/utils/url-query'
import { create } from 'zustand'
import { UrlKey } from '../_types'

interface TableStore {
  ready: boolean
  indexKey: string
  pivotKey: string
  pivotQueries: string[]
  filterByCol: Record<string, string>
  initTableStore: (data: JsonStatData) => Promise<void>
  resetPivotQueries: (data: JsonStatData) => Promise<void>
  setIndexKey: (value: string | null) => void
  setPivotKey: (value: string | null) => void
  setPivotQueries: (value: string[]) => void
  setFilterByCol: (value: string | null, key: string) => void
}

const useTableStore = create<TableStore>((set) => ({
  ready: false,
  indexKey: '',
  pivotKey: '',
  pivotQueries: [],
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

    const pivotQueries = getUrlParamArray(UrlKey.PIVOT_QUERIES) || computePivotQueries(pivotKey)

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
    setUrlParam(UrlKey.PIVOT_QUERIES, pivotQueries)
    Object.entries(filterByCol).forEach(([key, value]) => setUrlParam(UrlKey.PREFIX + key, value))
    set({ indexKey, pivotKey, pivotQueries, filterByCol, ready: true })
  },

  resetPivotQueries: async (data: JsonStatData) => {
    if (data.source !== 'eurostat') return

    set((state) => {
      if (!state.ready) return {}
      const pivotQueries = getUrlParamArray(UrlKey.PIVOT_QUERIES) || computePivotQueries(state.pivotKey)
      setUrlParam(UrlKey.PIVOT_QUERIES, pivotQueries)
      return { pivotQueries }
    })
  },

  setIndexKey: (value: string | null) => {
    setUrlParam(UrlKey.INDEX_KEY, value || '')
    set({ indexKey: value || '' })
  },
  setPivotKey: (value: string | null) => {
    setUrlParam(UrlKey.PIVOT_KEY, value || '')
    deleteUrlParam(UrlKey.PIVOT_QUERIES) // Recompute queries when changing pivot key
    set({ pivotKey: value || '' })
  },
  setPivotQueries: (value: string[]) => {
    setUrlParam(UrlKey.PIVOT_QUERIES, value)
    set({ pivotQueries: value })
  },
  setFilterByCol: (value: string | null, key: string) => {
    setUrlParam(UrlKey.PREFIX + key, value || '')
    set((state) => ({ filterByCol: { ...state.filterByCol, [key]: value || '' } }))
  },
}))

const computePivotQueries = (pivotKey: string) => {
  const currentYear = new Date().getFullYear()
  const timeQuery = [String(currentYear - 1), String(currentYear)]
  return pivotKey === EurostatConfig.TIME_KEY ? timeQuery : []
}

export { useTableStore }
