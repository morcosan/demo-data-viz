'use client'

import { type TableCol } from '@app/shared/types/table'
import { type JsonStatData, pivotJsonStatTable } from '@app/shared/utils/json-stat'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { UrlKey, useTableStore } from '../_hooks/use-table-store'
import { type DataView } from '../_types'
import { DataToolbar } from './data-toolbar'
import { ChartView } from './data-views/chart-view'
import { TableView } from './data-views/table-view'

export interface DatasetPaneProps extends ReactProps {
  data: JsonStatData
  view: DataView
}

export const DataPane = (props: DatasetPaneProps) => {
  const searchParams = useSearchParams()
  const indexKey = useTableStore((s) => s.indexKey)
  const pivotKey = useTableStore((s) => s.pivotKey)
  const filterByCol = useTableStore((s) => s.filterByCol)
  const pivotQuery = useTableStore((s) => s.pivotQuery)
  const initTableStore = useTableStore((s) => s.initTableStore)
  const [searchQuery, setSearchQuery] = useState('')

  const pivotedData = useMemo(
    () => pivotJsonStatTable(props.data, { indexKey, pivotKey, filterByCol }),
    [props.data, indexKey, pivotKey, filterByCol],
  )
  const isColVisible = useCallback(
    (col: TableCol) => !col.pivoted || pivotQuery.some((keyword) => col.label.toLowerCase().includes(keyword)),
    [pivotQuery],
  )
  const visibleData = useMemo(() => {
    return pivotKey && pivotQuery.length ? { ...pivotedData, cols: pivotedData.cols.filter(isColVisible) } : pivotedData
  }, [pivotedData, pivotKey, pivotQuery, isColVisible])

  useEffect(() => {
    initTableStore(props.data)
  }, [props.data])

  useEffect(() => {
    // Reset all filters when reopening the same dataset
    if (!searchParams.has(UrlKey.INDEX_KEY)) {
      initTableStore(props.data)
    }
  }, [searchParams])

  return (
    <div
      className={cx(
        'bg-color-bg-card border-color-border-subtle flex max-w-full flex-col rounded-md border',
        props.className,
      )}
    >
      <DataToolbar data={props.data} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {props.view === 'table' && <TableView data={visibleData} query={searchQuery} className="min-h-0 flex-1" />}
      {props.view === 'chart' && <ChartView data={visibleData} query={searchQuery} className="min-h-0 flex-1" />}
      {props.view === 'map' && <div>TODO</div>}
    </div>
  )
}
