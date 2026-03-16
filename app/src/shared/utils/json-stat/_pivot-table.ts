import type { TableCol, TableData, TableRow } from '../../types/table'
import { JSON_STAT_VALUE_KEY } from './_types'

type PivotConfig = {
  indexColKey: string
  pivotColKey: string
  filterByCol: Record<string, string>
}

const pivotJsonStatTable = (data: TableData, { indexColKey, pivotColKey, filterByCol }: PivotConfig): TableData => {
  const filterEntries = indexColKey
    ? Object.entries(filterByCol).filter(([key, value]) => value !== '' && key !== indexColKey && key !== pivotColKey)
    : []
  const filteredRows = indexColKey
    ? data.rows.filter((row) => filterEntries.every(([key, value]) => String(row[key]) === value))
    : data.rows
  let finalCols: TableCol[]
  let finalRows: TableRow[]

  if (pivotColKey) {
    const rowMap = new Map<string, TableRow>()
    for (const row of filteredRows) {
      const indexColValue = Object.entries(row)
        .filter(([key]) => key !== pivotColKey && key !== JSON_STAT_VALUE_KEY)
        .map(([, val]) => String(val))
        .join('||') // Add separator to avoid conflicts
      if (!rowMap.has(indexColValue)) {
        rowMap.set(
          indexColValue,
          Object.fromEntries(Object.entries(row).filter(([key]) => key !== pivotColKey && key !== JSON_STAT_VALUE_KEY)),
        )
      }
      rowMap.get(indexColValue)![String(row[pivotColKey])] = row[JSON_STAT_VALUE_KEY]
    }

    const isIndexCol = (col: TableCol) => !indexColKey || col.key === indexColKey
    const isNoPivotCol = (col: TableCol) => col.key !== JSON_STAT_VALUE_KEY && col.key !== pivotColKey
    const indexCols = data.cols.filter((col) => isIndexCol(col) && isNoPivotCol(col))
    const pivotValues = [...new Set(data.rows.map((row) => String(row[pivotColKey])))]
    const pivotCols = pivotValues.map((value): TableCol => ({ key: value, label: value, type: 'float', pivoted: true }))
    finalCols = [...indexCols, ...pivotCols]
    finalRows = [...rowMap.values()]
  } else {
    finalCols = data.cols.filter((col) => !indexColKey || col.key === indexColKey || col.key === JSON_STAT_VALUE_KEY)
    finalRows = filteredRows
  }

  // Backfill missing index rows
  if (indexColKey) {
    const allIndexValues = new Set(data.rows.map((row) => row[indexColKey]))
    finalRows = [...allIndexValues].map<TableRow>(
      (indexValue) => finalRows.find((row) => row[indexColKey] === indexValue) || { [indexColKey]: indexValue },
    )
  }

  return {
    cols: finalCols,
    rows: finalRows,
  }
}

export { pivotJsonStatTable }
