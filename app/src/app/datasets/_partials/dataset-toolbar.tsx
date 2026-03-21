import { SearchField, SelectField, type SelectOption, Tooltip } from '@app-components'
import { useTranslation } from '@app-i18n'
import { FilterSvg } from '@app/shared/assets'
import { type JsonStatData } from '@app/shared/utils/json-stat'
import { Button, CloseSvg, IconButton, useViewportService } from '@ds/core'
import { memo, useCallback, useMemo, useState } from 'react'
import { FiltersModal } from '../_modals/filters-modal'
import { useTableStore } from '../_table-store'

interface Props {
  data: JsonStatData
  searchQuery: string
  setSearchQuery: (value: string) => void
}

export const DatasetToolbar = (props: Props) => {
  const { t } = useTranslation()
  const { isViewportMinXL, isViewportMD } = useViewportService()
  const indexKey = useTableStore((s) => s.indexKey)
  const pivotKey = useTableStore((s) => s.pivotKey)
  const { cellsByCol, cols } = props.data
  const isMdOrLarger = isViewportMinXL || isViewportMD
  const [openedModal, setOpenedModal] = useState(false)
  const colKeys = useMemo(() => [...Object.keys(cellsByCol), ''], [cellsByCol])
  const filterCount = (indexKey ? colKeys.length - (pivotKey ? 3 : 2) : 0) + (pivotKey ? 1 : 0)
  const getColLabel = useCallback((key: string) => cols.find((col) => col.key === key)?.label || key, [cols])

  const indexOptions = useMemo((): SelectOption[] => {
    return colKeys.map((key) => ({
      value: key,
      label: key ? getColLabel(key) : t('dataViz.label.emptyOptionForIndex'),
      disabled: Boolean(key && key === pivotKey),
    }))
  }, [colKeys, pivotKey, t, getColLabel])

  const pivotOptions = useMemo((): SelectOption[] => {
    return colKeys.map((key) => ({
      value: key,
      label: key ? getColLabel(key) : t('dataViz.label.emptyOptionForPivot'),
      disabled: Boolean(key && key === indexKey),
    }))
  }, [colKeys, indexKey, t, getColLabel])

  return (
    <div
      className={cx(
        'p-xs-2 gap-xs-2 flex flex-wrap items-center justify-between',
        'border-color-border-subtle border-b',
      )}
    >
      <div className="gap-xs-2 flex w-full items-center justify-between lg:w-fit">
        <IndexPivotMemo indexOptions={indexOptions} pivotOptions={pivotOptions} />

      {isMdOrLarger ? (
        <Button variant="text-default" size="sm" onClick={() => setOpenedModal(true)}>
          <FilterSvg className="h-xs-7 -mt-xs-0 mr-xs-1" />
          {t('dataViz.label.filtersModalButton', { count: filterCount })}
        </Button>
      ) : (
        <IconButton
          tooltip={t('dataViz.label.filtersModalButton', { count: filterCount })}
          variant="text-default"
          size="sm"
          className="ml-auto"
          onClick={() => setOpenedModal(true)}
        >
          <FilterSvg className="h-xs-7" />
        </IconButton>
      )}
      </div>

      <SearchField
        id="dataset-search"
        value={props.searchQuery}
        label={t('dataViz.label.dataTableSearch')}
        className="lg:max-w-lg-9 w-full"
        onChange={props.setSearchQuery}
      />

      {/* MODAL */}
      <FiltersModal
        opened={openedModal}
        data={props.data}
        indexOptions={indexOptions}
        pivotOptions={pivotOptions}
        onClose={() => setOpenedModal(false)}
      />
    </div>
  )
}

/**********************************************************************************************************************
 * Memo
 */

interface RowColProps {
  indexOptions: SelectOption[]
  pivotOptions: SelectOption[]
}

const IndexPivotMemo = memo(function IndexPivotMemo(props: RowColProps) {
  const { t } = useTranslation()
  const indexKey = useTableStore((s) => s.indexKey)
  const pivotKey = useTableStore((s) => s.pivotKey)
  const setIndexKey = useTableStore((s) => s.setIndexKey)
  const setPivotKey = useTableStore((s) => s.setPivotKey)
  const fieldClass = cx('xl:min-w-lg-0 max-w-lg-7 flex-1')

  return (
    <div className="flex flex-1 items-center">
      <Tooltip label={t('dataViz.label.fieldLabelForIndex')}>
        <SelectField
          id="index-col"
          options={props.indexOptions}
          value={indexKey}
          className={fieldClass}
          onChange={setIndexKey}
        />
      </Tooltip>

      <CloseSvg className="h-xs-4 mx-xs-2 text-color-text-placeholder" />

      <Tooltip label={t('dataViz.label.fieldLabelForPivot')}>
        <SelectField
          id="pivot-col"
          options={props.pivotOptions}
          value={pivotKey}
          className={fieldClass}
          onChange={setPivotKey}
        />
      </Tooltip>
    </div>
  )
})
