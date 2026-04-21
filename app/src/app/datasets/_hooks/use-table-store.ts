import { type SelectOption } from '@app-components'
import { type TableCol, type TableData } from '@app/shared/types/table'
import { EurostatConfig, type JsonStatData, pivotJsonStatTable } from '@app/shared/utils/json-stat'
import { deleteUrlParam, getUrlParam, getUrlParamArray, setUrlParam } from '@app/shared/utils/url-query'
import { create } from 'zustand'
import { UrlKey } from '../_types'

interface TableStore {
  ready: boolean
  indexKey: string
  pivotKey: string
  pivotQueries: string[]
  filterByCol: Record<string, string>
  data?: JsonStatData
  tableData: TableData
  chartData: TableData
  chartValueOptions: SelectOption[]
  chartValueKey: string | null

  initTableStore: (data: JsonStatData) => Promise<void>
  resetPivotQueries: (data: JsonStatData) => Promise<void>
  setIndexKey: (value: string | null) => void
  setPivotKey: (value: string | null) => void
  setPivotQueries: (value: string[]) => void
  setFilterByCol: (value: string | null, key: string) => void
  updateData: (data: JsonStatData) => void
  setChartValueKey: (value: string | null) => void
}

const useTableStore = create<TableStore>((set) => ({
  ready: false,
  indexKey: '',
  pivotKey: '',
  pivotQueries: [],
  filterByCol: {},
  tableData: { cols: [], rows: [] },
  chartData: { cols: [], rows: [] },
  chartValueOptions: [],
  chartValueKey: null,

  initTableStore: async (data: JsonStatData) => {
    if (data.source !== 'eurostat') return

    const { DEFAULT_INDEX_KEYS, DEFAULT_PIVOT_KEYS, DEFAULT_FILTERS } = EurostatConfig

    const defaultIndexKey = DEFAULT_INDEX_KEYS.find((key) => data.cellsByCol[key]) ?? ''
    const defaultPivotKey = DEFAULT_PIVOT_KEYS.find((key) => data.cellsByCol[key]) ?? ''
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
      const newState = { ...state, pivotQueries }
      setUrlParam(UrlKey.PIVOT_QUERIES, pivotQueries)
      return { ...computeAllData(newState, state.data), pivotQueries }
    })
  },

  setIndexKey: (value: string | null) => {
    setUrlParam(UrlKey.INDEX_KEY, value || '')
    set((state) => {
      const newState = { ...state, indexKey: value || '' }
      return { ...computeAllData(newState, state.data), indexKey: value || '' }
    })
  },
  setPivotKey: (value: string | null) => {
    setUrlParam(UrlKey.PIVOT_KEY, value || '')
    deleteUrlParam(UrlKey.PIVOT_QUERIES) // Recompute queries when changing pivot key
    set((state) => {
      const newState = { ...state, pivotKey: value || '' }
      return { ...computeAllData(newState, state.data), pivotKey: value || '' }
    })
  },
  setPivotQueries: (value: string[]) => {
    setUrlParam(UrlKey.PIVOT_QUERIES, value)
    set((state) => {
      const newState = { ...state, pivotQueries: value }
      return { ...computeAllData(newState, state.data), pivotQueries: value }
    })
  },
  setFilterByCol: (value: string | null, key: string) => {
    setUrlParam(UrlKey.PREFIX + key, value || '')
    set((state) => {
      const filterByCol = { ...state.filterByCol, [key]: value || '' }
      const newState = { ...state, filterByCol }
      return { ...computeAllData(newState, state.data), filterByCol }
    })
  },
  updateData: (data: JsonStatData) => {
    set((state) => computeAllData(state, data))
  },
  setChartValueKey: (value: string | null) => {
    set({ chartValueKey: value })
  },
}))

const computePivotQueries = (pivotKey: string) => {
  const currentYear = new Date().getFullYear()
  const timeQuery = [String(currentYear - 1), String(currentYear)]
  return pivotKey === EurostatConfig.TIME_KEY ? timeQuery : []
}

const computeAllData = (state: TableStore, newData?: JsonStatData): Partial<TableStore> => {
  if (!newData) return {}

  const { indexKey, pivotKey, filterByCol, pivotQueries } = state
  const pivotCol = newData.cols.find((col) => col.key === pivotKey)
  const pivotedTableData = pivotJsonStatTable(newData, { indexKey, pivotKey, filterByCol })
  const isColVisible = (col: TableCol) => {
    return !col.pivoted || pivotQueries.some((keyword) => col.label.toLowerCase().includes(keyword))
  }
  const tableData =
    pivotKey && pivotQueries.length
      ? { ...pivotedTableData, cols: pivotedTableData.cols.filter(isColVisible) }
      : pivotedTableData
  const chartData = {
    ...tableData,
    cols: pivotCol ? [...tableData.cols, pivotCol] : tableData.cols,
  }
  const chartValueCols = chartData.cols.filter((col) => col.key !== indexKey && col.key !== pivotKey)
  const chartValueOptions = chartValueCols.map((col): SelectOption => ({ value: col.key, label: col.label }))
  const chartValueKey = chartValueCols[0]?.key || null

  return { data: newData, tableData, chartData, chartValueOptions, chartValueKey }
}

export { useTableStore }
