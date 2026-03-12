import { DataTable, TextHighlight } from '@app-components'
import { useCountries } from '@app-i18n'
import { type TableCol, type TableRowValue } from '@app/shared/types/table'
import { type JsonStatData, pivotJsonStatTable } from '@app/shared/utils/json-stat'
import { type ReactNode, useCallback, useEffect, useMemo } from 'react'
import { useTableStore } from '../_table-store'
import { TableToolbar } from './table-toolbar'

interface Props extends ReactProps {
  data: JsonStatData
}

export const DatasetTable = (props: Props) => {
  const { getCountryCode } = useCountries()
  const indexColKey = useTableStore((s) => s.indexColKey)
  const pivotColKey = useTableStore((s) => s.pivotColKey)
  const filterByCol = useTableStore((s) => s.filterByCol)
  const colQuery = useTableStore((s) => s.colQuery)
  const initTableStore = useTableStore((s) => s.initTableStore)

  const pivotedData = useMemo(
    () => pivotJsonStatTable(props.data, { indexColKey, pivotColKey, filterByCol }),
    [props.data, indexColKey, pivotColKey, filterByCol],
  )
  const isColVisible = useCallback(
    (col: TableCol) => col.key === indexColKey || colQuery.some((keyword) => col.label.toLowerCase().includes(keyword)),
    [indexColKey, colQuery],
  )
  const visibleData = useMemo(() => {
    return pivotColKey && colQuery.length
      ? { ...pivotedData, cols: pivotedData.cols.filter(isColVisible) }
      : pivotedData
  }, [pivotedData, pivotColKey, colQuery, isColVisible])

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
      data={visibleData}
      cellFn={cellFn}
      toolbar={<TableToolbar data={props.data} />}
      className={props.className}
    />
  )
}
