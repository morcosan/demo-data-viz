import { SelectField, type SelectOption, type SelectValue } from '@app-components'
import { useTranslation } from '@app-i18n'
import type { TableCol } from '@app/shared/types/table'
import { type JsonStatData } from '@app/shared/utils/json-stat'
import { Modal } from '@ds/core'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'

interface Props {
  opened: boolean
  data: JsonStatData
  colKeys: string[]
  rowKey: string
  colKey: string
  onClose: () => void
}

export const FiltersModal = (props: Props) => {
  const { t } = useTranslation()
  const data = props.data
  const colKeys = useMemo(
    () => props.colKeys.filter((key) => key && key !== props.colKey && key !== props.rowKey && data.valuesByCol[key]),
    [props.colKey, props.rowKey, data.valuesByCol],
  )
  const activeCols = useMemo(
    () => colKeys.map((key) => data.cols.find((col) => col.key === key)).filter(Boolean) as TableCol[],
    [colKeys, data.cols],
  )
  const optionsByCol = useMemo(
    () =>
      colKeys.reduce(
        (acc, key) => ({ ...acc, [key]: data.valuesByCol[key].map((value) => ({ value, label: value })) }),
        {} as Record<string, SelectOption[]>,
      ),
    [colKeys, data.valuesByCol],
  )
  const [valueByCol, setValueByCol] = useState<Record<string, SelectValue>>({})

  const handleChange = useCallback((key: string, value: SelectValue) => {
    setValueByCol((prev) => ({ ...prev, [key]: value }))
  }, [])

  useEffect(() => {
    setValueByCol(colKeys.reduce((acc, key) => ({ ...acc, [key]: optionsByCol[key]?.[0]?.value || null }), {}))
  }, [optionsByCol])

  return (
    <Modal opened={props.opened} width="md" title={t('dataViz.label.filtersTitle')} noFooter onClose={props.onClose}>
      <dl>
        {activeCols.map((col: TableCol) => (
          <SelectCellMemo
            key={col.key}
            col={col}
            value={valueByCol[col.key]}
            options={optionsByCol[col.key]}
            onChange={handleChange}
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
