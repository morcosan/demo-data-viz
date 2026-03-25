import { DataTable } from '@app-components'
import { type TableData } from '@app/shared/types/table'
import { type ReactNode } from 'react'
import { useTableStore } from '../../_hooks/use-table-store'

interface Props extends ReactProps {
  data: TableData
  query: string
  cellFn: (value: string, query: string) => ReactNode
}

export const TableView = (props: Props) => {
  const indexKey = useTableStore((s) => s.indexKey)
  const pivotKey = useTableStore((s) => s.pivotKey)

  return (
    <DataTable
      data={props.data}
      query={props.query}
      cellFn={props.cellFn}
      sticky={Boolean(indexKey && pivotKey)}
      className={props.className}
    />
  )
}
