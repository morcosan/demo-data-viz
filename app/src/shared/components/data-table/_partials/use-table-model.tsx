import type { TableCell, TableCol, TableRow } from '@app/shared/types/table'
import type { Cell, CellContext, Column, ColumnDef, Row, RowModel, Table } from '@tanstack/react-table'
import { getFilteredRowModel, getSortedRowModel, type SortingState, useReactTable } from '@tanstack/react-table'
import { type ReactNode, useMemo, useState } from 'react'

interface Props {
  cols: TableCol[]
  rows: TableRow[]
  filter: string
  cellFn: (info: CellContext<TableRow, TableCell>) => ReactNode
}

const useTableModel = (props: Props) => {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo((): ColumnDef<TableRow>[] => {
    return props.cols.map((col) => ({
      accessorKey: col.key,
      header: col.label,
      size: col.size,
      cell: props.cellFn,
    }))
  }, [props.cols, props.cellFn])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns,
    data: props.rows,
    state: { sorting, globalFilter: props.filter },
    getColumnCanGlobalFilter: () => true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return {
    tableCols: table.getHeaderGroups()[0].headers,
    tableRows: table.getRowModel().rows,
  }
}

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
    let lastCols: ColumnDef<TData>[] | null = null

    return (): RowModel<TData> => {
      const { data, columns } = table.options

      if (lastRows && data === lastData && columns === lastCols) return lastRows

      const rows = data.map((rowData: TData, index: number): Row<TData> => {
        const row = {
          id: String(index),
          index,
          original: rowData,
          getValue: <TValue,>(columnId: string) => rowData[columnId] as TValue,
          getVisibleCells: () => cellCache.getCells(),
          _getAllCellsByColumnId: () => cellCache.getCellsById(),
        } as Row<TData>

        const cellCache = buildCells(table, row, rowData, index)

        return row
      })

      lastData = table.options.data
      lastCols = table.options.columns
      lastRows = { rows, flatRows: rows, rowsById: {} }

      return lastRows
    }
  }
}

const buildCells = (table: Table<TData>, row: Row<TData>, rowData: TData, index: number) => {
  let cells: TCell[] | null = null
  let cellsById: Record<string, TCell> | null = null

  const build = (): undefined => {
    if (cells) return

    cells = []
    cellsById = {}

    for (const column of table.getVisibleLeafColumns() as TColumn[]) {
      const getValue = <TValue,>() => rowData[column.id] as TValue
      const renderValue = <TValue,>() => rowData[column.id] as TValue
      const cell = {
        id: `${index}_${column.id}`,
        column,
        row,
        getValue,
        renderValue,
        getContext: () => ({ table, column, row, cell, getValue, renderValue }),
      } as TCell

      cells.push(cell)
      cellsById[column.id] = cell
    }
  }

  return {
    getCells: () => build() || cells,
    getCellsById: () => build() || cellsById,
  }
}

export { useTableModel }
