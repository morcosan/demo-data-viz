import { DataTable, EmptyState } from '@app-components'
import { useTranslation } from '@app-i18n'
import { type TableData } from '@app/shared/types/table'
import { type ReactNode } from 'react'
import { useTableStore } from '../../_hooks/use-table-store'

interface Props extends ReactProps {
  data: TableData
  queries: string[]
  cellFn: (value: string, query: string) => ReactNode
}

export const TableView = (props: Props) => {
  const { data, queries, cellFn, className } = props
  const { t } = useTranslation()
  const indexKey = useTableStore((s) => s.indexKey)
  const pivotKey = useTableStore((s) => s.pivotKey)

  return (
    <DataTable
      data={data}
      queries={queries}
      cellFn={cellFn}
      sticky={Boolean(indexKey && pivotKey)}
      emptyState={<EmptyState>{t('dataViz.error.noDataForFilters')}</EmptyState>}
      className={className}
    />
  )
}
