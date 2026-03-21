import { SelectField, type SelectOption, type SelectValue } from '@app-components'
import { useTranslation } from '@app-i18n'
import { type TableCol } from '@app/shared/types/table'
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
  const { t } = useTranslation()
  const { cellsByCol, cols } = props.data
  const indexKey = useTableStore((s) => s.indexKey)
  const pivotKey = useTableStore((s) => s.pivotKey)
  const filterByCol = useTableStore((s) => s.filterByCol)
  const setIndexKey = useTableStore((s) => s.setIndexKey)
  const setPivotKey = useTableStore((s) => s.setPivotKey)
  const setFilterByCol = useTableStore((s) => s.setFilterByCol)
  const resetColQuery = useTableStore((s) => s.resetColQuery)
  const colQueryRef = useRef<ColQueryHandle>(null)

  const colKeys = useMemo(() => {
    return indexKey
      ? Object.keys(cellsByCol).filter((key) => key !== indexKey && key !== pivotKey && cellsByCol[key])
      : []
  }, [indexKey, pivotKey, cellsByCol])

  const filterCols = useMemo(
    () => colKeys.map((key) => cols.find((col) => col.key === key)).filter(Boolean) as TableCol[],
    [colKeys, cols],
  )

  const optionsByCol = useMemo(() => {
    return colKeys.reduce(
      (acc, key) => ({
        ...acc,
        [key]: cellsByCol[key].map((cell) => ({
          value: String(cell.code),
          label: String(cell.value),
        })),
      }),
      {} as Record<string, SelectOption[]>,
    )
  }, [colKeys, cellsByCol])

  useEffect(() => {
    resetColQuery(props.data).then(() => colQueryRef.current?.reset())
  }, [props.data, pivotKey])

  useEffect(() => {
    colQueryRef.current?.reset()
  }, [props.opened])

  return (
    <Modal
      opened={props.opened}
      width="md"
      title={t('dataViz.label.filtersModalTitle')}
      noFooter
      onClose={props.onClose}
    >
      {/* SECTION 1 */}
      <SettingSection header={t('dataViz.label.headerFiltersModal1')}>
        <SettingMemo
          id="filter-index-col"
          colKey=""
          colLabel={t('dataViz.label.fieldLabelForIndex')}
          value={indexKey}
          options={props.indexOptions}
          onChange={setIndexKey}
        />
        <SettingMemo
          id="filter-pivot-col"
          colKey=""
          colLabel={t('dataViz.label.fieldLabelForPivot')}
          value={pivotKey}
          options={props.pivotOptions}
          onChange={setPivotKey}
        />
      </SettingSection>

      {/* SECTION 2 */}
      <SettingSection
        header={t('dataViz.label.headerFiltersModal2', { count: filterCols.length + (pivotKey ? 1 : 0) })}
        className="mt-sm-7"
      >
        <ColQueryMemo ref={colQueryRef} />

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
  return (
    <div>
      <dt>
        <label htmlFor={props.id}>{props.colLabel}</label>
      </dt>
      <dd>
        <SelectField
          id={props.id}
          options={props.options}
          value={props.value}
          onChange={(value) => props.onChange(value, props.colKey)}
        />
      </dd>
    </div>
  )
})

interface ColQueryHandle {
  reset: () => void
}
const ColQueryMemo = memo(function ColQueryMemo(props: ReactProps<ColQueryHandle>) {
  const { t } = useTranslation()
  const pivotKey = useTableStore((s) => s.pivotKey)
  const pivotQuery = useTableStore((s) => s.pivotQuery)
  const setPivotQuery = useTableStore((s) => s.setPivotQuery)
  const [colQueryText, setColQueryText] = useState('')

  const resetColQueryText = () => {
    setColQueryText(pivotQuery.join(' OR '))
  }
  const handleColQueryChange = debounce((value: string) => {
    setColQueryText(value)
    setPivotQuery(
      value
        .split(' OR ')
        .map((v) => v.trim().toLowerCase())
        .filter(Boolean),
    )
  }, 300)
  const handleColQueryClear = () => {
    setColQueryText('')
    setPivotQuery([])
  }

  useImperativeHandle(props.ref, () => ({
    reset: resetColQueryText,
  }))

  if (!pivotKey) return null
  return (
    <div>
      <dt>
        <label htmlFor="filter-col-query">{t('dataViz.label.columnQuery')}</label>
      </dt>
      <dd>
        <TextField
          value={colQueryText}
          id="filter-col-query"
          size="sm"
          ariaLabel={t('dataViz.label.columnQuery')}
          suffix={
            colQueryText && (
              <IconButton
                tooltip={t('dataViz.action.clearColumnQuery')}
                variant="text-subtle"
                size="xs"
                onClick={handleColQueryClear}
              >
                <CloseSvg className="h-xs-7" />
              </IconButton>
            )
          }
          onChange={handleColQueryChange}
          onBlur={resetColQueryText}
        />
        <div className="text-size-xs text-color-text-subtle px-xs-1 pt-xs-0 font-weight-sm italic">
          {t('dataViz.notice.columnQuery')}
        </div>
      </dd>
    </div>
  )
})
