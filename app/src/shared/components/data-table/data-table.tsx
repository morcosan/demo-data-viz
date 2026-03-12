'use client'

import { LoadingSpinner, TextHighlight } from '@app-components'
import { useTranslation } from '@app-i18n'
import { type TableCol, type TableData, type TableRow, type TableRowValue } from '@app/shared/types/table'
import { computeTextWidth } from '@app/shared/utils/formatting'
import { useVirtualScroll, type VirtualItem } from '@app/shared/utils/use-virtual-scroll'
import { CloseSvg, IconButton, SearchSvg, SortAscSvg, SortDescSvg, SortNoneSvg, TextField, wait } from '@ds/core'
import { type CellContext, flexRender } from '@tanstack/react-table'
import { debounce } from 'lodash'
import { type CSSProperties, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTableModel } from './_use-table-model'

interface Props extends ReactProps {
  data: TableData
  cellFn?: (value: TableRowValue, query: string) => ReactNode
  toolbar?: ReactNode
  loading?: boolean
}

export const DataTable = (props: Props) => {
  const { t } = useTranslation()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const headerRef = useRef<HTMLTableSectionElement | null>(null)

  const cellClass = cx('px-xs-6 py-xs-2 text-size-sm border-color-border-subtle truncate')
  const headerClass = cx('font-weight-lg', cellClass)
  const rowClass = cx('border-b', cellClass)

  const computeColSize = useCallback(
    (col: TableCol): number => {
      const MIN_COL_SIZE = 100
      const MAX_COL_SIZE = 400
      const FONT_SIZE = 14 // sm
      const SORT_BUTTON_WIDTH = 32 // button-h-sm
      const SORT_BUTTON_MARGIN = 6 // xs-2
      const CELL_PADDING = 14 * 2 // xs-6
      const SAMPLE_SIZE = 100

      const rows = props.data.rows.slice(0, SAMPLE_SIZE)
      const headerSize = computeTextWidth(col.label, FONT_SIZE)
      const rowSizes = rows.map((row) => computeTextWidth(String(row[col.key] ?? ''), FONT_SIZE))
      const avgRowSize = rowSizes.length ? rowSizes.reduce((sum, size) => sum + size, 0) / rowSizes.length : 0
      const totalSize = Math.max(headerSize, avgRowSize) + CELL_PADDING + SORT_BUTTON_WIDTH + SORT_BUTTON_MARGIN

      return Math.min(MAX_COL_SIZE, Math.max(MIN_COL_SIZE, Math.round(totalSize)))
    },
    [props.data.rows],
  )
  const columns = useMemo(
    () => props.data.cols.map((col) => ({ ...col, size: computeColSize(col) })),
    [props.data.cols, computeColSize],
  )
  const { cellFn } = props
  const cellRenderer = useCallback(
    (info: CellContext<TableRow, unknown>) => {
      const value = info.getValue() as TableRowValue
      const cell = cellFn ? cellFn(value, searchKeyword) : value
      return !value && value !== 0 ? (
        <span className="text-size-xs text-color-text-placeholder italic">{t('core.label.empty')}</span>
      ) : !searchKeyword.trim() || typeof cell !== 'string' ? (
        cell
      ) : (
        <TextHighlight text={String(cell ?? '')} query={searchKeyword} />
      )
    },
    [cellFn, searchKeyword, t],
  )
  const { tableRows, tableCols } = useTableModel({
    cols: columns,
    rows: props.data.rows,
    filter: searchKeyword,
    cellRenderer,
  })

  const virtualScroll = useVirtualScroll({
    rowCount: tableRows.length,
    colCount: tableCols.length,
    itemHeight: 50,
    itemWidth: (index) => tableCols[index].column.getSize(),
  })
  const { vRowItems, vColItems, vTotalWidth, vScrollerRef, vColItemRef } = virtualScroll
  const { vSpaceOnTop, vSpaceOnBottom, vSpaceOnLeft, vSpaceOnRight } = virtualScroll

  const spinnerStyle: CSSProperties = {
    width: rootRef.current?.clientWidth || 0,
    height: (vScrollerRef.current?.clientHeight || 0) - (headerRef.current?.clientHeight || 0),
  }

  const handleSearchChange = useMemo(() => debounce((value: string) => setSearchKeyword(value), 300), [])

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
      <div className="m-xs-2 gap-xs-2 flex flex-wrap items-center justify-between">
        {props.toolbar}

        <TextField
          value={searchKeyword}
          id="dataset-search"
          className="lg:max-w-lg-9 w-full"
          size="sm"
          placeholder={t('core.placeholder.search')}
          ariaLabel={t('dataViz.label.dataTableSearch')}
          prefix={<SearchSvg className="ml-xs-2 w-xs-5 mt-px" />}
          suffix={
            searchKeyword && (
              <IconButton
                tooltip={t('core.action.clearSearch')}
                variant="text-subtle"
                size="xs"
                onClick={() => setSearchKeyword('')}
              >
                <CloseSvg className="h-xs-7" />
              </IconButton>
            )
          }
          onChange={handleSearchChange}
        />
      </div>

      <div ref={vScrollerRef} className="border-color-border-subtle min-h-0 flex-1 overflow-auto border-t">
        <table className="min-w-full table-fixed border-collapse" style={{ width: vTotalWidth }}>
          <thead ref={headerRef} className="z-sticky bg-color-bg-card shadow-below-sm sticky top-0">
            <tr>
              {/* SPACER */}
              <th style={{ width: vSpaceOnLeft, padding: 0 }} />
              {/* CONTENT */}
              {vColItems.map((vCol) => {
                const header = tableCols[vCol.index]
                const sort = header.column.getIsSorted()
                return (
                  <th
                    key={header.id}
                    ref={vColItemRef}
                    data-index={vCol.index}
                    title={header.column.columnDef.header as string}
                    className={headerClass}
                    style={{ width: vCol.size }}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="gap-xs-1 flex items-center">
                        <span className="truncate">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {header.column.getCanSort() && (
                          <IconButton
                            tooltip={t('core.action.sort')}
                            variant={sort ? 'solid-secondary' : 'text-default'}
                            size="sm"
                            className="rounded-full! before:rounded-full! after:rounded-full!"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {sort === 'asc' && <SortAscSvg className="h-xs-8" />}
                            {sort === 'desc' && <SortDescSvg className="h-xs-8" />}
                            {sort === false && <SortNoneSvg className="h-xs-6 text-color-text-subtle" />}
                          </IconButton>
                        )}
                      </div>
                    )}
                  </th>
                )
              })}
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
                {vRowItems.map((vItem: VirtualItem) => (
                  <tr key={tableRows[vItem.index].id}>
                    {/* SPACER */}
                    <td style={{ width: vSpaceOnLeft, padding: 0 }} />
                    {/* CONTENT */}
                    {vColItems.map((vCol) => {
                      const cell = tableRows[vItem.index].getVisibleCells()[vCol.index]
                      return (
                        <td
                          key={cell.id}
                          title={cell.getValue() as string}
                          className={rowClass}
                          style={{ height: vItem.size, width: vCol.size }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      )
                    })}
                    {/* SPACER */}
                    <td style={{ width: vSpaceOnRight, padding: 0 }} />
                  </tr>
                ))}
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
