import { DataTable, EmptyState } from '@app-components'
import { useTranslation } from '@app-i18n'
import { useViewportService } from '@ds/core'
import { useTableStore } from '../../_hooks/use-table-store'
import { type TableViewProps } from './types'

export const TableView = (props: TableViewProps) => {
  const { tableData, queries, cellFn, className } = props
  const { isViewportMinMD } = useViewportService()
  const { t } = useTranslation()
  const indexKey = useTableStore((s) => s.indexKey)
  const pivotKey = useTableStore((s) => s.pivotKey)

  return (
    <DataTable
      data={tableData}
      queries={queries}
      cellFn={cellFn}
      sticky={Boolean(indexKey && pivotKey && isViewportMinMD)}
      emptyState={<EmptyState>{t('dataViz.error.noDataForFilters')}</EmptyState>}
      className={className}
    />
  )
}
