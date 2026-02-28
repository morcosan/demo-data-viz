'use client'

import { QueryKey, useQuery } from '@app-api'
import { DataTable, EmptyState, LayoutPane, LoadingSpinner, StatsCard, TextHighlight } from '@app-components'
import { useCountries, useTranslation } from '@app-i18n'
import { formatDate, formatNumber } from '@app/shared/utils/formatting'
import { convertJsonStatToTable, type TableData, type TableRowValue } from '@app/shared/utils/json-stat'
import { useLocalStorage } from '@app/shared/utils/use-local-storage'
import { ArrowBackSvg, Button, IconButton, PreviewSvg, useViewportService, wait } from '@ds/core'
import { useSearchParams } from 'next/navigation'
import { type ReactNode, useEffect, useState } from 'react'
import { EurostatApi } from '../_api/eurostat-api'
import { type Dataset, type MobileView, type ViewedDatasets } from '../_types'
import { DatasetModal } from './dataset-modal'

interface Props extends ReactProps {
  mobileView: MobileView
  onClickBack: () => void
}

export const DatasetPreview = (props: Props) => {
  const { t } = useTranslation()
  const { isViewportMinXL } = useViewportService()
  const { getCountryCode } = useCountries()
  const storage = useLocalStorage<ViewedDatasets>(QueryKey.VIEWED_DATASETS)
  const searchParams = useSearchParams()
  const idParam = searchParams.get('id') || ''
  const [prevIdParam, setPrevIdParam] = useState(idParam)
  const [openedDetails, setOpenedDetails] = useState(false)
  const [dataset, datasetLoading, datasetError] = useQuery<Dataset>({
    queryKey: [QueryKey.EUROSTAT_DATASET, idParam],
    queryFn: () => EurostatApi.fetchDataset(idParam),
    enabled: Boolean(idParam),
  })
  const [tableData, tableLoading, tableError] = useQuery<TableData>({
    queryKey: [QueryKey.JSON_STAT_TABLE, idParam, dataset?.updatedAt],
    queryFn: () => convertJsonStatToTable(dataset!.jsonStatStr),
    enabled: Boolean(dataset),
  })
  const loading = datasetLoading || tableLoading || prevIdParam !== idParam
  const error = datasetError || tableError

  const saveViewedDataset = (dataset: Dataset) => {
    storage.setItem({
      ...(storage.data || {}),
      [dataset.id]: {
        colsCount: dataset.stats?.colsCount || 0,
        rowsCount: dataset.stats?.rowsCount || 0,
      },
    })
  }

  useEffect(() => {
    setOpenedDetails(false)
    // Show 200ms loading when id changes to avoid UI freeze due to large data
    wait(200).then(() => setPrevIdParam(idParam))
  }, [idParam])

  useEffect(() => {
    dataset && saveViewedDataset(dataset)
  }, [dataset])

  const cellFn = (value: TableRowValue, query: string): ReactNode => {
    const text = String(value ?? '')
    const flag = getCountryCode(text)
    return (
      <>
        {flag && <span className={`fi fi-${flag} mr-xs-2 shadow-xs`} />}
        <TextHighlight text={text} query={query} />
      </>
    )
  }

  if (loading || !tableData || !dataset) {
    return (
      <LayoutPane className={cx('flex-center flex', props.className)}>
        {loading ? (
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
    <LayoutPane className={cx('py-xs-5 px-xs-5 lg:px-xs-8 flex flex-col', props.className)}>
      {/* HEADER */}
      <div className="flex">
        <IconButton
          tooltip={t('core.action.back')}
          size="sm"
          className={cx('mr-xs-1', props.mobileView === 'listing' && 'hidden!', 'translate-y-px lg:hidden!')}
          onClick={props.onClickBack}
        >
          <ArrowBackSvg className="h-xs-7" />
        </IconButton>

        <h2 title={dataset.title} className="text-size-lg font-weight-md mr-xs-5 line-clamp-3">
          {dataset.title}
        </h2>

        {isViewportMinXL ? (
          <Button variant="text-default" size="sm" className="ml-auto" onClick={() => setOpenedDetails(true)}>
            <PreviewSvg className="h-xs-8 mr-xs-3" />
            {t('dataViz.action.viewDetails')}
          </Button>
        ) : (
          <IconButton
            tooltip={t('dataViz.action.viewDetails')}
            variant="text-default"
            size="sm"
            className="ml-auto"
            onClick={() => setOpenedDetails(true)}
          >
            <PreviewSvg className="h-xs-8" />
          </IconButton>
        )}
      </div>

      {/* CARDS */}
      <div className="gap-xs-5 my-xs-7 flex flex-wrap">
        <StatsCard label={t('dataViz.label.dataSize')}>
          {formatNumber(dataset.stats?.colsCount)} x {formatNumber(dataset.stats?.rowsCount)}
        </StatsCard>

        <StatsCard label={t('dataViz.label.lastUpdate')}>{formatDate(dataset.updatedAt)}</StatsCard>

        <StatsCard label={t('dataViz.label.source')}>
          {dataset.source === 'eurostat' && <span className="fi fi-eu shadow-xs" />}
          <span className="ml-xs-0">{dataset.source === 'eurostat' ? 'Eurostat' : 'Unknown'}</span>
        </StatsCard>
      </div>

      {/* TABLE */}
      <DataTable
        data={tableData}
        cellFn={cellFn}
        className="min-h-0 flex-1"
        tableClassName="border-color-border-subtle rounded-md border"
      />

      {/* MODAL */}
      <DatasetModal opened={openedDetails} dataset={dataset} onClose={() => setOpenedDetails(false)} />
    </LayoutPane>
  )
}
