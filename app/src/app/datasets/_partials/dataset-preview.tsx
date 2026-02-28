'use client'

import { QueryKey, useQuery } from '@app-api'
import { DataTable, EmptyState, LayoutPane, LoadingSpinner, StatsCard, TextHighlight } from '@app-components'
import { useCountries, useTranslation } from '@app-i18n'
import { formatDate, formatNumber } from '@app/shared/utils/formatting'
import { convertJsonStatToTable, type TableData, type TableRowValue } from '@app/shared/utils/json-stat'
import { useLocalStorage } from '@app/shared/utils/use-local-storage'
import { ArrowBackSvg, Button, FullscreenSvg, IconButton, PreviewSvg, useViewportService, wait } from '@ds/core'
import { useSearchParams } from 'next/navigation'
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react'
import { EurostatApi } from '../_api/eurostat-api'
import { type Dataset, type ViewedDatasets } from '../_types'
import { DatasetModal } from './dataset-modal'

const useFullscreen = (padding: string) => {
  const [enabled, setEnabled] = useState(false)
  const [isExpanding, setIsExpanding] = useState(false)
  const [isCollapsing, setIsCollapsing] = useState(false)
  const targetRef = useRef<HTMLDivElement>(null)
  const [clientRect, setClientRect] = useState<DOMRect | null>(null)
  const isFullscreen = isExpanding || isCollapsing
  const duration = 300

  const targetStyle: CSSProperties = {
    transitionProperty: isFullscreen ? 'all' : undefined,
    transitionDuration: isFullscreen ? `${duration}ms` : undefined,
    position: isFullscreen ? 'fixed' : undefined,
    top: isExpanding ? padding : clientRect?.top,
    left: isExpanding ? padding : clientRect?.left,
    width: isExpanding ? `calc(100vw - 2 * ${padding})` : clientRect?.width,
    height: isExpanding ? `calc(100vh - 2 * ${padding})` : clientRect?.height,
  }

  const handleExpandToggle = () => {
    if (!enabled) {
      // Expanding
      setClientRect(targetRef.current?.getBoundingClientRect() || null)
      setEnabled(true)
      requestAnimationFrame(() => setIsExpanding(true))
    } else {
      // Collapsing
      setEnabled(false)
      setIsExpanding(false)
      setIsCollapsing(true)
      wait(duration).then(() => {
        setIsCollapsing(false)
        setClientRect(null)
      })
    }
  }

  return {
    handleExpandToggle,
    isFullscreen,
    targetRef,
    targetStyle,
  }
}

interface Props extends ReactProps {
  onClickBack: () => void
}

export const DatasetPreview = (props: Props) => {
  const { t } = useTranslation()
  const { isViewportMinXL, isViewportMinLG } = useViewportService()
  const { getCountryCode } = useCountries()
  const storage = useLocalStorage<ViewedDatasets>(QueryKey.VIEWED_DATASETS)
  const searchParams = useSearchParams()
  const idParam = searchParams.get('id') || ''
  const [prevIdParam, setPrevIdParam] = useState(idParam)
  const [openedDetails, setOpenedDetails] = useState(false)
  const { targetRef, targetStyle, isFullscreen, handleExpandToggle } = useFullscreen('var(--ds-spacing-xs-5)')
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
  const titleIconTooltip = isViewportMinLG
    ? isFullscreen
      ? t('core.action.collapseView')
      : t('core.action.expandView')
    : t('core.action.back')

  const saveViewedDataset = (dataset: Dataset) => {
    storage.setItem({
      ...(storage.data || {}),
      [dataset.id]: {
        colsCount: dataset.stats?.colsCount || 0,
        rowsCount: dataset.stats?.rowsCount || 0,
      },
    })
  }

  const handleTitleIconClick = () => (isViewportMinLG ? handleExpandToggle() : props.onClickBack())

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
    <div className={cx('flex w-full', isFullscreen && 'z-modal')}>
      {/* OVERLAY */}
      <div
        className={cx(
          'bg-color-modal-overlay-subtle z-[-1] transition-opacity duration-300',
          isFullscreen ? 'fixed-overlay opacity-100' : 'opacity-0',
        )}
      ></div>

      {/* CONTENT */}
      <LayoutPane ref={targetRef} className={cx('py-xs-5 px-xs-5 lg:px-xs-8 flex w-full flex-col')} style={targetStyle}>
        {/* HEADER */}
        <div className="flex">
          <IconButton tooltip={titleIconTooltip} size="sm" className="mr-xs-1" onClick={handleTitleIconClick}>
            <ArrowBackSvg className="h-xs-7 lg:hidden" />
            <FullscreenSvg className="h-xs-9 hidden lg:block" />
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
        <DataTable data={tableData} cellFn={cellFn} className="min-h-0 flex-1" />

        {/* MODAL */}
        <DatasetModal opened={openedDetails} dataset={dataset} onClose={() => setOpenedDetails(false)} />
      </LayoutPane>
    </div>
  )
}
