import type { TableData, TableRow } from '@app/shared/types/table'
import { JSON_STAT_VALUE_KEY } from './_types'

interface Filters {
  rowKey: string
  colKey: string
  filterByCol: Record<string, string | number | null>
}

const mapJsonStatFilters = (data: TableData, { rowKey, colKey, filterByCol }: Filters): TableData => {
  const filters = rowKey ? Object.entries(filterByCol).filter(([key]) => key !== rowKey && key !== colKey) : []
  const filteredRows = data.rows.filter((row) => filters.every(([key, value]) => String(row[key]) === value))

  if (!colKey) {
    return {
      cols: data.cols.filter(
        (col) => !rowKey || col.key === rowKey || col.key === colKey || col.key === JSON_STAT_VALUE_KEY,
      ),
      rows: filteredRows,
    }
  }

  // Get unique colKey values for new column headers
  const colValues = [...new Set(filteredRows.map((row) => String(row[colKey])))]

  // Pivot rows grouped by rowKey value
  const pivotMap = new Map<string, TableRow>()
  for (const row of filteredRows) {
    const rowKeyVal = String(row[rowKey])
    if (!pivotMap.has(rowKeyVal)) {
      pivotMap.set(rowKeyVal, { [rowKey]: row[rowKey] })
    }
    pivotMap.get(rowKeyVal)![String(row[colKey])] = row[JSON_STAT_VALUE_KEY]
  }

  // Preserve rowKey column in the pivoted table
  const rowKeyCol = data.cols.find((col) => col.key === rowKey)!

  return {
    cols: [rowKeyCol, ...colValues.map((val) => ({ key: val, label: val }))],
    rows: [...pivotMap.values()],
  }
}

export { mapJsonStatFilters }
