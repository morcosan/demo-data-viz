'use client'

import { BarChart, type BarChartData, EmptyState, SelectField, type SelectOption } from '@app-components'
import { useTranslation } from '@app-i18n'
import { type TableData } from '@app/shared/types/table'
import { TOKENS } from '@ds/core'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { useTableStore } from '../../_hooks/use-table-store'

interface Props extends ReactProps {
  data: TableData
  queries: string[]
  cellFn: (value: string, query: string, flip?: boolean) => ReactNode
}

export const ChartView = (props: Props) => {
  const { data, queries, cellFn: cellFnProp, className } = props
  const { t } = useTranslation()
  const indexKey = useTableStore((s) => s.indexKey)
  const pivotKey = useTableStore((s) => s.pivotKey)
  const [colKey, setColKey] = useState<string | null>(null)
  const VALUE_KEY = 'value'
  const VALUE_LABEL = t('core.label.value')
  const indexCol = data.cols.find((col) => col.key === indexKey)
  const pivotCol = data.cols.find((col) => col.key === pivotKey)
  const barNames = { [VALUE_KEY]: VALUE_LABEL }
  const barCols = useMemo(
    () => data.cols.filter((col) => col.key !== indexKey && col.key !== pivotKey),
    [data.cols, indexKey, pivotKey],
  )
  const chartData = useMemo(
    (): BarChartData => ({
      entries: data.rows.map((row) => ({
        [indexKey]: row[indexKey],
        [VALUE_KEY]: row[colKey || ''],
      })),
    }),
    [data.rows, indexKey, colKey],
  )
  const colOptions = useMemo(
    (): SelectOption[] => barCols.map((col) => ({ value: col.key, label: col.label })),
    [barCols],
  )
  const hasValues = chartData.entries.some((entry) => entry[colKey] !== undefined)

  const cellFn = (value: string, query: string) => cellFnProp(value, query, true)

  useEffect(() => {
    setColKey(barCols[0]?.key || null)
  }, [barCols])

  return !colKey || !hasValues ? (
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
      entryFn={cellFn}
      entryWidth={parseFloat(TOKENS.SPACING['lg-1'].$value)}
      chartSize="sm"
      sortKey={VALUE_KEY}
      sortDir="desc"
      queries={queries}
      toolbar={
        <div className="gap-x-xs-3 min-w-md-7 flex flex-1 items-center justify-end">
          <label htmlFor="chart-col-key">{pivotCol ? pivotCol.label : VALUE_LABEL}:</label>
          <SelectField id="chart-col-key" options={colOptions} value={colKey} onChange={setColKey} />
        </div>
      }
      className={className}
    />
  )
}
