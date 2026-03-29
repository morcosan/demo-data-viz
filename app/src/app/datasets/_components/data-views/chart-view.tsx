'use client'

import { BarChart, type BarChartData, EmptyState, SelectField, type SelectOption } from '@app-components'
import { useTranslation } from '@app-i18n'
import { type TableData } from '@app/shared/types/table'
import { TOKENS } from '@ds/core'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { useTableStore } from '../../_hooks/use-table-store'

interface Props extends ReactProps {
  data: TableData
  query: string
  cellFn: (value: string, query: string, flip?: boolean) => ReactNode
}

export const ChartView = (props: Props) => {
  const { t } = useTranslation()
  const indexKey = useTableStore((s) => s.indexKey)
  const pivotKey = useTableStore((s) => s.pivotKey)
  const [colKey, setColKey] = useState<string | null>(null)
  const VALUE_KEY = 'value'
  const indexCol = props.data.cols.find((col) => col.key === indexKey)
  const pivotCol = props.data.cols.find((col) => col.key === pivotKey)
  const barCols = props.data.cols.filter((col) => col.key !== indexKey && col.key !== pivotKey)
  const barNames = { [VALUE_KEY]: pivotCol ? pivotCol.label : t('core.label.value') }
  const chartData = useMemo(
    (): BarChartData => ({
      entries: props.data.rows.map((row) => ({
        [indexKey]: row[indexKey],
        [VALUE_KEY]: row[colKey || ''],
      })),
    }),
    [indexKey, pivotKey, colKey, props.data],
  )
  const colOptions = useMemo(
    (): SelectOption[] => barCols.map((col) => ({ value: col.key, label: col.label })),
    [barCols],
  )

  const cellFn = (value: string, query: string) => props.cellFn(value, query, true)

  useEffect(() => {
    setColKey(barCols[0]?.key || null)
  }, [props.data, indexKey])

  return !colKey ? (
    <div className={cx('flex-center flex h-full', props.className)}>
      <EmptyState>{t('dataViz.error.noDataForFilters')}</EmptyState>
    </div>
  ) : !indexKey ? (
    <div className={cx('flex-center flex h-full', props.className)}>
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
      query={props.query}
      toolbar={
        <div className="gap-x-xs-3 min-w-md-7 flex flex-1 items-center justify-end">
          <label htmlFor="chart-col-key" className="pt-xs-0">
            {barNames[VALUE_KEY]}:
          </label>
          <SelectField id="chart-col-key" options={colOptions} value={colKey} onChange={setColKey} />
        </div>
      }
      className={props.className}
    />
  )
}
