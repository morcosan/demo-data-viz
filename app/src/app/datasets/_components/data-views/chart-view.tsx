'use client'

import { BarChart, type BarChartData, SelectField, type SelectOption } from '@app-components'
import { useTranslation } from '@app-i18n'
import { type TableData } from '@app/shared/types/table'
import { TOKENS } from '@ds/core'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { useTableStore } from '../../_hooks/use-table-store'

interface Props extends ReactProps {
  data: TableData
  query: string
  cellFn: (value: string, query: string) => ReactNode
}

export const ChartView = (props: Props) => {
  const { t } = useTranslation()
  const indexKey = useTableStore((s) => s.indexKey)
  const pivotKey = useTableStore((s) => s.pivotKey)
  const [colKey, setColKey] = useState<string | null>(null)
  const indexCol = props.data.cols.find((col) => col.key === indexKey)!
  const pivotCol = props.data.cols.find((col) => col.key === pivotKey)!
  const barCols = props.data.cols.filter((col) => col.key !== indexKey && col.key !== pivotKey)
  const chartData = useMemo(
    (): BarChartData => ({
      entries: props.data.rows.map((row) => ({
        [indexKey]: row[indexKey],
        [pivotKey]: row[colKey || ''],
      })),
    }),
    [indexKey, pivotKey, colKey, props.data],
  )
  const colOptions = useMemo(
    (): SelectOption[] => barCols.map((col) => ({ value: col.key, label: col.label })),
    [barCols],
  )

  useEffect(() => {
    setColKey(barCols[0].key)
  }, [props.data, indexKey])

  return indexKey ? (
    <BarChart
      data={chartData}
      barNames={{ [pivotKey]: pivotCol.label }}
      entryKey={indexKey}
      entryName={indexCol.label}
      entryFn={props.cellFn}
      entryWidth={parseFloat(TOKENS.SPACING['lg-1'].$value)}
      chartSize="sm"
      className={props.className}
      toolbar={
        <div className="gap-x-xs-3 ml-auto flex items-center">
          <label htmlFor="chart-col-key">{pivotCol.label}:</label>
          <SelectField id="chart-col-key" options={colOptions} value={colKey} onChange={setColKey} />
        </div>
      }
    />
  ) : (
    <div className="flex-center flex h-full">{t('dataViz.error.noIndexColumn')}</div>
  )
}
