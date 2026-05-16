'use client'

import { QueryKey, useQuery } from '@app-api'
import { EmptyState, LayoutPane, LoadingSpinner, StatsCard } from '@app-components'
import { useTranslation } from '@app-i18n'
import { type TableCol } from '@app/shared/types/table'
import { formatDate, formatNumber } from '@app/shared/utils/formatting'
import {
  convertJsonStatToTable,
  EurostatConfig,
  JSON_STAT_VALUE_KEY,
  type JsonStatData,
} from '@app/shared/utils/json-stat'
import { getUrlParam, setUrlParam } from '@app/shared/utils/url-query'
import { useLocalStorage } from '@app/shared/utils/use-local-storage'
import { ArrowBackSvg, Button, IconButton, InfoSvg, useViewportService, wait } from '@ds/core'
import { useSearchParams } from 'next/navigation'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { EurostatApi } from '../_api/eurostat-api'
import { DataPane, type DatasetPaneProps } from '../_components/data-pane'
import { ViewToggle } from '../_components/view-toggle'
import { useFullscreen } from '../_hooks/use-fullscreen'
import { DetailsModal } from '../_modals/details-modal'
import { FiltersModal } from '../_modals/filters-modal'
import { type Dataset, type DataView, UrlKey, type ViewedDatasets } from '../_types'

interface Props extends ReactProps {
  onClickBack: () => void
}

export const DetailsSection = ({ onClickBack }: Props) => {
  const { t } = useTranslation()
  const { isViewportMinSM, isViewportMinLG } = useViewportService()
  const DATA_VIEW_VALUES = ['table', 'chart', 'map'] as const satisfies DataView[]
  const fullscreen = useFullscreen({ padding: 'var(--ds-spacing-xs-5)' })
  const storage = useLocalStorage<ViewedDatasets>(QueryKey.VIEWED_DATASETS)
  const searchParams = useSearchParams()
  const idParam = searchParams.get('id') || ''
  const [prevIdParam, setPrevIdParam] = useState(idParam)
  const [openedDetails, setOpenedDetails] = useState(false)
  const [openedFilters, setOpenedFilters] = useState(false)
  const [dataView, setDataView] = useState<DataView>('table')
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
  const [data, dataLoading, dataError] = useQuery<JsonStatData>({
    queryKey: [QueryKey.JSON_STAT_TABLE, idParam, dataset?.updatedAt],
    queryFn: async () => {
      const data = await convertJsonStatToTable(dataset!.jsonStatStr)
      return { ...data, cols: data.cols.map((col) => ({ ...col, label: getColLabel(col) })) }
    },
    enabled: Boolean(dataset),
  })
  const loading = datasetLoading || dataLoading || prevIdParam !== idParam
  const error = datasetError || dataError

  const saveViewedDataset = (dataset: Dataset) => {
    storage.setItem({
      ...(storage.data || {}),
      [dataset.id]: {
        colsCount: dataset.stats?.colsCount || 0,
        rowsCount: dataset.stats?.rowsCount || 0,
      },
    })
  }

  const handleDataViewChange = useCallback(
    (view: DataView) => {
      setUrlParam(UrlKey.DATA_VIEW, view)
      setDataView(view)
    },
    [setDataView, setUrlParam],
  )

  const handleOpenFilters = useCallback(() => setOpenedFilters(true), [setOpenedFilters])

  const loadDataView = () => {
    const view = getUrlParam(UrlKey.DATA_VIEW) as DataView | null
    const isValid = view && DATA_VIEW_VALUES.includes(view)
    isValid ? setDataView(view) : setUrlParam(UrlKey.DATA_VIEW, dataView)
  }

  useEffect(() => {
    setOpenedDetails(false)
    // Show 200ms loading when id changes to avoid UI freeze due to large data
    wait(200).then(() => setPrevIdParam(idParam))
  }, [idParam])

  useEffect(() => {
    dataset && saveViewedDataset(dataset)
    loadDataView()
  }, [dataset])

  const statsCards = useMemo(() => {
    return (
      <>
        <StatsCard label={t('core.label.dataSize')}>
          {formatNumber(dataset?.stats?.colsCount)} x {formatNumber(dataset?.stats?.rowsCount)}
        </StatsCard>
        <StatsCard label={t('core.label.lastUpdate')}>{formatDate(dataset?.updatedAt)}</StatsCard>
        <StatsCard label={t('core.label.source')}>
          {dataset?.source === 'eurostat' && <span className="fi fi-eu shadow-xs" />}
          <span className="ml-xs-0">{dataset?.source === 'eurostat' ? 'Eurostat' : 'Unknown'}</span>
        </StatsCard>
      </>
    )
  }, [dataset])

  const viewToggle = useMemo(
    () => <ViewToggle view={dataView} onChange={handleDataViewChange} />,
    [dataView, handleDataViewChange],
  )

  if (loading || !data || !dataset) {
    return (
      <LayoutPane className="flex-center flex w-full">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <EmptyState variant="error">{t('dataViz.error.fetchDataset')}</EmptyState>
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
        data-testid="dataset-details"
      >
        {/* HEADER */}
        <div className="flex">
          <IconButton
            tooltip={t('core.action.back')}
            size="sm"
            className="mr-xs-1 -ml-xs-1 lg:hidden!"
            onClick={onClickBack}
          >
            <ArrowBackSvg className="h-xs-7" />
          </IconButton>

          <h2 title={dataset.title} className="text-size-lg font-weight-md mr-xs-5 ml-px truncate">
            {dataset.title}
          </h2>

          <div className="gap-xs-2 ml-auto flex">
            {isViewportMinSM ? (
              <Button variant="text-default" size="sm" onClick={() => setOpenedDetails(true)}>
                <InfoSvg className="h-xs-8 mr-xs-2" />
                {t('core.label.details')}
              </Button>
            ) : (
              <IconButton
                tooltip={t('core.label.details')}
                variant="text-default"
                size="sm"
                className="ml-auto"
                onClick={() => setOpenedDetails(true)}
              >
                <InfoSvg className="h-xs-8" />
              </IconButton>
            )}

            {isViewportMinLG && fullscreen.Button}
          </div>
        </div>

        {/* DATA */}
        <DataPaneMemo
          data={data}
          view={dataView}
          statsCards={statsCards}
          viewToggle={viewToggle}
          className="min-h-0 flex-1"
          onOpenFilters={handleOpenFilters}
        />

        {/* MODAL */}
        <DetailsModal opened={openedDetails} dataset={dataset} onClose={() => setOpenedDetails(false)} />
        <FiltersModal opened={openedFilters} data={data} view={dataView} onClose={() => setOpenedFilters(false)} />
      </LayoutPane>
    </div>
  )
}

/**********************************************************************************************************************
 * Memo
 */

const DataPaneMemo = memo(function DataPaneMemo(props: DatasetPaneProps) {
  return <DataPane {...props} />
})
