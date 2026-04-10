import {
  Choropleth,
  EmptyState,
  SelectField,
  type ChoroplethCountry,
  type ChoroplethData,
  type SelectOption,
} from '@app-components'
import { useCountries, useTranslation } from '@app-i18n'
import { type TableData, type TableRow } from '@app/shared/types/table'
import { EurostatConfig } from '@app/shared/utils/json-stat/index'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useTableStore } from '../../_hooks/use-table-store'

interface Props extends ReactProps {
  data: TableData
  queries: string[]
  cellFn: (value: string, query: string) => ReactNode
}

export const MapView = (props: Props) => {
  const { data, queries, cellFn, className } = props
  const { t } = useTranslation()
  const { getCountryIso3 } = useCountries()
  const indexKey = useTableStore((s) => s.indexKey)
  const pivotKey = useTableStore((s) => s.pivotKey)
  const pivotCol = data.cols.find((col) => col.key === pivotKey)
  const [colKey, setColKey] = useState<string | null>(null)
  const valueCols = useMemo(
    () => data.cols.filter((col) => col.key !== indexKey && col.key !== pivotKey),
    [data.cols, indexKey, pivotKey],
  )
  const hasGeoIndex = indexKey === EurostatConfig.GEO_KEY

  const mapRowToCountry = useCallback(
    (row: TableRow): ChoroplethCountry => ({
      iso3: getCountryIso3(String(row[indexKey])),
      name: String(row[indexKey]),
      value: Number(row[colKey || '']),
    }),
    [indexKey, colKey, getCountryIso3],
  )
  const mapData = useMemo(
    (): ChoroplethData => ({
      countries: hasGeoIndex ? data.rows.map(mapRowToCountry).filter((item) => item.iso3 && !isNaN(item.value)) : [],
      cities: [],
    }),
    [data.rows, mapRowToCountry, hasGeoIndex],
  )
  const hasData = mapData.countries.length > 0 || mapData.cities.length > 0

  const valueOptions = useMemo(
    (): SelectOption[] => valueCols.map((col) => ({ value: col.key, label: col.label })),
    [valueCols],
  )

  useEffect(() => {
    setColKey(valueCols[0]?.key || null)
  }, [valueCols])

  return !hasGeoIndex ? (
    <div className={cx('flex-center flex h-full', className)}>
      <EmptyState>{t('dataViz.error.noIndexColumnForMap')}</EmptyState>
    </div>
  ) : !hasData ? (
    <div className={cx('flex-center flex h-full', className)}>
      <EmptyState>{t('dataViz.error.noDataForFilters')}</EmptyState>
    </div>
  ) : (
    <Choropleth
      data={mapData}
      continent="europe"
      queries={queries}
      nameFn={cellFn}
      toolbar={
        <div className="gap-x-xs-3 min-w-md-7 flex flex-1 items-center justify-end">
          <label htmlFor="chart-col-key" className="font-weight-lg">
            {pivotCol ? pivotCol.label : t('core.label.value')}:
          </label>
          <SelectField id="chart-col-key" options={valueOptions} value={colKey} onChange={setColKey} />
        </div>
      }
      className={className}
    />
  )
}
