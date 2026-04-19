import { useCountries, useTranslation } from '@app-i18n'
import { formatInt, formatNumber } from '@app/shared/utils/formatting'
import { type ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TextHighlight } from '../../text-highlight/text-highlight'
import type { ChoroplethProps, ChoroView, EChartsOption, ECityItem, ECountryItem, EItem, EViewConfig } from '../_types'
import { Tooltip } from './tooltip'
import { useCities } from './use-cities'
import { useEcharts } from './use-echarts'
import { useStyles } from './use-styles'

const VIEW_CONFIGS: Record<ChoroView, EViewConfig> = {
  world: { center: [0, 13], zoom: 1.2 },
  europe: { center: [15, 52.5], zoom: 4.75 },
  'north-america': { center: [-100, 45], zoom: 2.3 },
  'south-america': { center: [-60, -22], zoom: 2.6 },
  africa: { center: [20, 1], zoom: 2.45 },
  asia: { center: [80, 33], zoom: 1.95 },
  oceania: { center: [140, -27], zoom: 4.1 },
}

export const Chart = (props: ChoroplethProps) => {
  const { data, view = 'world', queries = [], className } = props
  const { t } = useTranslation()
  const { getCountryNames, getCountryIso2 } = useCountries()
  const { colors, styles, cssContainer, draggingClass, getCitySize, getItemStyle } = useStyles()
  const { geoCities, loadCities, getGeoCity } = useCities()
  const containerRef = useRef<HTMLDivElement>(null)

  const minValue = Math.min(...data.countries.map((c) => c.value), ...data.cities.map((c) => c.value))
  const maxValue = Math.max(...data.countries.map((c) => c.value), ...data.cities.map((c) => c.value))
  const hasOpposites = minValue < 0 && maxValue > 0
  const absMaxValue = Math.max(Math.abs(minValue), Math.abs(maxValue))
  const legendMinValue = hasOpposites ? -absMaxValue : minValue
  const legendMaxValue = hasOpposites ? absMaxValue : maxValue
  const hasDigits = maxValue <= 10 && minValue >= -10
  const legendMinLabel = hasDigits ? formatNumber(legendMinValue) : formatInt(legendMinValue, 'down')
  const legendMaxLabel = hasDigits ? formatNumber(legendMaxValue) : formatInt(legendMaxValue, 'up')
  const legendFn = (value: number) => (hasDigits ? formatNumber(value) : formatInt(value))

  const lcQueries = useMemo(() => queries.map((query) => query.trim().toLowerCase()).filter(Boolean), [queries])
  const queriedNames = useMemo(() => {
    const names = [] as string[]
    data.countries.forEach((country) => {
      const name = country.name.toLowerCase()
      const isMatch = lcQueries.length && lcQueries.some((query) => name.includes(query))
      if (isMatch) names.push(country.name)
    })
    data.cities.forEach((city) => {
      const name = city.name.toLowerCase()
      const isMatch = lcQueries.length && lcQueries.some((query) => name.includes(query))
      if (isMatch) names.push(city.name)
    })
    return names
  }, [data.countries, data.cities, lcQueries])

  const countryItems = useMemo((): ECountryItem[] => {
    return data.countries.flatMap((country) => {
      const status = queriedNames.length ? (queriedNames.includes(country.name) ? 'queried' : 'unqueried') : 'default'
      return getCountryNames(getCountryIso2(country.name)).map((name) => ({
        name,
        value: country.value,
        status: status,
        itemStyle: getItemStyle(status),
      }))
    })
  }, [data.countries, queriedNames, getCountryNames, getCountryIso2, getItemStyle])

  const cityItems = useMemo(() => {
    return data.cities.flatMap((city): ECityItem[] => {
      const geoCity = getGeoCity(city)
      const status = queriedNames.length ? (queriedNames.includes(city.name) ? 'queried' : 'unqueried') : 'default'
      if (!geoCity) return []
      return [
        {
          name: city.name,
          value: [geoCity.lng, geoCity.lat, city.value],
          iso2: geoCity.iso2,
          area: city.area,
          status: status,
          itemStyle: getItemStyle(status),
        },
      ]
    })
  }, [data.cities, queriedNames, getGeoCity, getItemStyle])

  // Echarts bug: visualMap colors override everything if item has value
  const removeItemValue = (item: EItem) => ({
    ...item,
    value:
      item.status === 'unqueried'
        ? Array.isArray(item.value)
          ? [item.value[0], item.value[1], NaN]
          : NaN
        : item.value,
  })

  const nameFn = useCallback(
    (name: string, iso2: string): ReactNode => {
      const lcName = name.toLowerCase()
      const query = lcQueries?.find((query) => lcName.includes(query)) || ''
      const text = query ? <TextHighlight text={name} query={query} /> : name
      const flag = iso2.toLowerCase()
      return flag ? (
        <div className="flex items-center">
          {text}
          {<span className={cx(`fi fi-${flag} ml-xs-2 mb-px shadow-xs`)} />}
        </div>
      ) : (
        <span title={name}>{text}</span>
      )
    },
    [lcQueries],
  )

  const tooltipFn = useCallback(
    (item: any & EItem): string => {
      const isCountry = item.seriesType === 'map'
      const iso2 = isCountry ? getCountryIso2(item.name) : item.data?.iso2 || getGeoCity(item)?.iso2 || ''
      const findFn = (other: EItem) => other.name === item.name
      const value = Number(isCountry ? countryItems.find(findFn)?.value : cityItems.find(findFn)?.value?.[2])
      return renderToStaticMarkup(<Tooltip name={item.name} nameFn={nameFn} iso2={iso2} value={value} />)
    },
    [countryItems, cityItems, getCountryIso2, getGeoCity, nameFn],
  )

  const toggleDragging = useCallback(
    (active: boolean) => {
      const classList = containerRef.current?.classList
      active ? classList?.add(draggingClass) : classList?.remove(draggingClass)
    },
    [draggingClass],
  )

  const { chartRef } = useEcharts({ containerRef, countryItems, cityItems, getCitySize, toggleDragging })

  const updateChart = () => {
    chartRef.current?.setOption({
      animation: false,
      visualMap: [
        {
          ...styles.legend,
          max: legendMaxValue,
          min: legendMinValue,
          text: [legendMaxLabel, legendMinLabel],
          inRange: { color: [colors.valueMin, colors.valueMax] },
          formatter: legendFn as any,
        },
      ],
      series: [
        {
          type: 'map',
          data: countryItems.map(removeItemValue),
          geoIndex: 0, // Requires 'geo' config to be enabled
          selectedMode: false, // Disable onClick for countries
        },
        {
          type: 'scatter',
          data: [
            ...cityItems.filter((item) => item.status === 'unqueried').map(removeItemValue), // Render first
            ...cityItems.filter((item) => item.status !== 'unqueried').map(removeItemValue), // Render on top
          ],
          coordinateSystem: 'geo', // Requires 'geo' config to be enabled
          symbolSize: getCitySize(VIEW_CONFIGS[view].zoom),
          emphasis: { itemStyle: styles.mapItem.hover },
        },
      ],
      geo: [
        {
          ...VIEW_CONFIGS[view],
          map: 'world',
          roam: true,
          itemStyle: styles.mapItem.landscape,
          emphasis: { itemStyle: styles.mapItem.hover, label: { show: false } },
          regions: countryItems,
        },
      ],
      tooltip: {
        ...styles.tooltip,
        trigger: 'item',
        confine: true,
        formatter: tooltipFn,
      },
    } satisfies EChartsOption)
  }

  useEffect(() => {
    data.cities.length && loadCities()
    updateChart()
  }, [view, countryItems, cityItems, geoCities])

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="application"
      aria-label={t('dataViz.notice.mapAriaLabel', { countries: data.countries.length, cities: data.cities.length })}
      className={className}
      css={cssContainer}
    />
  )
}
