import { SearchField, SelectField, Tooltip } from '@app-components'
import { useTranslation } from '@app-i18n'
import { QueryOperator } from '@app/shared/utils/formatting'
import type { JsonStatData } from '@app/shared/utils/json-stat'
import { CloseSvg } from '@ds/core'
import { memo, type ReactNode, useEffect, useId, useRef, useState } from 'react'
import { useFilterUtils } from '../_hooks/use-filter-utils'
import { useTableStore } from '../_hooks/use-table-store'

interface Props {
  data: JsonStatData
  queries: string[]
  filtersButton: ReactNode
  onChangeQueries: (value: string[]) => void
}

export const DataToolbar = (props: Props) => {
  const { data, queries, filtersButton, onChangeQueries } = props
  const { t } = useTranslation()
  const fieldId = useId()
  const [query, setQuery] = useState('')
  const isQueryDirty = useRef(false)

  const handleQueryChange = (value: string) => {
    isQueryDirty.current = true
    setQuery(value)
    onChangeQueries(
      value
        .split(QueryOperator.SPLIT)
        .map((v) => v.trim().toLowerCase())
        .filter(Boolean),
    )
  }

  const resetQuery = () => {
    isQueryDirty.current = false
    setQuery(queries.join(QueryOperator.JOIN))
  }

  useEffect(() => {
    if (!isQueryDirty.current) {
      setQuery(queries.join(QueryOperator.JOIN))
    }
  }, [queries])

  return (
    <div
      className={cx(
        'p-xs-2 gap-xs-3 flex flex-wrap items-center justify-between',
        'border-color-border-subtle border-b',
      )}
    >
      {filtersButton && <IndexPivotMemo data={data} fieldId={fieldId} />}
      {filtersButton}

      <SearchField
        id={`${fieldId}-search`}
        value={query}
        label={t('dataViz.action.searchData', { operator: QueryOperator.JOIN })}
        className="xl:max-w-lg-9 min-w-md-9 flex-1 lg:ml-auto"
        onChange={handleQueryChange}
        onBlur={resetQuery}
      />
    </div>
  )
}

/**********************************************************************************************************************
 * Memo
 */

interface RowColProps {
  data: JsonStatData
  fieldId: string
}

const IndexPivotMemo = memo(function IndexPivotMemo(props: RowColProps) {
  const { data, fieldId } = props
  const { t } = useTranslation()
  const { indexOptions, pivotOptions } = useFilterUtils({ data })
  const indexKey = useTableStore((s) => s.indexKey)
  const pivotKey = useTableStore((s) => s.pivotKey)
  const setIndexKey = useTableStore((s) => s.setIndexKey)
  const setPivotKey = useTableStore((s) => s.setPivotKey)
  const fieldClass = cx('lg:min-w-lg-0 min-w-md-8 max-w-lg-5 flex-1')

  return (
    <div className="flex max-w-fit flex-1 items-center">
      <Tooltip label={t('dataViz.label.fieldLabelForIndex')}>
        <SelectField
          id={`${fieldId}-index`}
          options={indexOptions}
          value={indexKey}
          className={fieldClass}
          onChange={setIndexKey}
        />
      </Tooltip>

      <CloseSvg className="h-xs-4 mx-xs-2 text-color-text-placeholder" />

      <Tooltip label={t('dataViz.label.fieldLabelForPivot')}>
        <SelectField
          id={`${fieldId}-pivot`}
          options={pivotOptions}
          value={pivotKey}
          className={fieldClass}
          onChange={setPivotKey}
        />
      </Tooltip>
    </div>
  )
})
