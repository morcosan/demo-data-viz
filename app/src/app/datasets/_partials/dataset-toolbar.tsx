import { SelectField, type SelectOption, Tooltip } from '@app-components'
import { useTranslation } from '@app-i18n'
import { FiltersModal } from '@app/app/datasets/_partials/filters-modal'
import { FilterSvg } from '@app/shared/assets'
import { DEFAULT_COL_KEY, DEFAULT_ROW_KEY, type JsonStatData } from '@app/shared/utils/json-stat'
import { CloseSvg } from 'ds/src/assets/icons'
import { Button } from 'ds/src/components/button/button'
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
  const [openedFilters, setOpenedFilters] = useState(false)

  const handleChangeRow = (value: string | null) => setRowKey(value || '')
  const handleChangeCol = (value: string | null) => setColKey(value || '')

  return (
    <div className="flex items-center">
      <Tooltip label={t('dataViz.label.tableRows')}>
        <SelectField options={rowOptions} value={rowKey} onChange={handleChangeRow} />
      </Tooltip>

      <CloseSvg className="h-xs-4 mx-xs-2 text-color-text-placeholder" />

      <Tooltip label={t('dataViz.label.tableCols')}>
        <SelectField options={colOptions} value={colKey} onChange={handleChangeCol} />
      </Tooltip>

      <Button variant="text-default" size="sm" className="ml-xs-3" onClick={() => setOpenedFilters(true)}>
        <FilterSvg className="h-xs-7 mr-xs-1" /> {t('dataViz.label.filtersButton', { count: options.length - 2 })}
      </Button>

      {/* MODAL */}
      <FiltersModal
        opened={openedFilters}
        data={props.data}
        colKeys={colKeys}
        colKey={colKey}
        rowKey={rowKey}
        onClose={() => setOpenedFilters(false)}
      />
    </div>
  )
}
