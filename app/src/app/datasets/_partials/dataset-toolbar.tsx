import { useTranslation } from '@app-i18n'
import { SelectField, type SelectOption } from '@app/shared/components/select-field/select-field'
import { DEFAULT_COL_KEY, DEFAULT_ROW_KEY, type JsonStatData } from '@app/shared/utils/json-stat'
import { Tooltip } from '@mantine/core'
import '@mantine/core/styles/Tooltip.css'
import { CloseSvg } from 'ds/src/assets/icons'
import { useState } from 'react'

interface Props {
  data: JsonStatData
}

export const DatasetToolbar = (props: Props) => {
  const { t } = useTranslation()
  const { valuesByCol, cols } = props.data
  const [rowKey, setRowKey] = useState<string>(valuesByCol[DEFAULT_ROW_KEY] ? DEFAULT_ROW_KEY : '')
  const [colKey, setColKey] = useState<string>(valuesByCol[DEFAULT_COL_KEY] ? DEFAULT_COL_KEY : '')
  const colKeys = [...Object.keys(valuesByCol), '']
  const options = colKeys.map((key) => ({
    value: key,
    label: key === '' ? t('core.label.none') : (cols.find((col) => col.key === key)?.label ?? key),
  }))
  const rowOptions: SelectOption[] = options.map((option) => ({
    ...option,
    disabled: Boolean(option.value && option.value === colKey),
  }))
  const colOptions: SelectOption[] = options.map((option) => ({
    ...option,
    disabled: Boolean(option.value && option.value === rowKey),
  }))

  const handleChangeRow = (value: string | null) => setRowKey(value || '')
  const handleChangeCol = (value: string | null) => setColKey(value || '')

  return (
    <div className="flex items-center">
      <Tooltip
        label={t('dataViz.label.rowsFilter')}
        position="top-start"
        zIndex="var(--ds-z-index-tooltip)"
        events={{ hover: true, focus: true, touch: true }}
      >
        <SelectField options={rowOptions} value={rowKey} onChange={handleChangeRow} />
      </Tooltip>

      <CloseSvg className="h-xs-4 mx-xs-2 text-color-text-placeholder" />

      <Tooltip
        label={t('dataViz.label.colsFilter')}
        position="top-start"
        zIndex="var(--ds-z-index-tooltip)"
        events={{ hover: true, focus: true, touch: true }}
      >
        <SelectField options={colOptions} value={colKey} onChange={handleChangeCol} />
      </Tooltip>
    </div>
  )
}
