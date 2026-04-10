'use client'

import { BarChart, type BarChartData, EmptyState } from '@app-components'
import { useTranslation } from '@app-i18n'
import { TOKENS } from '@ds/core'
import { useMemo } from 'react'
import { useTableStore } from '../../_hooks/use-table-store'
import { type ChartViewProps } from './types'

export const ChartView = (props: ChartViewProps) => {
  const { data, colKey, queries, cellFn, toolbar, className } = props
  const { t } = useTranslation()
  const indexKey = useTableStore((s) => s.indexKey)
  const indexCol = data.cols.find((col) => col.key === indexKey)
  const VALUE_KEY = 'value'
  const barNames = { [VALUE_KEY]: t('core.label.value') }

  const chartData = useMemo(
    (): BarChartData => ({
      entries: data.rows.map((row) => ({
        [indexKey]: row[indexKey],
        [VALUE_KEY]: row[colKey || ''],
      })),
    }),
    [data.rows, indexKey, colKey],
  )
  const hasData = chartData.entries.some((entry) => entry[VALUE_KEY] !== undefined)

  const entryFn = (value: string, query: string) => cellFn(value, query, true)

  return !colKey || !hasData ? (
    <div className={cx('flex-center flex h-full', className)}>
      <EmptyState>{t('dataViz.error.noDataForFilters')}</EmptyState>
    </div>
  ) : !indexKey ? (
    <div className={cx('flex-center flex h-full', className)}>
      <EmptyState>{t('dataViz.error.noIndexColumn')}</EmptyState>
    </div>
  ) : (
    <BarChart
      data={chartData}
      barNames={barNames}
      entryKey={indexKey}
      entryName={indexCol?.label || ''}
      entryFn={entryFn}
      entryWidth={parseFloat(TOKENS.SPACING['lg-1'].$value)}
      chartSize="sm"
      sortKey={VALUE_KEY}
      sortDir="desc"
      queries={queries}
      toolbar={toolbar}
      className={className}
    />
  )
}
