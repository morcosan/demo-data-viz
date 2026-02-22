import type { Cell, Column, Row, RowModel, Table } from '@tanstack/react-table'
import { getSortedRowModel } from '@tanstack/react-table'

/**
 * Generated with Claude 4.6
 * Differences from the original getCoreRowModel:
 * 1. Memoizes the entire row model - skips recomputation if data reference hasn't changed
 * 2. No upfront accessorFn evaluation - getValue reads directly from rowData at call time
 * 3. No rowsById map - skips millions of string key insertions into an object
 * 4. No full Row API - omits getIsSelected, getIsExpanded, getParentRow, getLeafRows, etc.
 * 5. Lazy cell creation - cells are built on first getVisibleCells() call and cached per row
 * 6. No cell value caching in _valuesCache - values are read fresh each time from rowData
 */
type TData = Record<string, unknown>
type TCell = Cell<TData, unknown>
type TColumn = Column<TData, unknown>

const getCoreRowModel = () => {
  return (table: Table<TData>) => {
    let lastData: TData[] | null = null
    let lastRows: RowModel<TData> | null = null

    return (): RowModel<TData> => {
      if (lastRows && table.options.data === lastData) return lastRows

      const rows = table.options.data.map((rowData: TData, index: number): Row<TData> => {
        let cachedCells: TCell[] | null = null

        const row = {
          id: String(index),
          index,
          original: rowData,
          getValue: <TValue>(columnId: string) => rowData[columnId] as TValue,
          getVisibleCells() {
            if (cachedCells) return cachedCells

            cachedCells = table.getVisibleLeafColumns().map((column: TColumn) => {
              return {
                id: `${index}_${column.id}`,
                column,
                row,
                getValue: <TValue>() => rowData[column.id] as TValue,
                renderValue: <TValue>() => rowData[column.id] as TValue,
                getContext: () => ({
                  table,
                  column,
                  row,
                  cell: null as any,
                  getValue: <TValue>() => rowData[column.id] as TValue,
                  renderValue: <TValue>() => rowData[column.id] as TValue,
                }),
              } as TCell
            })

            return cachedCells
          },
        }

        return row as Row<TData>
      })

      lastData = table.options.data
      lastRows = { rows, flatRows: rows, rowsById: {} }

      return lastRows
    }
  }
}

const coreRowModel = getCoreRowModel()
const sortedRowModel = getSortedRowModel()

export { coreRowModel, sortedRowModel }
