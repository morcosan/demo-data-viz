'use client'

import { EmptyState, SelectField, TextHighlight, Tooltip } from '@app-components'
import { useCountries, useTranslation } from '@app-i18n'
import { FilterSvg } from '@app/shared/assets'
import { EurostatConfig, type JsonStatData } from '@app/shared/utils/json-stat'
import { getUrlParamArray, setUrlParam } from '@app/shared/utils/url-query'
import { Button, useViewportService } from '@ds/core'
import { useSearchParams } from 'next/navigation'
import { type ReactNode, useEffect, useId, useMemo, useState } from 'react'
import { useFilterUtils } from '../_hooks/use-filter-utils'
import { useTableStore } from '../_hooks/use-table-store'
import { type DataView, UrlKey } from '../_types'
import { DataToolbar } from './data-toolbar'
import { ChartView } from './data-views/chart-view'
import { MapView } from './data-views/map-view'
import { TableView } from './data-views/table-view'
import { type ChartViewProps } from './data-views/types'

export interface DatasetPaneProps extends ReactProps {
  data: JsonStatData
  view: DataView
  statsCards: ReactNode
  viewToggle: ReactNode
  onOpenFilters: () => void
}

export const DataPane = (props: DatasetPaneProps) => {
  const { data, view, statsCards, viewToggle, className, onOpenFilters } = props
  const { t } = useTranslation()
  const fieldId = useId()
  const { isViewportMinMD } = useViewportService()
  const { getCountryIso2 } = useCountries()
  const { filterCount } = useFilterUtils({ data })
  const { CITY_KEY, GEO_KEY } = EurostatConfig
  const searchParams = useSearchParams()
  const pivotKey = useTableStore((s) => s.pivotKey)
  const tableData = useTableStore((s) => s.tableData)
  const chartData = useTableStore((s) => s.chartData)
  const chartValueOptions = useTableStore((s) => s.chartValueOptions)
  const chartValueKey = useTableStore((s) => s.chartValueKey)
  const setChartValueKey = useTableStore((s) => s.setChartValueKey)
  const initTableStore = useTableStore((s) => s.initTableStore)
  const updateData = useTableStore((s) => s.updateData)
  const pivotCol = data.cols.find((col) => col.key === pivotKey)
  const [queries, setQueries] = useState<string[]>([])
  const viewClass = cx('min-h-0 flex-1 rounded-md')
  const hasMap = useMemo(
    () => data.source === 'eurostat' && data.cols.some((col) => col.key === GEO_KEY || col.key === CITY_KEY),
    [data],
  )

  const cellFn = (value: string, query: string, flip?: boolean): ReactNode => {
    const flag = getCountryIso2(value).toLowerCase()
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
    tableData: chartData,
    colKey: chartValueKey,
    queries: queries,
    cellFn: cellFn,
    chartProps: { className: cx('rounded-b-md') },
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
    updateData(data)
  }, [data])

  useEffect(() => {
    // Reset all filters when reopening the same dataset
    if (!searchParams.has(UrlKey.INDEX_KEY)) {
      initTableStore(data)
      loadDataQueries(queries)
    }
  }, [searchParams])

  const chartToolbar = isViewportMinMD && chartValueOptions.length > 1 && (
    <div className="min-w-md-7 flex items-center">
      <Tooltip label={pivotCol ? pivotCol.label : t('core.label.value')}>
        <SelectField
          id={`${fieldId}-chart-value`}
          options={chartValueOptions}
          value={chartValueKey}
          onChange={setChartValueKey}
        />
      </Tooltip>
    </div>
  )

  const filtersButton = (
    <Button variant="text-default" size="sm" onClick={onOpenFilters}>
      <FilterSvg className="h-xs-7 mr-xs-1" />
      <span className="truncate">{t('dataViz.label.filtersModalButton', { count: filterCount })}</span>
    </Button>
  )

  return (
    <div className={cx('flex flex-col', className)}>
      {/* OUTER TOOLBAR */}
      <div className="sm:gap-xs-5 my-xs-3 md:my-xs-7 flex items-center sm:flex-wrap">
        {isViewportMinMD ? (
          statsCards
        ) : (
          <div className={cx('p-xs-1 bg-color-bg-card border-color-border-subtle rounded-md border')}>
            {filtersButton}
          </div>
        )}
        {viewToggle}
      </div>

      {/* PANE */}
      <div
        className={cx(
          'flex min-h-0 max-w-full flex-1 flex-col',
          'bg-color-bg-card border-color-border-subtle rounded-md border',
        )}
      >
        <DataToolbar
          data={data}
          queries={queries}
          filtersButton={isViewportMinMD ? filtersButton : null}
          onChangeQueries={onChangeQueries}
        />

        {view === 'table' && (
          <TableView tableData={tableData} queries={queries} cellFn={cellFn} className={viewClass} />
        )}
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
    </div>
  )
}
