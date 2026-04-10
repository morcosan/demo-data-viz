import { Choropleth, EmptyState, type ChoroplethCountry, type ChoroplethData } from '@app-components'
import { useCountries, useTranslation } from '@app-i18n'
import { type TableRow } from '@app/shared/types/table'
import { EurostatConfig } from '@app/shared/utils/json-stat/index'
import { useCallback, useMemo } from 'react'
import { useTableStore } from '../../_hooks/use-table-store'
import type { ChartViewProps } from './types'

export const MapView = (props: ChartViewProps) => {
  const { data, colKey, queries, cellFn, toolbar, className } = props
  const { t } = useTranslation()
  const { getCountryIso3 } = useCountries()
  const indexKey = useTableStore((s) => s.indexKey)
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
      toolbar={toolbar}
      className={className}
    />
  )
}
