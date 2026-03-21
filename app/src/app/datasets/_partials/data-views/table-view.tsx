import { DataTable, TextHighlight } from '@app-components'
import { useCountries } from '@app-i18n'
import { type TableData } from '@app/shared/types/table'
import { type ReactNode } from 'react'
import { useTableStore } from '../../_hooks/use-table-store'

interface Props extends ReactProps {
  data: TableData
  query: string
}

export const TableView = (props: Props) => {
  const { getCountryCode } = useCountries()
  const indexKey = useTableStore((s) => s.indexKey)
  const pivotKey = useTableStore((s) => s.pivotKey)

  const cellFn = (value: string, query: string): ReactNode => {
    const flag = getCountryCode(value)
    return (
      <>
        {flag && <span className={`fi fi-${flag} mr-xs-2 shadow-xs`} />}
        {query ? <TextHighlight text={value} query={query} /> : value}
      </>
    )
  }

  return (
    <DataTable
      data={props.data}
      query={props.query}
      cellFn={cellFn}
      sticky={Boolean(indexKey && pivotKey)}
      className={props.className}
    />
  )
}
