'use client'

import { useTranslation } from '@app-i18n'
import { type TableData, type TableRow, type TableRowValue } from '@app/shared/utils/json-stat'
import { useVirtualScroll, type VirtualItem } from '@app/shared/utils/use-virtual-scroll'
import { IconButton, SearchSvg, SortAscSvg, SortDescSvg, SortNoneSvg, TextField } from '@ds/core.ts'
import { type ColumnDef, flexRender, type SortingState, useReactTable } from '@tanstack/react-table'
import { debounce } from 'lodash'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { coreRowModel, filteredRowModel, sortedRowModel } from './_react-table'

interface Props extends ReactProps {
  data: TableData
  cellFn?: (value: TableRowValue) => ReactNode
  tableClassName?: string
}

export const DataTable = (props: Props) => {
  // const renderTimer = useRef(startTimer('DataTable'))
  const { t } = useTranslation()
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchKeyword, setSearchKeyword] = useState('')

  const columns = useMemo(() => {
    return props.data.cols.map(
      (col): ColumnDef<TableRow> => ({
        accessorKey: col.key,
        header: col.label,
        size: col.size,
        cell: (info) => (props.cellFn ? props.cellFn(info.getValue() as TableRowValue) : info.getValue()),
      }),
    )
  }, [props.data.cols, props.cellFn])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns,
    data: props.data.rows,
    state: { sorting, globalFilter: searchKeyword },
    onSortingChange: setSorting,
    getCoreRowModel: coreRowModel,
    getSortedRowModel: sortedRowModel,
    getFilteredRowModel: filteredRowModel,
  })
  const { rows } = table.getRowModel()
  const headers = table.getHeaderGroups()[0].headers

  const { vItems, vTotalSize, vScrollerRef } = useVirtualScroll({
    count: rows.length,
    itemSize: 50,
  })

  const cellClass = cx('px-xs-6 py-xs-2 text-size-sm border-color-border-subtle truncate')
  const headerClass = cx('font-weight-lg', cellClass)
  const rowClass = cx('border-b', cellClass)

  const handleSearchChange = useMemo(() => debounce((value: string) => setSearchKeyword(value), 300), [])

  useEffect(() => {
    if (vScrollerRef.current) {
      vScrollerRef.current.scrollTop = 0
    }
  }, [props.data])

  // useEffect(() => {
  //   renderTimer.current.stop('render')
  //   renderTimer.current = startTimer('DataTable')
  // })

  return (
    <div className={cx('flex max-w-full flex-col', props.className)} style={props.style}>
      <TextField
        value={searchKeyword}
        id="dataset-search"
        className="max-w-lg-9 mb-xs-3 ml-px"
        size="sm"
        placeholder={t('core.placeholder.search')}
        ariaLabel={t('dataViz.label.dataTableSearch')}
        prefix={<SearchSvg className="ml-xs-2 w-xs-5 mt-px" />}
        onChange={handleSearchChange}
      />

      <div ref={vScrollerRef} className={cx('min-h-0 flex-1 overflow-auto', props.tableClassName)}>
        <table className="bg-color-bg-card min-w-full table-fixed border-collapse">
          <thead className="z-sticky bg-color-bg-card shadow-below-sm sticky top-0">
            <tr>
              {headers.map((header) => {
                const sort = header.column.getIsSorted()
                return (
                  <th key={header.id} title={header.column.columnDef.header as string} className={headerClass}>
                    {header.isPlaceholder ? null : (
                      <div className="gap-xs-1 flex items-center">
                        {flexRender(header.column.columnDef.header, header.getContext())}
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
            </tr>
          </thead>
          <tbody>
            {/* SPACER */}
            {vItems.length > 0 && (
              <tr>
                <td style={{ height: vItems[0]?.start || 0 }} />
              </tr>
            )}
            {vItems.map((vItem: VirtualItem) => (
              <tr key={rows[vItem.index].id}>
                {rows[vItem.index].getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    title={cell.getValue() as string}
                    className={rowClass}
                    style={{
                      height: vItem.size,
                      minWidth: cell.column.getSize(),
                      maxWidth: cell.column.getSize(),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {/* SPACER */}
            {vItems.length > 0 && (
              <tr>
                <td style={{ height: vTotalSize - (vItems[vItems.length - 1]?.end || 0) }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
