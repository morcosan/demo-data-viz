'use client'

import { QueryKey, useQuery } from '@app-api'
import { DataTable, EmptyState, LayoutPane, LoadingSpinner } from '@app-components'
import { useCountries, useTranslation } from '@app-i18n'
import { convertJsonStatToTable, formatDate, formatNumber, type TableRowValue, useLocalStorage } from '@app-utils'
import { useSearchParams } from 'next/navigation'
import { type ReactNode, useEffect, useMemo } from 'react'
import { EurostatApi } from '../_api/eurostat-api'
import { type Dataset, type ViewedDatasets } from '../_types'
import { StatsCard } from './stats-card'

export const DatasetPreview = (props: ReactProps) => {
  const { t } = useTranslation()
  const { getCountryCode } = useCountries()
  const storage = useLocalStorage<ViewedDatasets>(QueryKey.VIEWED_DATASETS)
  const searchParams = useSearchParams()
  const idParam = searchParams.get('id') || ''
  const { data, isLoading, error } = useQuery<Dataset>({
    queryKey: [QueryKey.EUROSTAT_DATASET, idParam],
    queryFn: () => EurostatApi.fetchDataset(idParam),
    enabled: Boolean(idParam),
  })
  const dataset = data
  const tableData = useMemo(() => (dataset ? convertJsonStatToTable(dataset?.jsonStat) : null), [dataset])

  const saveViewedDataset = (dataset: Dataset) => {
    storage.setItem({
      ...(storage.data || {}),
      [dataset.id]: {
        colsCount: dataset.stats?.colsCount || 0,
        rowsCount: dataset.stats?.rowsCount || 0,
      },
    })
  }

  const cellFn = (value: TableRowValue): ReactNode => {
    const flag = getCountryCode(String(value))
    return (
      <>
        {flag && <span className={`fi fi-${flag} mr-xs-2 shadow-xs`} />}
        {value}
      </>
    )
  }

  useEffect(() => {
    dataset && saveViewedDataset(dataset)
  }, [dataset])

  if (isLoading || !tableData || !dataset) {
    return (
      <LayoutPane className={cx('flex-center flex', props.className)}>
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <EmptyState type="error">{t('dataViz.error.fetchDataset')}</EmptyState>
        ) : (
          <EmptyState>{t('dataViz.error.noDatasetSelected')}</EmptyState>
        )}
      </LayoutPane>
    )
  }

  return (
    <LayoutPane className={cx('py-xs-5 px-xs-8 flex flex-col', props.className)}>
      <h2 className="mb-xs-5 text-size-lg font-weight-md">{dataset.title}</h2>

      <div className="gap-xs-5 mb-xs-5 flex flex-wrap">
        <StatsCard label={t('dataViz.label.dataSize')}>
          {formatNumber(dataset.stats?.colsCount)} x {formatNumber(dataset.stats?.rowsCount)}
        </StatsCard>

        <StatsCard label={t('dataViz.label.lastUpdate')}>{formatDate(dataset.updatedAt)}</StatsCard>

        <StatsCard label={t('dataViz.label.source')}>
          {dataset.source === 'eurostat' && <span className="fi fi-eu shadow-xs" />}
          <span className="ml-xs-0">{dataset.source === 'eurostat' ? 'Eurostat' : 'Unknown'}</span>
        </StatsCard>

        <StatsCard label={t('dataViz.label.datasetId')}>{dataset.id}</StatsCard>
      </div>

      <DataTable
        data={tableData}
        cellFn={cellFn}
        className="border-color-border-subtle min-h-0 flex-1 rounded-md border"
      />
    </LayoutPane>
  )
}
