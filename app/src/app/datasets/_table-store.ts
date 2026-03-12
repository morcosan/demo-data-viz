import { EurostatConfig, type JsonStatData } from '@app/shared/utils/json-stat'
import { create } from 'zustand'

interface TableStore {
  indexColKey: string
  pivotColKey: string
  filterByCol: Record<string, string>
  colQuery: string[]
  initTableStore: (data: JsonStatData) => Promise<void>
  resetColQuery: (data: JsonStatData) => Promise<void>
  setIndexColKey: (value: string | null) => void
  setPivotColKey: (value: string | null) => void
  setFilterByCol: (value: string | null, key: string) => void
  setColQuery: (value: string[]) => void
}

export const useTableStore = create<TableStore>((set) => ({
  indexColKey: '',
  pivotColKey: '',
  filterByCol: {},
  colQuery: [],

  initTableStore: async (data: JsonStatData) => {
    if (data.source !== 'eurostat') return

    const { DEFAULT_ROW_KEY, DEFAULT_COL_KEY, DEFAULT_FILTERS } = EurostatConfig
    const colKeys = Object.keys(data.cellsByCol)

    set({
      indexColKey: data.cellsByCol[DEFAULT_ROW_KEY] ? DEFAULT_ROW_KEY : '',
      pivotColKey: data.cellsByCol[DEFAULT_COL_KEY] ? DEFAULT_COL_KEY : '',
      filterByCol: colKeys.reduce(
        (acc, key) => {
          const defaultCode = DEFAULT_FILTERS[key as keyof typeof DEFAULT_FILTERS]
          const cell = defaultCode
            ? data.cellsByCol[key]?.find((cell) => cell.code === defaultCode)
            : data.cellsByCol[key]?.[0]
          return { ...acc, [key]: String(cell?.value ?? '') }
        },
        {} as Record<string, string>,
      ),
    })
  },

  resetColQuery: async (data: JsonStatData) => {
    if (data.source !== 'eurostat') return

    const currentYear = new Date().getFullYear()
    const timeQuery = [String(currentYear - 1), String(currentYear)]

    set((state) => ({ colQuery: state.pivotColKey === EurostatConfig.TIME_KEY ? timeQuery : [] }))
  },

  setIndexColKey: (value: string | null) => set({ indexColKey: value || '' }),
  setPivotColKey: (value: string | null) => set({ pivotColKey: value || '' }),
  setFilterByCol: (value: string | null, key: string) => {
    set((state) => ({ filterByCol: { ...state.filterByCol, [key]: value || '' } }))
  },
  setColQuery: (value: string[]) => set({ colQuery: value }),
}))
