import { SelectField, type SelectOption, type SelectValue } from '@app-components'
import { useTranslation } from '@app-i18n'
import { type TableCol } from '@app/shared/types/table'
import { QueryOperator } from '@app/shared/utils/formatting'
import { type JsonStatData } from '@app/shared/utils/json-stat'
import { CloseSvg, IconButton, Modal, TextField } from '@ds/core'
import { debounce } from 'lodash'
import { memo, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { SettingSection } from '../_components/setting-section'
import { useTableStore } from '../_hooks/use-table-store'

interface Props {
  opened: boolean
  data: JsonStatData
  indexOptions: SelectOption[]
  pivotOptions: SelectOption[]
  onClose: () => void
}

export const FiltersModal = (props: Props) => {
  const { data, opened, indexOptions, pivotOptions, onClose } = props
  const { t } = useTranslation()
  const indexKey = useTableStore((s) => s.indexKey)
  const pivotKey = useTableStore((s) => s.pivotKey)
  const filterByCol = useTableStore((s) => s.filterByCol)
  const setIndexKey = useTableStore((s) => s.setIndexKey)
  const setPivotKey = useTableStore((s) => s.setPivotKey)
  const setFilterByCol = useTableStore((s) => s.setFilterByCol)
  const resetPivotQueries = useTableStore((s) => s.resetPivotQueries)
  const pivotQueryRef = useRef<PivotQueryHandle>(null)

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
          id="filter-index-col"
          colKey=""
          colLabel={t('dataViz.label.fieldLabelForIndex')}
          value={indexKey}
          options={indexOptions}
          onChange={setIndexKey}
        />
        <SettingMemo
          id="filter-pivot-col"
          colKey=""
          colLabel={t('dataViz.label.fieldLabelForPivot')}
          value={pivotKey}
          options={pivotOptions}
          onChange={setPivotKey}
        />
      </SettingSection>

      {/* SECTION 2 */}
      <SettingSection
        header={t('dataViz.label.headerFiltersModal2', { count: filterCols.length + (pivotKey ? 1 : 0) })}
        className="mt-sm-7"
      >
        <PivotQueryMemo ref={pivotQueryRef} />

        {filterCols.map((col: TableCol, index: number) => (
          <SettingMemo
            key={col.key}
            id={`filter-other-${index}`}
            colKey={col.key}
            colLabel={col.label}
            value={filterByCol[col.key]}
            options={optionsByCol[col.key]}
            onChange={setFilterByCol}
          />
        ))}
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
const PivotQueryMemo = memo(function PivotQueryMemo({ ref }: ReactProps<PivotQueryHandle>) {
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
        <label htmlFor="filter-col-query">{t('dataViz.label.pivotQuery', { operator: QueryOperator.JOIN })}</label>
      </dt>
      <dd>
        <TextField
          value={query}
          id="filter-col-query"
          size="sm"
          ariaLabel={t('dataViz.label.pivotQuery', { operator: QueryOperator.JOIN })}
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
        <div className="text-size-xs text-color-text-subtle px-xs-1 pt-xs-0 font-weight-sm italic">
          {t('dataViz.notice.pivotQuery', { operator: QueryOperator.JOIN })}
        </div>
      </dd>
    </div>
  )
})
