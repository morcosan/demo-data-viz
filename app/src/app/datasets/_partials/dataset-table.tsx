import { DataTable, TextHighlight } from '@app-components'
import { useCountries } from '@app-i18n'
import { type TableRowValue } from '@app/shared/types/table'
import { type JsonStatData, pivotJsonStatTable } from '@app/shared/utils/json-stat'
import { type ReactNode, useEffect, useMemo } from 'react'
import { useTableStore } from '../_table-store'
import { TableToolbar } from './table-toolbar'

interface Props extends ReactProps {
  data: JsonStatData
}

export const DatasetTable = (props: Props) => {
  const { getCountryCode } = useCountries()
  const { indexColKey, pivotColKey, filterByCol, initTableStore } = useTableStore()

  const pivotedData = useMemo(
    () => pivotJsonStatTable(props.data, { indexColKey, pivotColKey, filterByCol }),
    [props.data, indexColKey, pivotColKey, filterByCol],
  )

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

  useEffect(() => {
    initTableStore(props.data)
  }, [props.data])

  return (
    <DataTable
      data={pivotedData}
      cellFn={cellFn}
      toolbar={<TableToolbar data={props.data} />}
      className={props.className}
    />
  )
}
