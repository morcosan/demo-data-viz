import { type SelectOption } from '@app-components'
import { useTranslation } from '@app-i18n'
import { type JsonStatData } from '@app/shared/utils/json-stat'
import { useCallback, useMemo } from 'react'
import { useTableStore } from './use-table-store'

interface Props {
  data: JsonStatData
}

export const useFilterUtils = ({ data }: Props) => {
  const { t } = useTranslation()
  const indexKey = useTableStore((s) => s.indexKey)
  const pivotKey = useTableStore((s) => s.pivotKey)

  const colKeys = useMemo(() => [...Object.keys(data.cellsByCol), ''], [data.cellsByCol])

  const filterCount = (indexKey ? colKeys.length - (pivotKey ? 3 : 2) : 0) + (pivotKey ? 1 : 0)

  const getColLabel = useCallback((key: string) => data.cols.find((col) => col.key === key)?.label || key, [data.cols])

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

  return { filterCount, indexOptions, pivotOptions }
}
