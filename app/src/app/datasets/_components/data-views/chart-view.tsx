'use client'

import { BarChart, type BarChartData } from '@app-components'
import { useTranslation } from '@app-i18n'
import { type TableData } from '@app/shared/types/table'
import { Button, TOKENS } from '@ds/core'
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
  const [colKey, setColKey] = useState('')
  const barCols = props.data.cols.filter((col) => col.key !== indexKey)
  const chartData = useMemo((): BarChartData => ({ entries: props.data.rows }), [props.data])
  const barLabels = useMemo((): Record<string, string> => ({ [colKey]: colKey }), [colKey])

  useEffect(() => {
    setColKey(barCols[0].key)
  }, [props.data, indexKey])

  return indexKey ? (
    <div className={cx('p-xs-9 flex', props.className)}>
      {/* CHART */}
      <BarChart
        data={chartData}
        barLabels={barLabels}
        labelKey={indexKey}
        labelFn={props.cellFn}
        labelWidth={parseFloat(TOKENS.SPACING['lg-1'].$value)}
        className="mr-sm-0 h-full flex-1"
      />

      {/* COLUMNS */}
      <ul className="gap-xs-1 flex flex-col">
        {barCols.map((col) => (
          <li key={col.key}>
            <Button
              variant={col.key === colKey ? 'item-solid-secondary' : 'item-text-default'}
              className="border-color-border-default! w-full border"
              onClick={() => setColKey(col.key)}
            >
              {col.label}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <div className="flex-center flex h-full">{t('dataViz.error.noIndexColumn')}</div>
  )
}
