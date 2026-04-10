'use client'

import { useTranslation } from '@app-i18n'
import { type TableCell, type TableData, type TableRow } from '@app/shared/types/table'
import { useVirtualScroll, type VirtualItem } from '@app/shared/utils/use-virtual-scroll'
import { wait } from '@ds/core'
import { type Cell, type CellContext } from '@tanstack/react-table'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { EmptyState } from '../empty-state/empty-state'
import { LoadingSpinner } from '../loading-spinner/loading-spinner'
import { TextHighlight } from '../text-highlight/text-highlight'
import { ColCell } from './_partials/col-cell'
import { RowCell } from './_partials/row-cell'
import { useTableModel } from './_partials/use-table-model'
import { computeColSize, formatCellValue } from './_partials/utils'

export interface DataTableProps extends ReactProps {
  data: TableData
  cellFn?: (value: string, query: string) => ReactNode
  queries?: string[]
  loading?: boolean
  sticky?: boolean
  emptyState?: ReactNode
}

export const DataTable = (props: DataTableProps) => {
  const { cellFn, className, data, emptyState, loading, queries = [], sticky, style } = props
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLTableSectionElement>(null)

  const lcQueries = useMemo(() => queries.map((query) => query.trim().toLowerCase()).filter(Boolean), [queries])
  const columns = useMemo(
    () => data.cols.map((col) => ({ ...col, size: computeColSize(col, data.rows) })),
    [data.cols, data.rows, computeColSize],
  )
  const renderCell = useCallback(
    (info: CellContext<TableRow, TableCell>) => {
      const value = info.getValue() ?? ''
      if (value === '') return <span className="text-color-text-placeholder">{t('dataViz.label.emptyCell')}</span>

      const strValue = formatCellValue(value, columns[info.column.getIndex()])
      const query = lcQueries.find((lcQuery) => strValue.toLowerCase().includes(lcQuery)) || ''

      return cellFn ? cellFn(strValue, query) : query ? <TextHighlight text={strValue} query={query} /> : strValue
    },
    [columns, cellFn, lcQueries, t],
  )
  const { tableRows, tableCols } = useTableModel({
    cols: columns,
    rows: data.rows,
    queries: queries,
    cellFn: renderCell,
  })

  const virtualizer = useVirtualScroll({
    rowCount: tableRows.length,
    colCount: tableCols.length,
    itemHeight: 50,
    itemWidth: (index) => tableCols[index].column.getSize(),
  })
  const { vRowItems, vColItems, vTotalWidth, vScrollerRef } = virtualizer
  const { vSpaceOnTop, vSpaceOnBottom, vSpaceOnRight } = virtualizer
  const stickyColWidth = tableCols[0]?.column.getSize() ?? 0
  const vSpaceOnLeft = sticky
    ? virtualizer.vSpaceOnLeft - (vColItems[0]?.index === 0 ? 0 : stickyColWidth)
    : virtualizer.vSpaceOnLeft

  const spinnerStyle: CSSProperties = {
    width: rootRef.current?.clientWidth || 0,
    height: (vScrollerRef.current?.clientHeight || 0) - (headerRef.current?.clientHeight || 0),
  }

  useEffect(() => {
    if (vScrollerRef.current) {
      vScrollerRef.current.scrollTop = 0
    }
    // Show 200ms loading to avoid UI freeze due to large data
    setIsLoading(true)
    wait(200).then(() => setIsLoading(false))
  }, [data])

  return (
    <div ref={rootRef} className={cx('bg-color-bg-card max-w-full', className)} style={style}>
      <div ref={vScrollerRef} className="h-full overflow-auto">
        <table className="min-w-full border-collapse" style={{ width: vTotalWidth }}>
          <thead ref={headerRef} className="z-sticky bg-color-bg-card shadow-below-sm sticky top-0">
            <tr>
              {/* STICKY */}
              {sticky && tableCols.length > 0 && (
                <ColCell key={tableCols[0].id} cell={tableCols[0]} col={columns[0]} width={stickyColWidth} sticky />
              )}
              {/* SPACER */}
              <th style={{ width: vSpaceOnLeft, padding: 0 }} />
              {/* CONTENT */}
              {vColItems
                .filter((vCol) => vCol.index !== 0 || !sticky)
                .map((vCol: VirtualItem) => (
                  <ColCell
                    key={tableCols[vCol.index].id}
                    cell={tableCols[vCol.index]}
                    col={columns[vCol.index]}
                    width={vCol.size}
                  />
                ))}
              {/* SPACER */}
              <th style={{ width: vSpaceOnRight, padding: 0 }} />
            </tr>
          </thead>
          <tbody>
            {isLoading || loading ? (
              <tr>
                <td colSpan={vColItems.length + 2} className="relative">
                  <div className="flex-center min-h-lg-0 sticky left-0 flex w-full" style={spinnerStyle}>
                    <LoadingSpinner />
                  </div>
                </td>
              </tr>
            ) : tableRows.length === 0 ? (
              <tr>
                <td colSpan={vColItems.length + 2} className="relative">
                  <div className="flex-center min-h-lg-0 sticky left-0 flex w-full" style={spinnerStyle}>
                    {emptyState || <EmptyState variant="empty">{t('dataViz.error.noData')}</EmptyState>}
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {/* SPACER */}
                {vRowItems.length > 0 && (
                  <tr>
                    <td style={{ height: vSpaceOnTop }} />
                  </tr>
                )}
                {/* CONTENT */}
                {vRowItems.map((vItem: VirtualItem) => {
                  const cells = tableRows[vItem.index].getVisibleCells() as Cell<TableRow, TableCell>[]
                  if (!cells) return null
                  return (
                    <tr key={tableRows[vItem.index].id}>
                      {/* STICKY */}
                      {sticky && cells.length > 0 && (
                        <RowCell cell={cells[0]} col={columns[0]} width={stickyColWidth} height={vItem.size} sticky />
                      )}
                      {/* SPACER */}
                      <td style={{ width: vSpaceOnLeft, padding: 0 }} />
                      {/* CONTENT */}
                      {vColItems
                        .filter((vCol) => vCol.index !== 0 || !sticky)
                        .map((vCol: VirtualItem) => (
                          <RowCell
                            key={cells[vCol.index].id}
                            cell={cells[vCol.index]}
                            col={columns[vCol.index]}
                            width={vCol.size}
                            height={vItem.size}
                          />
                        ))}
                      {/* SPACER */}
                      <td style={{ width: vSpaceOnRight, padding: 0 }} />
                    </tr>
                  )
                })}
                {/* SPACER */}
                {vRowItems.length > 0 && (
                  <tr>
                    <td style={{ height: vSpaceOnBottom }} />
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
