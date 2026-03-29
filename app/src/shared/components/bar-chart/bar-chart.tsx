'use client'

import { useTranslation } from '@app-i18n'
import { TOKENS, useDefaults, wait } from '@ds/core'
import { useEffect, useRef, useState } from 'react'
import { EmptyState } from '../empty-state/empty-state'
import { LoadingSpinner } from '../loading-spinner/loading-spinner'
import { ChartCanvas } from './_partials/chart-canvas'
import { Toolbar } from './_partials/toolbar'
import { useScrolling } from './_partials/use-scrolling'
import { useSorting } from './_partials/use-sorting'
import { type BarChartData, type BarChartEntry, type BarChartProps } from './_types'

export type { BarChartData, BarChartEntry, BarChartProps }

export const BarChart = (rawProps: BarChartProps) => {
  const props = useDefaults(rawProps, {
    entryWidth: parseFloat(TOKENS.SPACING['md-5'].$value),
    chartSize: 'md',
    query: '',
  })
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const hoverRef = useRef<Element | null>(null)
  const tooltipRef = useRef<Element | null>(null)
  const barKeys = Object.keys(props.barNames)
  const { handleKeyDown } = useScrolling({ hoverRef, tooltipRef })
  const { entries, sortKey, sortDir, toggleSort } = useSorting({ ...props, barKeys })

  useEffect(() => {
    // Show 200ms loading to avoid UI freeze due to large data
    setIsLoading(true)
    wait(200).then(() => setIsLoading(false))
  }, [props.data])

  return (
    <div className={cx('bg-color-bg-card flex w-full flex-col', props.className)} style={props.style}>
      <Toolbar
        barNames={props.barNames}
        entryKey={props.entryKey}
        entryName={props.entryName}
        entryWidth={props.entryWidth!}
        sortKey={sortKey}
        sortDir={sortDir}
        toolbar={props.toolbar}
        className="p-xs-1"
        onSort={toggleSort}
      />

      <div
        className="a11y-outline-proxy px-xs-2 pt-xs-3 pb-xs-1 min-h-0 flex-1 overflow-auto"
        style={{ outlineOffset: '-1px' }} // Needed due to toolbar overlap
        onKeyDownCapture={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isLoading || props.loading ? (
          <div className="flex-center flex h-full">
            <LoadingSpinner />
          </div>
        ) : entries.length ? (
          <ChartCanvas
            {...props}
            entries={entries}
            barKeys={barKeys}
            isFocused={isFocused}
            isHovered={isHovered}
            hoverRef={hoverRef}
            tooltipRef={tooltipRef}
          />
        ) : (
          <div className="flex-center flex h-full">
            <EmptyState type="empty">{t('dataViz.error.noData')}</EmptyState>
          </div>
        )}
      </div>
    </div>
  )
}
