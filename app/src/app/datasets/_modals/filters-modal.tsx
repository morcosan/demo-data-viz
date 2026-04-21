import { FieldCaption, SelectField, type SelectOption, type SelectValue } from '@app-components'
import { useTranslation } from '@app-i18n'
import { type TableCol } from '@app/shared/types/table'
import { QueryOperator } from '@app/shared/utils/formatting'
import { type JsonStatData } from '@app/shared/utils/json-stat'
import { CloseSvg, IconButton, Modal, TextField } from '@ds/core'
import { debounce } from 'lodash'
import { memo, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { SettingSection } from '../_components/setting-section'
import { useFilterUtils } from '../_hooks/use-filter-utils'
import { useTableStore } from '../_hooks/use-table-store'
import { type DataView } from '../_types'

interface Props {
  opened: boolean
  data: JsonStatData
  view: DataView
  onClose: () => void
}

export const FiltersModal = (props: Props) => {
  const { data, view, opened, onClose } = props
  const { filterCount, indexOptions, pivotOptions } = useFilterUtils({ data })
  const { t } = useTranslation()
  const fieldId = useId()
  const indexKey = useTableStore((s) => s.indexKey)
  const pivotKey = useTableStore((s) => s.pivotKey)
  const filterByCol = useTableStore((s) => s.filterByCol)
  const chartValueOptions = useTableStore((s) => s.chartValueOptions)
  const chartValueKey = useTableStore((s) => s.chartValueKey)
  const setIndexKey = useTableStore((s) => s.setIndexKey)
  const setPivotKey = useTableStore((s) => s.setPivotKey)
  const setFilterByCol = useTableStore((s) => s.setFilterByCol)
  const resetPivotQueries = useTableStore((s) => s.resetPivotQueries)
  const setChartValueKey = useTableStore((s) => s.setChartValueKey)
  const pivotQueryRef = useRef<PivotQueryHandle>(null)
  const pivotCol = data.cols.find((col) => col.key === pivotKey)

  const colKeys = useMemo(() => {
    return indexKey
      ? Object.keys(data.cellsByCol).filter((key) => key !== indexKey && key !== pivotKey && data.cellsByCol[key])
      : []
  }, [indexKey, pivotKey, data.cellsByCol])

  const filterCols = useMemo(
    () => colKeys.map((key) => data.cols.find((col) => col.key === key)).filter(Boolean) as TableCol[],
    [colKeys, data.cols],
  )

  const optionsByCol = useMemo(() => {
    return colKeys.reduce(
      (acc, key) => ({
        ...acc,
        [key]: data.cellsByCol[key].map((cell) => ({
          value: String(cell.code),
          label: String(cell.value),
        })),
      }),
      {} as Record<string, SelectOption[]>,
    )
  }, [colKeys, data.cellsByCol])

  useEffect(() => {
    resetPivotQueries(data).then(() => pivotQueryRef.current?.reset())
  }, [data, pivotKey])

  useEffect(() => {
    pivotQueryRef.current?.reset()
  }, [opened])

  return (
    <Modal opened={opened} width="md" title={t('dataViz.label.filtersModalTitle')} noFooter onClose={onClose}>
      {/* SECTION 1 */}
      <SettingSection header={t('dataViz.label.headerFiltersModal1')}>
        <SettingMemo
          id={`${fieldId}-index`}
          colKey=""
          colLabel={t('dataViz.label.fieldLabelForIndex')}
          value={indexKey}
          options={indexOptions}
          onChange={setIndexKey}
        />
        <SettingMemo
          id={`${fieldId}-pivot`}
          colKey=""
          colLabel={t('dataViz.label.fieldLabelForPivot')}
          value={pivotKey}
          options={pivotOptions}
          onChange={setPivotKey}
        />
      </SettingSection>

      {/* SECTION 2 */}
      <SettingSection header={t('dataViz.label.headerFiltersModal2', { count: filterCount })} className="mt-sm-7">
        {/* PIVOT QUERY */}
        <PivotQueryMemo ref={pivotQueryRef} fieldId={fieldId} />

        {/* FILTER BY COL */}
        {filterCols.map((col: TableCol, index: number) => (
          <SettingMemo
            key={col.key}
            id={`${fieldId}-by-col-${index}`}
            colKey={col.key}
            colLabel={col.label}
            value={filterByCol[col.key]}
            options={optionsByCol[col.key]}
            onChange={setFilterByCol}
          />
        ))}

        {/* CHART VALUE */}
        {chartValueOptions.length > 1 && (
          <div>
            <dt>
              <label htmlFor={`${fieldId}-chart-value`}>{pivotCol ? pivotCol.label : t('core.label.value')}</label>
            </dt>
            <dd>
              <SelectField
                id={`${fieldId}-chart-value`}
                options={chartValueOptions}
                value={chartValueKey}
                disabled={view === 'table'}
                ariaDescribedBy={`${fieldId}-chart-value-hint`}
                onChange={setChartValueKey}
              />
              <FieldCaption id={`${fieldId}-chart-value-hint`}>{t('dataViz.notice.chartValueField')}</FieldCaption>
            </dd>
          </div>
        )}
      </SettingSection>
    </Modal>
  )
}

/**********************************************************************************************************************
 * Memo
 */

interface SettingProps {
  id: string
  colKey: string
  colLabel: string
  value: SelectValue
  options: SelectOption[]
  onChange: ((value: SelectValue) => void) | ((value: SelectValue, key: string) => void)
}
const SettingMemo = memo(function SettingMemo(props: SettingProps) {
  const { id, value, options, colKey, colLabel, onChange } = props
  return (
    <div>
      <dt>
        <label htmlFor={id}>{colLabel}</label>
      </dt>
      <dd>
        <SelectField id={id} options={options} value={value} onChange={(value) => onChange(value, colKey)} />
      </dd>
    </div>
  )
})

interface PivotQueryHandle {
  reset: () => void
}
interface PivotQueryProps extends ReactProps<PivotQueryHandle> {
  fieldId: string
}
const PivotQueryMemo = memo(function PivotQueryMemo(props: PivotQueryProps) {
  const { ref, fieldId } = props
  const { t } = useTranslation()
  const pivotKey = useTableStore((s) => s.pivotKey)
  const pivotQueries = useTableStore((s) => s.pivotQueries)
  const setPivotQueries = useTableStore((s) => s.setPivotQueries)
  const [query, setQuery] = useState('')

  const resetQuery = () => {
    setQuery(pivotQueries.join(QueryOperator.JOIN))
  }

  const handleQueryChange = useMemo(() => {
    return debounce((value: string) => {
      setQuery(value)
      setPivotQueries(
        value
          .split(QueryOperator.SPLIT)
          .map((v) => v.trim().toLowerCase())
          .filter(Boolean),
      )
    }, 300)
  }, [setPivotQueries])

  const handleQueryClear = () => {
    setQuery('')
    setPivotQueries([])
  }

  useImperativeHandle(ref, () => ({
    reset: resetQuery,
  }))

  if (!pivotKey) return null
  return (
    <div>
      <dt>
        <label htmlFor={`${fieldId}-pivot-query`}>
          {t('dataViz.label.pivotQuery', { operator: QueryOperator.JOIN })}
        </label>
      </dt>
      <dd>
        <TextField
          value={query}
          id={`${fieldId}-pivot-query`}
          size="sm"
          ariaLabel={t('dataViz.label.pivotQuery', { operator: QueryOperator.JOIN })}
          ariaDescribedBy={`${fieldId}-pivot-query-hint`}
          suffix={
            query && (
              <IconButton
                tooltip={t('dataViz.action.clearQuery')}
                variant="text-subtle"
                size="xs"
                onClick={handleQueryClear}
              >
                <CloseSvg className="h-xs-7" />
              </IconButton>
            )
          }
          onChange={handleQueryChange}
          onBlur={resetQuery}
        />
        <FieldCaption id={`${fieldId}-pivot-query-hint`}>
          {t('dataViz.notice.pivotQuery', { operator: QueryOperator.JOIN })}
        </FieldCaption>
      </dd>
    </div>
  )
})
