import { Choropleth, EmptyState, type ChoroData, type ChoroEntry } from '@app-components'
import { useCountries, useTranslation } from '@app-i18n'
import { type TableRow } from '@app/shared/types/table'
import { EurostatConfig } from '@app/shared/utils/json-stat'
import { useCallback, useMemo } from 'react'
import { useTableStore } from '../../_hooks/use-table-store'
import type { ChartViewProps } from './types'

export const MapView = (props: ChartViewProps) => {
  const { data, colKey, queries, toolbar, chartProps, className } = props
  const { t } = useTranslation()
  const { getCountryIso2 } = useCountries()
  const indexKey = useTableStore((s) => s.indexKey)
  const hasGeoIndex = indexKey === EurostatConfig.GEO_KEY || indexKey === EurostatConfig.CITY_KEY

  const mapRowToCountry = useCallback(
    (row: TableRow): ChoroEntry => {
      const name = String(row[indexKey])
      const isCountry = getCountryIso2(name)
      return {
        name: isCountry ? name : '',
        value: Number(isCountry ? row[colKey || ''] : ''),
      }
    },
    [indexKey, colKey, getCountryIso2],
  )
  const mapRowToCity = useCallback(
    (row: TableRow): ChoroEntry => {
      const name = String(row[indexKey])
      const isCountry = getCountryIso2(name)
      return {
        name: isCountry ? '' : name,
        value: Number(isCountry ? '' : row[colKey || '']),
        area: 'europe',
      }
    },
    [indexKey, colKey, getCountryIso2],
  )
  const mapData = useMemo((): ChoroData => {
    return hasGeoIndex
      ? {
          countries: data.rows.map(mapRowToCountry).filter((item) => item.name && !isNaN(item.value)),
          cities: data.rows.map(mapRowToCity).filter((item) => item.name && !isNaN(item.value)),
        }
      : { countries: [], cities: [] }
  }, [data.rows, mapRowToCountry, mapRowToCity, hasGeoIndex])

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
      view="europe"
      queries={queries}
      toolbar={toolbar}
      chartProps={chartProps}
      className={className}
    />
  )
}
