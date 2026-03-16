'use client'

import { LoadingSpinner, TextHighlight } from '@app-components'
import { useTranslation } from '@app-i18n'
import { type TableCell, type TableData, type TableRow } from '@app/shared/types/table'
import { useVirtualScroll, type VirtualItem } from '@app/shared/utils/use-virtual-scroll'
import { wait } from '@ds/core'
import { type CellContext } from '@tanstack/react-table'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ColCell } from './_partials/col-cell'
import { RowCell } from './_partials/row-cell'
import { Toolbar } from './_partials/toolbar'
import { computeColSize, formatCellValue } from './_partials/utils'
import { useTableModel } from './_use-table-model'

interface Props extends ReactProps {
  data: TableData
  cellFn?: (value: string, query: string) => ReactNode
  toolbar?: ReactNode
  loading?: boolean
  sticky?: boolean
}

export const DataTable = (props: Props) => {
  const { t } = useTranslation()
  const { cellFn } = props
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const headerRef = useRef<HTMLTableSectionElement | null>(null)

  const columns = useMemo(
    () => props.data.cols.map((col) => ({ ...col, size: computeColSize(col, props.data.rows) })),
    [props.data.cols, props.data.rows, computeColSize],
  )
  const renderCell = useCallback(
    (info: CellContext<TableRow, TableCell>) => {
      const value = info.getValue() ?? ''
      if (value === '') return <span className="text-color-text-placeholder">{t('dataViz.label.emptyCell')}</span>

      const query = searchQuery.trim()
      const strValue = formatCellValue(value, columns[info.column.getIndex()])

      return cellFn ? cellFn(strValue, query) : query ? <TextHighlight text={strValue} query={query} /> : strValue
    },
    [columns, cellFn, searchQuery, t],
  )
  const { tableRows, tableCols } = useTableModel({
    cols: columns,
    rows: props.data.rows,
    filter: searchQuery,
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
  const vSpaceOnLeft = props.sticky
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
  }, [props.data])

  return (
    <div
      ref={rootRef}
      className={cx(
        'bg-color-bg-card border-color-border-subtle flex max-w-full flex-col rounded-md border',
        props.className,
      )}
      style={props.style}
    >
      {/* TOOLBAR */}
      <Toolbar toolbar={props.toolbar} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* TABLE */}
      <div ref={vScrollerRef} className="border-color-border-subtle min-h-0 flex-1 overflow-auto border-t">
        <table className="min-w-full border-collapse" style={{ width: vTotalWidth }}>
          <thead ref={headerRef} className="z-sticky bg-color-bg-card shadow-below-sm sticky top-0">
            <tr>
              {/* STICKY */}
              {props.sticky && tableCols.length > 0 && (
                <ColCell key={tableCols[0].id} cell={tableCols[0]} col={columns[0]} width={stickyColWidth} sticky />
              )}
              {/* SPACER */}
              <th style={{ width: vSpaceOnLeft, padding: 0 }} />
              {/* CONTENT */}
              {vColItems
                .filter((vCol) => vCol.index !== 0 || !props.sticky)
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
            {isLoading || props.loading ? (
              <tr>
                <td colSpan={vColItems.length + 2} className="relative">
                  <div className="flex-center min-h-lg-0 sticky left-0 flex w-full" style={spinnerStyle}>
                    <LoadingSpinner />
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
                  const cells = tableRows[vItem.index].getVisibleCells()
                  if (!cells) return null
                  return (
                    <tr key={tableRows[vItem.index].id}>
                      {/* STICKY */}
                      {props.sticky && cells.length > 0 && (
                        <RowCell cell={cells[0]} col={columns[0]} width={stickyColWidth} height={vItem.size} sticky />
                      )}
                      {/* SPACER */}
                      <td style={{ width: vSpaceOnLeft, padding: 0 }} />
                      {/* CONTENT */}
                      {vColItems
                        .filter((vCol) => vCol.index !== 0 || !props.sticky)
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
