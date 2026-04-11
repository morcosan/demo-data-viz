'use client'

import { EmptyState, SelectField, type SelectOption, TextHighlight, Tooltip } from '@app-components'
import { useCountries, useTranslation } from '@app-i18n'
import type { ChartViewProps } from '@app/app/datasets/_components/data-views/types'
import { type TableCol } from '@app/shared/types/table'
import { EurostatConfig, type JsonStatData, pivotJsonStatTable } from '@app/shared/utils/json-stat'
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

export const DataPane = ({ data, view, className }: DatasetPaneProps) => {
  const { t } = useTranslation()
  const { getCountryIso2 } = useCountries()
  const searchParams = useSearchParams()
  const indexKey = useTableStore((s) => s.indexKey)
  const pivotKey = useTableStore((s) => s.pivotKey)
  const filterByCol = useTableStore((s) => s.filterByCol)
  const pivotQueries = useTableStore((s) => s.pivotQueries)
  const initTableStore = useTableStore((s) => s.initTableStore)
  const pivotCol = data.cols.find((col) => col.key === pivotKey)
  const [queries, setQueries] = useState<string[]>([])
  const [chartValueColKey, setChartValueColKey] = useState<string | null>(null)
  const { GEO_KEY } = EurostatConfig
  const hasMap = useMemo(() => data.source === 'eurostat' && data.cols.some((col) => col.key === GEO_KEY), [data])
  const viewClass = cx('min-h-0 flex-1 rounded-md')

  const pivotedData = useMemo(
    () => pivotJsonStatTable(data, { indexKey, pivotKey, filterByCol }),
    [data, indexKey, pivotKey, filterByCol],
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
      cols: pivotCol ? [...visibleData.cols, pivotCol] : visibleData.cols,
    }
  }, [visibleData, pivotCol, data])

  const chartValueCols = useMemo(
    () => chartData.cols.filter((col) => col.key !== indexKey && col.key !== pivotKey),
    [chartData.cols, indexKey, pivotKey],
  )
  const chartValueOptions = useMemo(
    (): SelectOption[] => chartValueCols.map((col) => ({ value: col.key, label: col.label })),
    [chartValueCols],
  )

  const cellFn = (value: string, query: string, flip?: boolean): ReactNode => {
    const flag = getCountryIso2(value)
    const text = query ? <TextHighlight text={value} query={query} /> : value
    return flag ? (
      <div className="flex items-center">
        {flip && text}
        {flag && <span className={cx(`fi fi-${flag} shadow-xs`, flip ? 'ml-xs-2' : 'mr-xs-2 mb-xs-0')} />}
        {!flip && text}
      </div>
    ) : (
      <span title={value}>{text}</span>
    )
  }

  const chartProps: ChartViewProps = {
    data: chartData,
    colKey: chartValueColKey,
    queries: queries,
    cellFn: cellFn,
    className: viewClass,
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
    initTableStore(data)
    loadDataQueries()
  }, [data])

  useEffect(() => {
    // Reset all filters when reopening the same dataset
    if (!searchParams.has(UrlKey.INDEX_KEY)) {
      initTableStore(data)
      loadDataQueries(queries)
    }
  }, [searchParams])

  useEffect(() => {
    setChartValueColKey(chartValueCols[0]?.key || null)
  }, [chartValueCols])

  const chartToolbar = chartValueOptions.length > 1 && (
    <div className="min-w-md-7 flex items-center">
      <Tooltip label={pivotCol ? pivotCol.label : t('core.label.value')}>
        <SelectField
          id="chart-col-key"
          options={chartValueOptions}
          value={chartValueColKey}
          onChange={setChartValueColKey}
        />
      </Tooltip>
    </div>
  )

  return (
    <div
      className={cx(
        'bg-color-bg-card border-color-border-subtle flex max-w-full flex-col rounded-md border',
        className,
      )}
    >
      <DataToolbar data={data} queries={queries} onChangeQueries={onChangeQueries} />

      {view === 'table' && <TableView data={visibleData} queries={queries} cellFn={cellFn} className={viewClass} />}
      {view === 'chart' && <ChartView {...chartProps} toolbar={chartToolbar} />}
      {view === 'map' &&
        (hasMap ? (
          <MapView {...chartProps} toolbar={chartToolbar} />
        ) : (
          <div className={cx('flex-center flex h-full', viewClass)}>
            <EmptyState>{t('dataViz.error.noMapForDataset')}</EmptyState>
          </div>
        ))}
    </div>
  )
}
