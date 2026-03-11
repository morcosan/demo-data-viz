import { SelectField, type SelectOption, type SelectValue } from '@app-components'
import { useTranslation } from '@app-i18n'
import { type TableCol } from '@app/shared/types/table'
import { type JsonStatData } from '@app/shared/utils/json-stat'
import { Modal } from '@ds/core'
import { memo, useMemo } from 'react'
import { useTableStore } from '../_table-store'
import { SettingList } from './setting-list'

interface Props {
  opened: boolean
  data: JsonStatData
  indexOptions: SelectOption[]
  pivotOptions: SelectOption[]
  onClose: () => void
}

export const FiltersModal = (props: Props) => {
  const { t } = useTranslation()
  const { indexColKey, pivotColKey, filterByCol, setIndexColKey, setPivotColKey, setFilterByCol } = useTableStore()
  const { cellsByCol, cols } = props.data

  const colKeys = useMemo(() => {
    return indexColKey
      ? Object.keys(cellsByCol).filter((key) => key !== indexColKey && key !== pivotColKey && cellsByCol[key])
      : []
  }, [indexColKey, pivotColKey, cellsByCol])

  const filterCols = useMemo(
    () => colKeys.map((key) => cols.find((col) => col.key === key)).filter(Boolean) as TableCol[],
    [colKeys, cols],
  )

  const optionsByCol = useMemo(() => {
    return colKeys.reduce(
      (acc, key) => ({
        ...acc,
        [key]: cellsByCol[key].map((cell) => ({
          value: String(cell.value),
          label: String(cell.value),
        })),
      }),
      {} as Record<string, SelectOption[]>,
    )
  }, [colKeys, cellsByCol])

  return (
    <Modal opened={props.opened} width="md" title={t('dataViz.label.filtersTitle')} noFooter onClose={props.onClose}>
      <SettingList header={t('dataViz.label.headerMainFilters')}>
        <SettingMemo
          colKey=""
          colLabel={t('dataViz.label.fieldLabelForIndex')}
          value={indexColKey}
          options={props.indexOptions}
          onChange={setIndexColKey}
        />
        <SettingMemo
          colKey=""
          colLabel={t('dataViz.label.fieldLabelForPivot')}
          value={pivotColKey}
          options={props.pivotOptions}
          onChange={setPivotColKey}
        />
      </SettingList>

      {filterCols.length > 0 && (
        <SettingList header={t('dataViz.label.headerOtherFilters', { count: filterCols.length })} className="mt-sm-7">
          {filterCols.map((col: TableCol) => (
            <SettingMemo
              key={col.key}
              colKey={col.key}
              colLabel={col.label}
              value={filterByCol[col.key]}
              options={optionsByCol[col.key]}
              onChange={setFilterByCol}
            />
          ))}
        </SettingList>
      )}
    </Modal>
  )
}

/**********************************************************************************************************************
 * Memo
 */

interface SettingProps {
  colKey: string
  colLabel: string
  value: SelectValue
  options: SelectOption[]
  onChange: ((value: SelectValue) => void) | ((value: SelectValue, key: string) => void)
}

const SettingMemo = memo(function SettingMemo(props: SettingProps) {
  return (
    <div>
      <dt>{props.colLabel}</dt>
      <dd>
        <SelectField
          options={props.options}
          value={props.value}
          onChange={(value) => props.onChange(value, props.colKey)}
        />
      </dd>
    </div>
  )
})
