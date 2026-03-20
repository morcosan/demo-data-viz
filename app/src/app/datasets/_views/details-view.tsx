'use client'

import { QueryKey, useQuery } from '@app-api'
import { EmptyState, LayoutPane, LoadingSpinner, StatsCard } from '@app-components'
import { useTranslation } from '@app-i18n'
import type { TableCol } from '@app/shared/types/table'
import { formatDate, formatNumber } from '@app/shared/utils/formatting'
import {
  convertJsonStatToTable,
  EurostatConfig,
  JSON_STAT_VALUE_KEY,
  type JsonStatData,
} from '@app/shared/utils/json-stat'
import { useLocalStorage } from '@app/shared/utils/use-local-storage'
import { ArrowBackSvg, Button, IconButton, PreviewSvg, useViewportService, wait } from '@ds/core'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { EurostatApi } from '../_api/eurostat-api'
import { DatasetModal } from '../_partials/dataset-modal'
import { DatasetTable } from '../_partials/dataset-table'
import { useFullscreen } from '../_partials/use-fullscreen'
import { type Dataset, type ViewedDatasets } from '../_types'

interface Props extends ReactProps {
  onClickBack: () => void
}

export const DetailsView = (props: Props) => {
  const { t } = useTranslation()
  const { isViewportMinLG, isViewportMinXL, isViewportMD } = useViewportService()
  const fullscreen = useFullscreen('var(--ds-spacing-xs-5)')
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
  const getColLabel = (col: TableCol) => {
    if (col.key === JSON_STAT_VALUE_KEY) return t('core.label.value')
    if (col.key === EurostatConfig.GEO_KEY) return t('dataViz.label.eurostatGeo')
    return col.label
  }
  const [tableData, tableLoading, tableError] = useQuery<JsonStatData>({
    queryKey: [QueryKey.JSON_STAT_TABLE, idParam, dataset?.updatedAt],
    queryFn: async () => {
      const data = await convertJsonStatToTable(dataset!.jsonStatStr)
      return { ...data, cols: data.cols.map((col) => ({ ...col, label: getColLabel(col) })) }
    },
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

  if (loading || !tableData || !dataset) {
    return (
      <LayoutPane className="flex-center flex w-full">
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
    <div className="flex w-full">
      {fullscreen.Overlay}
      <LayoutPane
        ref={fullscreen.elemRef}
        className={cx('py-xs-5 px-xs-5 lg:px-xs-8 flex w-full flex-col')}
        style={fullscreen.elemStyle}
      >
        {/* HEADER */}
        <div className="flex">
          <IconButton
            tooltip={t('core.action.back')}
            size="sm"
            className="mr-xs-1 lg:hidden!"
            onClick={props.onClickBack}
          >
            <ArrowBackSvg className="h-xs-7" />
          </IconButton>

          <h2 title={dataset.title} className="text-size-lg font-weight-md mr-xs-5 ml-px line-clamp-3">
            {dataset.title}
          </h2>

          <div className="gap-xs-2 ml-auto flex">
            {isViewportMinXL || isViewportMD ? (
              <Button variant="text-default" size="sm" onClick={() => setOpenedDetails(true)}>
                <PreviewSvg className="h-xs-8 mr-xs-2 -mt-xs-0" />
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

            {isViewportMinLG && fullscreen.Button}
          </div>
        </div>

        {/* CARDS */}
        <div className="gap-xs-5 my-xs-7 flex flex-wrap">
          <StatsCard label={t('core.label.dataSize')}>
            {formatNumber(dataset.stats?.colsCount)} x {formatNumber(dataset.stats?.rowsCount)}
          </StatsCard>

          <StatsCard label={t('core.label.lastUpdate')}>{formatDate(dataset.updatedAt)}</StatsCard>

          <StatsCard label={t('core.label.source')}>
            {dataset.source === 'eurostat' && <span className="fi fi-eu shadow-xs" />}
            <span className="ml-xs-0">{dataset.source === 'eurostat' ? 'Eurostat' : 'Unknown'}</span>
          </StatsCard>
        </div>

        {/* TABLE */}
        <DatasetTable data={tableData} className="min-h-0 flex-1" />

        {/* MODAL */}
        <DatasetModal opened={openedDetails} dataset={dataset} onClose={() => setOpenedDetails(false)} />
      </LayoutPane>
    </div>
  )
}
