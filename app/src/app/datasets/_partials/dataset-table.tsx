'use client'

import { DataTable, TextHighlight } from '@app-components'
import { useCountries } from '@app-i18n'
import { type TableCol } from '@app/shared/types/table'
import { type JsonStatData, pivotJsonStatTable } from '@app/shared/utils/json-stat'
import { useSearchParams } from 'next/navigation'
import { type ReactNode, useCallback, useEffect, useMemo } from 'react'
import { UrlKey, useTableStore } from '../_table-store'
import { TableToolbar } from './table-toolbar'

interface Props extends ReactProps {
  data: JsonStatData
}

export const DatasetTable = (props: Props) => {
  const { getCountryCode } = useCountries()
  const searchParams = useSearchParams()
  const indexKey = useTableStore((s) => s.indexKey)
  const pivotKey = useTableStore((s) => s.pivotKey)
  const filterByCol = useTableStore((s) => s.filterByCol)
  const colQuery = useTableStore((s) => s.colQuery)
  const initTableStore = useTableStore((s) => s.initTableStore)
  const resetColQuery = useTableStore((s) => s.resetColQuery)

  const pivotedData = useMemo(
    () => pivotJsonStatTable(props.data, { indexKey, pivotKey, filterByCol }),
    [props.data, indexKey, pivotKey, filterByCol],
  )
  const isColVisible = useCallback(
    (col: TableCol) => !col.pivoted || colQuery.some((keyword) => col.label.toLowerCase().includes(keyword)),
    [colQuery],
  )
  const visibleData = useMemo(() => {
    return pivotKey && colQuery.length ? { ...pivotedData, cols: pivotedData.cols.filter(isColVisible) } : pivotedData
  }, [pivotedData, pivotKey, colQuery, isColVisible])

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
    initTableStore(props.data)
  }, [props.data])

  useEffect(() => {
    // Reset all filters when reopening the same dataset
    if (!searchParams.has(UrlKey.INDEX_KEY)) {
      initTableStore(props.data)
      resetColQuery(props.data)
    }
  }, [searchParams])

  return (
    <DataTable
      data={visibleData}
      sticky={Boolean(indexKey && pivotKey)}
      cellFn={cellFn}
      toolbar={<TableToolbar data={props.data} />}
      className={props.className}
    />
  )
}
