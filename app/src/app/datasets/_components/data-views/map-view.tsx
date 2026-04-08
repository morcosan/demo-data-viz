import { Choropleth, EmptyState, type ChoroplethData } from '@app-components'
import { useTranslation } from '@app-i18n'
import { type TableData } from '@app/shared/types/table'
import { useMemo, type ReactNode } from 'react'
import { useTableStore } from '../../_hooks/use-table-store'

interface Props extends ReactProps {
  data: TableData
  queries: string[]
  cellFn: (value: string, query: string) => ReactNode
}

export const MapView = (props: Props) => {
  const { data, queries, cellFn: cellFnProp, className } = props
  const { t } = useTranslation()
  const indexKey = useTableStore((s) => s.indexKey)
  const pivotKey = useTableStore((s) => s.pivotKey)
  const indexCol = data.cols.find((col) => col.key === indexKey)
  const pivotCol = data.cols.find((col) => col.key === pivotKey)

  const choroplethData = useMemo((): ChoroplethData => {
    return {
      countries: [],
    }
  }, [data])

  return !choroplethData ? (
    <div className={cx('flex-center flex h-full', className)}>
      <EmptyState>{t('dataViz.error.noDataForFilters')}</EmptyState>
    </div>
  ) : !indexKey ? (
    <div className={cx('flex-center flex h-full', className)}>
      <EmptyState>{t('dataViz.error.noIndexColumn')}</EmptyState>
    </div>
  ) : (
    <Choropleth data={choroplethData} queries={queries} className={className} />
  )
}
