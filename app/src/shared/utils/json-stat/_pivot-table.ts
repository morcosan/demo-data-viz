import type { TableCol, TableData, TableRow } from '../../types/table'
import { JSON_STAT_VALUE_KEY, type JsonStatData } from './_types'

type PivotConfig = {
  indexKey: string
  pivotKey: string
  filterByCol: Record<string, string>
}

const pivotJsonStatTable = (data: JsonStatData, { indexKey, pivotKey, filterByCol }: PivotConfig): TableData => {
  const filterEntries = indexKey
    ? Object.entries(filterByCol)
        .filter(([key, value]) => value !== '' && key !== indexKey && key !== pivotKey)
        .map(([key, code]) => {
          const value = data.cellsByCol[key]?.find((cell) => cell.code === code)?.value || ''
          return [key, value]
        })
    : []
  const filteredRows = indexKey
    ? data.rows.filter((row) => filterEntries.every(([key, value]) => String(row[key]) === value))
    : data.rows
  let finalCols: TableCol[]
  let finalRows: TableRow[]

  if (pivotKey) {
    const rowMap = new Map<string, TableRow>()
    for (const row of filteredRows) {
      const indexColValue = Object.entries(row)
        .filter(([key]) => key !== pivotKey && key !== JSON_STAT_VALUE_KEY)
        .map(([, val]) => String(val))
        .join('||') // Add separator to avoid conflicts
      if (!rowMap.has(indexColValue)) {
        rowMap.set(
          indexColValue,
          Object.fromEntries(Object.entries(row).filter(([key]) => key !== pivotKey && key !== JSON_STAT_VALUE_KEY)),
        )
      }
      rowMap.get(indexColValue)![String(row[pivotKey])] = row[JSON_STAT_VALUE_KEY]
    }

    const isIndexCol = (col: TableCol) => !indexKey || col.key === indexKey
    const isNoPivotCol = (col: TableCol) => col.key !== JSON_STAT_VALUE_KEY && col.key !== pivotKey
    const indexCols = data.cols.filter((col) => isIndexCol(col) && isNoPivotCol(col))
    const pivotValues = [...new Set(data.rows.map((row) => String(row[pivotKey])))]
    const pivotCols = pivotValues.map((value): TableCol => ({ key: value, label: value, type: 'float', pivoted: true }))
    finalCols = [...indexCols, ...pivotCols]
    finalRows = [...rowMap.values()]
  } else {
    finalCols = data.cols.filter((col) => !indexKey || col.key === indexKey || col.key === JSON_STAT_VALUE_KEY)
    finalRows = filteredRows
  }

  // Backfill missing index rows
  if (indexKey) {
    const allIndexValues = new Set(data.rows.map((row) => row[indexKey]))
    finalRows = [...allIndexValues].map<TableRow>(
      (indexValue) => finalRows.find((row) => row[indexKey] === indexValue) || { [indexKey]: indexValue },
    )
  }

  return {
    cols: finalCols,
    rows: finalRows,
  }
}

export { pivotJsonStatTable }
