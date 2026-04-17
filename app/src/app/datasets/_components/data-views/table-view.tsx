import { DataTable, EmptyState } from '@app-components'
import { useTranslation } from '@app-i18n'
import { useTableStore } from '../../_hooks/use-table-store'
import { type TableViewProps } from './types'

export const TableView = (props: TableViewProps) => {
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
