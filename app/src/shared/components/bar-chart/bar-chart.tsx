'use client'

import { useTranslation } from '@app-i18n'
import { TOKENS, wait } from '@ds/core'
import { useEffect, useRef, useState } from 'react'
import { EmptyState } from '../empty-state/empty-state'
import { LoadingSpinner } from '../loading-spinner/loading-spinner'
import { Chart } from './_partials/chart'
import { Toolbar } from './_partials/toolbar'
import { useScrolling } from './_partials/use-scrolling'
import { useSorting } from './_partials/use-sorting'
import { type BarChartProps } from './_types'

export type * from './_types'

export const BarChart = (props: BarChartProps) => {
  const {
    barNames,
    chartSize = 'md',
    className,
    data,
    emptyState,
    entryKey,
    entryName,
    entryWidth = parseFloat(TOKENS.SPACING['md-5'].$value),
    loading,
    queries = [],
    style,
    toolbar,
  } = props
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const hoverRef = useRef<Element>(null)
  const tooltipRef = useRef<Element>(null)
  const barKeys = Object.keys(barNames)
  const { handleKeyDown } = useScrolling({ hoverRef, tooltipRef })
  const { entries, sortKey, sortDir, toggleSort } = useSorting({ ...props, barKeys, chartSize, queries })

  useEffect(() => {
    // Show 200ms loading to avoid UI freeze due to large data
    setIsLoading(true)
    wait(200).then(() => setIsLoading(false))
  }, [data])

  return (
    <div className={cx('bg-color-bg-card flex w-full flex-col', className)} style={style}>
      <Toolbar
        barNames={barNames}
        entryKey={entryKey}
        entryName={entryName}
        entryWidth={entryWidth}
        sortKey={sortKey}
        sortDir={sortDir}
        toolbar={toolbar}
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
        {isLoading || loading ? (
          <div className="flex-center flex h-full">
            <LoadingSpinner />
          </div>
        ) : entries.length ? (
          <Chart
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
            {emptyState || <EmptyState variant="empty">{t('dataViz.error.noData')}</EmptyState>}
          </div>
        )}
      </div>
    </div>
  )
}
