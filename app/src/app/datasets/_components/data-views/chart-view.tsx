import { TextHighlight } from '@app-components'
import { useCountries, useTranslation } from '@app-i18n'
import { type TableData } from '@app/shared/types/table'
import { Button } from '@ds/core'
import { type ReactNode, useEffect, useState } from 'react'
import { useTableStore } from '../../_hooks/use-table-store'

interface Props extends ReactProps {
  data: TableData
  query: string
}

export const ChartView = (props: Props) => {
  const { t } = useTranslation()
  const { getCountryCode } = useCountries()
  const indexKey = useTableStore((s) => s.indexKey)
  const pivotKey = useTableStore((s) => s.pivotKey)
  const [xAxisKey, setXAxisKey] = useState('')

  const xAxisCols = props.data.cols.filter((col) => col.key !== indexKey)

  const cellFn = (value: string, query: string): ReactNode => {
    const flag = getCountryCode(value)
    return (
      <>
        {flag && <span className={`fi fi-${flag} mr-xs-2 shadow-xs`} />}
        {query ? <TextHighlight text={value} query={query} /> : value}
      </>
    )
  }

  useEffect(() => {
    setXAxisKey(xAxisCols[0].key)
  }, [props.data, indexKey])

  return indexKey ? (
    <div className={cx('p-xs-9 flex', props.className)}>
      {/* CHART */}
      <div className="flex-1">Chart</div>

      {/* COLUMNS */}
      <ul className="gap-xs-1 flex flex-col">
        {xAxisCols.map((col) => (
          <li key={col.key}>
            <Button
              variant={col.key === xAxisKey ? 'item-solid-secondary' : 'item-text-default'}
              className="border-color-border-default! w-full border"
              onClick={() => setXAxisKey(col.key)}
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
