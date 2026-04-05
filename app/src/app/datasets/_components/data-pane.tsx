'use client'

import { TextHighlight } from '@app-components'
import { useCountries } from '@app-i18n'
import { type TableCol } from '@app/shared/types/table'
import { type JsonStatData, pivotJsonStatTable } from '@app/shared/utils/json-stat'
import { getUrlParamArray, setUrlParam } from '@app/shared/utils/url-query'
import { useSearchParams } from 'next/navigation'
import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useTableStore } from '../_hooks/use-table-store'
import { type DataView, UrlKey } from '../_types'
import { DataToolbar } from './data-toolbar'
import { ChartView } from './data-views/chart-view'
import { MapView } from './data-views/map-view'
import { TableView } from './data-views/table-view'

export interface DatasetPaneProps extends ReactProps {
  data: JsonStatData
  view: DataView
}

export const DataPane = (props: DatasetPaneProps) => {
  const { getCountryCode } = useCountries()
  const searchParams = useSearchParams()
  const indexKey = useTableStore((s) => s.indexKey)
  const pivotKey = useTableStore((s) => s.pivotKey)
  const filterByCol = useTableStore((s) => s.filterByCol)
  const pivotQueries = useTableStore((s) => s.pivotQueries)
  const initTableStore = useTableStore((s) => s.initTableStore)
  const [queries, setQueries] = useState<string[]>([])

  const pivotedData = useMemo(
    () => pivotJsonStatTable(props.data, { indexKey, pivotKey, filterByCol }),
    [props.data, indexKey, pivotKey, filterByCol],
  )
  const isColVisible = useCallback(
    (col: TableCol) => !col.pivoted || pivotQueries.some((keyword) => col.label.toLowerCase().includes(keyword)),
    [pivotQueries],
  )
  const visibleData = useMemo(() => {
    return pivotKey && pivotQueries.length
      ? { ...pivotedData, cols: pivotedData.cols.filter(isColVisible) }
      : pivotedData
  }, [pivotedData, pivotKey, pivotQueries, isColVisible])

  const chartData = useMemo(() => {
    return {
      ...visibleData,
      cols: pivotKey ? [...visibleData.cols, props.data.cols.find((col) => col.key === pivotKey)!] : visibleData.cols,
    }
  }, [visibleData, pivotKey, props.data])

  const cellFn = (value: string, query: string, flip?: boolean): ReactNode => {
    const flag = getCountryCode(value)
    const text = query ? <TextHighlight text={value} query={query} /> : value
    return flag ? (
      <div className="flex items-center">
        {flip && text}
        {flag && <span className={cx(`fi fi-${flag} shadow-xs`, flip ? 'ml-xs-2' : 'mr-xs-2')} />}
        {!flip && text}
      </div>
    ) : (
      <span title={value}>{text}</span>
    )
  }

  const onChangeQueries = (value: string[]) => {
    setUrlParam(UrlKey.DATA_QUERIES, value)
    setQueries(value)
  }

  const loadDataQueries = (fallback?: string[]) => {
    const queries = getUrlParamArray(UrlKey.DATA_QUERIES) || fallback || []
    setUrlParam(UrlKey.DATA_QUERIES, queries)
    setQueries(queries)
  }

  useEffect(() => {
    initTableStore(props.data)
    loadDataQueries()
  }, [props.data])

  useEffect(() => {
    // Reset all filters when reopening the same dataset
    if (!searchParams.has(UrlKey.INDEX_KEY)) {
      initTableStore(props.data)
      loadDataQueries(queries)
    }
  }, [searchParams])

  return (
    <div
      className={cx(
        'bg-color-bg-card border-color-border-subtle flex max-w-full flex-col rounded-md border',
        props.className,
      )}
    >
      <DataToolbar data={props.data} queries={queries} onChangeQueries={onChangeQueries} />

      {props.view === 'table' && (
        <TableView data={visibleData} queries={queries} cellFn={cellFn} className="min-h-0 flex-1 rounded-md" />
      )}
      {props.view === 'chart' && (
        <ChartView data={chartData} queries={queries} cellFn={cellFn} className="min-h-0 flex-1 rounded-md" />
      )}
      {props.view === 'map' && (
        <MapView data={visibleData} queries={queries} cellFn={cellFn} className="min-h-0 flex-1 rounded-md" />
      )}
    </div>
  )
}
