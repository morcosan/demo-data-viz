import { SelectField, type SelectOption, Tooltip } from '@app-components'
import { useTranslation } from '@app-i18n'
import { FilterSvg } from '@app/shared/assets'
import { type JsonStatData } from '@app/shared/utils/json-stat'
import { Button, CloseSvg, IconButton, useViewportService } from '@ds/core'
import { memo, useCallback, useMemo, useState } from 'react'
import { useTableStore } from '../_table-store'
import { FiltersModal } from './filters-modal'

interface Props {
  data: JsonStatData
}

export const TableToolbar = (props: Props) => {
  const { t } = useTranslation()
  const { isViewportMinXL, isViewportMD } = useViewportService()
  const indexColKey = useTableStore((s) => s.indexColKey)
  const pivotColKey = useTableStore((s) => s.pivotColKey)
  const { cellsByCol, cols } = props.data
  const isMdOrLarger = isViewportMinXL || isViewportMD
  const [openedModal, setOpenedModal] = useState(false)
  const colKeys = useMemo(() => [...Object.keys(cellsByCol), ''], [cellsByCol])
  const filterCount = (indexColKey ? colKeys.length - (pivotColKey ? 3 : 2) : 0) + (pivotColKey ? 1 : 0)
  const getColLabel = useCallback((key: string) => cols.find((col) => col.key === key)?.label || key, [cols])

  const indexOptions = useMemo((): SelectOption[] => {
    return colKeys.map((key) => ({
      value: key,
      label: key ? getColLabel(key) : t('dataViz.label.emptyOptionForIndex'),
      disabled: Boolean(key && key === pivotColKey),
    }))
  }, [colKeys, pivotColKey, t, getColLabel])

  const pivotOptions = useMemo((): SelectOption[] => {
    return colKeys.map((key) => ({
      value: key,
      label: key ? getColLabel(key) : t('dataViz.label.emptyOptionForPivot'),
      disabled: Boolean(key && key === indexColKey),
    }))
  }, [colKeys, indexColKey, t, getColLabel])

  return (
    <div className="gap-xs-2 flex w-full items-center justify-between lg:w-fit">
      <IndexPivotMemo indexOptions={indexOptions} pivotOptions={pivotOptions} />

      {isMdOrLarger ? (
        <Button variant="text-default" size="sm" onClick={() => setOpenedModal(true)}>
          <FilterSvg className="h-xs-7 mr-xs-1" /> {t('dataViz.label.filtersModalButton', { count: filterCount })}
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
  const indexColKey = useTableStore((s) => s.indexColKey)
  const pivotColKey = useTableStore((s) => s.pivotColKey)
  const setIndexColKey = useTableStore((s) => s.setIndexColKey)
  const setPivotColKey = useTableStore((s) => s.setPivotColKey)
  const wrapperClass = cx('xl:min-w-lg-0 max-w-lg-7 flex-1')

  return (
    <div className="flex flex-1 items-center">
      <Tooltip label={t('dataViz.label.fieldLabelForIndex')} className={wrapperClass}>
        <SelectField id="index-col" options={props.indexOptions} value={indexColKey} onChange={setIndexColKey} />
      </Tooltip>

      <CloseSvg className="h-xs-4 mx-xs-2 text-color-text-placeholder" />

      <Tooltip label={t('dataViz.label.fieldLabelForPivot')} className={wrapperClass}>
        <SelectField id="pivot-col" options={props.pivotOptions} value={pivotColKey} onChange={setPivotColKey} />
      </Tooltip>
    </div>
  )
})
