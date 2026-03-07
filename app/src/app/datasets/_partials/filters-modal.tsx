import { SelectField, type SelectOption, type SelectValue } from '@app-components'
import { useTranslation } from '@app-i18n'
import type { TableCol } from '@app/shared/types/table'
import { type JsonStatData } from '@app/shared/utils/json-stat'
import { Modal } from '@ds/core'
import { memo, useMemo } from 'react'

interface Props {
  opened: boolean
  data: JsonStatData
  rowKey: string
  colKey: string
  filterByCol: Record<string, SelectValue>
  onChangeFilter: (key: string, value: SelectValue) => void
  onClose: () => void
}

export const FiltersModal = (props: Props) => {
  const { t } = useTranslation()
  const { valuesByCol, cols } = props.data
  const colKeys = useMemo(
    () => Object.keys(valuesByCol).filter((key) => key !== props.colKey && key !== props.rowKey && valuesByCol[key]),
    [props.colKey, props.rowKey, valuesByCol],
  )
  const activeCols = useMemo(
    () => colKeys.map((key) => cols.find((col) => col.key === key)).filter(Boolean) as TableCol[],
    [colKeys, cols],
  )
  const optionsByCol = useMemo(
    () =>
      colKeys.reduce(
        (acc, key) => ({ ...acc, [key]: valuesByCol[key].map((value) => ({ value, label: value })) }),
        {} as Record<string, SelectOption[]>,
      ),
    [colKeys, valuesByCol],
  )

  return (
    <Modal opened={props.opened} width="md" title={t('dataViz.label.filtersTitle')} noFooter onClose={props.onClose}>
      <dl>
        {activeCols.map((col: TableCol) => (
          <SelectCellMemo
            key={col.key}
            col={col}
            value={props.filterByCol[col.key]}
            options={optionsByCol[col.key]}
            onChange={props.onChangeFilter}
          />
        ))}
      </dl>
    </Modal>
  )
}

/**********************************************************************************************************************
 * Memo
 */

interface SelectCellProps {
  col: TableCol
  value: SelectValue
  options: SelectOption[]
  onChange: (key: string, value: SelectValue) => void
}

const SelectCellMemo = memo(({ col, value, options, onChange }: SelectCellProps) => {
  const groupClass = cx(
    // Group
    'grid grid-cols-1 sm:grid-cols-[30%_minmax(0,1fr)]',
    'py-xs-7 gap-x-xs-9 items-center',
    'border-color-border-subtle border-b last:border-0',
    // Items
    '[&>dt]:mb-xs-1 sm:[&>dt]:mb-0',
    '[&>dt]:text-size-sm [&>dt]:text-color-text-subtle [&>dd]:font-weight-lg',
  )

  return (
    <div className={groupClass}>
      <dt>{col.label}</dt>
      <dd>
        <SelectField options={options} value={value} onChange={(val) => onChange(col.key, val)} />
      </dd>
    </div>
  )
})
