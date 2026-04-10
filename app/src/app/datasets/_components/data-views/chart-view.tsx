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
  const { data, queries, cellFn, className } = props
  const { t } = useTranslation()
  const indexKey = useTableStore((s) => s.indexKey)
  const pivotKey = useTableStore((s) => s.pivotKey)
  const [colKey, setColKey] = useState<string | null>(null)
  const indexCol = data.cols.find((col) => col.key === indexKey)
  const pivotCol = data.cols.find((col) => col.key === pivotKey)
  const valueCols = useMemo(
    () => data.cols.filter((col) => col.key !== indexKey && col.key !== pivotKey),
    [data.cols, indexKey, pivotKey],
  )
  const VALUE_KEY = 'value'
  const VALUE_LABEL = t('core.label.value')
  const barNames = { [VALUE_KEY]: VALUE_LABEL }

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

  const valueOptions = useMemo(
    (): SelectOption[] => valueCols.map((col) => ({ value: col.key, label: col.label })),
    [valueCols],
  )

  const entryFn = (value: string, query: string) => cellFn(value, query, true)

  useEffect(() => {
    setColKey(valueCols[0]?.key || null)
  }, [valueCols])

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
      toolbar={
        <div className="gap-x-xs-3 min-w-md-7 flex flex-1 items-center justify-end">
          <label htmlFor="chart-col-key" className="font-weight-lg">
            {pivotCol ? pivotCol.label : VALUE_LABEL}:
          </label>
          <SelectField id="chart-col-key" options={valueOptions} value={colKey} onChange={setColKey} />
        </div>
      }
      className={className}
    />
  )
}
