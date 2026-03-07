import { SelectField, type SelectOption, Tooltip } from '@app-components'
import { useTranslation } from '@app-i18n'
import { FiltersModal } from '@app/app/datasets/_partials/filters-modal'
import { FilterSvg } from '@app/shared/assets'
import { DEFAULT_COL_KEY, DEFAULT_ROW_KEY, type JsonStatData } from '@app/shared/utils/json-stat'
import { CloseSvg } from 'ds/src/assets/icons'
import { Button } from 'ds/src/components/button/button'
import { IconButton } from 'ds/src/components/icon-button/icon-button'
import { useViewportService } from 'ds/src/services/viewport-service'
import { memo, useCallback, useMemo, useState } from 'react'

interface Props {
  data: JsonStatData
}

export const TableToolbar = (props: Props) => {
  const { t } = useTranslation()
  const { isViewportMinXL, isViewportMD } = useViewportService()
  const isMdOrLarger = isViewportMinXL || isViewportMD
  const { valuesByCol, cols } = props.data
  const [openedFilters, setOpenedFilters] = useState(false)
  const [rowKey, setRowKey] = useState<string>(valuesByCol[DEFAULT_ROW_KEY] ? DEFAULT_ROW_KEY : '')
  const [colKey, setColKey] = useState<string>(valuesByCol[DEFAULT_COL_KEY] ? DEFAULT_COL_KEY : '')
  const colKeys = useMemo(() => [...Object.keys(valuesByCol), ''], [valuesByCol])
  const options = useMemo(
    (): SelectOption[] =>
      colKeys.map((key) => ({
        value: key,
        label: key === '' ? t('core.label.none') : (cols.find((col) => col.key === key)?.label ?? key),
      })),
    [colKeys],
  )
  const rowOptions: SelectOption[] = useMemo(
    () => options.map((option) => ({ ...option, disabled: Boolean(option.value && option.value === colKey) })),
    [options, colKey],
  )
  const colOptions: SelectOption[] = useMemo(
    () => options.map((option) => ({ ...option, disabled: Boolean(option.value && option.value === rowKey) })),
    [options, rowKey],
  )
  const filterCount = rowKey ? options.length - 3 : 0

  const handleChangeRow = useCallback((value: string | null) => setRowKey(value || ''), [])
  const handleChangeCol = useCallback((value: string | null) => setColKey(value || ''), [])

  return (
    <div className="gap-xs-2 flex flex-1 items-center justify-between xl:flex-initial">
      <RowColMemo
        rowOptions={rowOptions}
        colOptions={colOptions}
        rowKey={rowKey}
        colKey={colKey}
        handleChangeRow={handleChangeRow}
        handleChangeCol={handleChangeCol}
      />

      {filterCount > 0 &&
        (isMdOrLarger ? (
          <Button variant="text-default" size="sm" onClick={() => setOpenedFilters(true)}>
            <FilterSvg className="h-xs-7 mr-xs-1" /> {t('dataViz.label.filtersButton', { count: filterCount })}
          </Button>
        ) : (
          <IconButton
            tooltip={t('dataViz.label.filtersButton', { count: filterCount })}
            variant="text-default"
            size="sm"
            className="ml-auto"
            onClick={() => setOpenedFilters(true)}
          >
            <FilterSvg className="h-xs-7" />
          </IconButton>
        ))}

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

/**********************************************************************************************************************
 * Memo
 */

interface RowColProps {
  rowOptions: SelectOption[]
  colOptions: SelectOption[]
  rowKey: string
  colKey: string
  handleChangeRow: (value: string | null) => void
  handleChangeCol: (value: string | null) => void
}

const RowColMemo = memo((props: RowColProps) => {
  const { t } = useTranslation()
  const wrapperClass = cx('xl:min-w-lg-0 max-w-lg-7 flex-1')

  return (
    <div className="flex flex-1 items-center">
      <Tooltip label={t('dataViz.label.tableRows')} className={wrapperClass}>
        <SelectField options={props.rowOptions} value={props.rowKey} onChange={props.handleChangeRow} />
      </Tooltip>

      <CloseSvg className="h-xs-4 mx-xs-2 text-color-text-placeholder" />

      <Tooltip label={t('dataViz.label.tableCols')} className={wrapperClass}>
        <SelectField options={props.colOptions} value={props.colKey} onChange={props.handleChangeCol} />
      </Tooltip>
    </div>
  )
})
