import { useCountries } from '@app-i18n'
import { formatInt, formatNumber } from '@app/shared/utils/formatting'
import { useCallback, useEffect, useMemo } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TextHighlight } from '../../text-highlight/text-highlight'
import { type ChoroplethProps } from '../_types'
import { type EChartsOption, type EItem, GEO_CONTINENT_VIEW, GEO_JSON_NAMES } from './echarts-config'
import { Tooltip } from './tooltip'
import { useEcharts } from './use-echarts'
import { useStyles } from './use-styles'

export const Chart = (props: ChoroplethProps) => {
  const { data, continent = 'world', nameFn: nameFnProp, queries = [], className } = props
  const { getCountryNames } = useCountries()
  const { colors, sizes, styles, cssContainer, draggingClass } = useStyles()

  const REVERSED_GEO_JSON_NAMES = Object.fromEntries(Object.entries(GEO_JSON_NAMES).map(([k, v]) => [v, k]))

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
  const queryNames = useMemo(() => {
    const names = [] as string[]
    data.countries.forEach((country) => {
      const name = country.name.toLowerCase()
      const isMatch = !lcQueries.length || lcQueries.some((query) => name.includes(query))
      if (isMatch) names.push(country.name)
    })
    data.cities.forEach((city) => {
      const name = city.name.toLowerCase()
      const isMatch = !lcQueries.length || lcQueries.some((query) => name.includes(query))
      if (isMatch) names.push(city.name)
    })
    return names
  }, [data.countries, data.cities, lcQueries])

  const cityItems = useMemo(
    () => data.cities.map((city): EItem => ({ name: city.name, value: [city.lng, city.lat, city.value] })),
    [data.cities],
  )
  const countryItems = useMemo((): EItem[] => {
    return data.countries.flatMap((country) => {
      return getCountryNames(country.iso3).map((name) => ({
        name: GEO_JSON_NAMES[name] || name,
        value: country.value,
        match: queryNames.includes(country.name),
      }))
    })
  }, [data.countries, getCountryNames, GEO_JSON_NAMES, queryNames])

  const countryNames = useMemo(() => countryItems.map((item) => item.name), [countryItems])
  const isItemActive = useCallback((name: string) => countryNames.includes(name), [countryNames])
  const { containerRef, echartsRef } = useEcharts({ geoCount: 2, markerSize: sizes.city, isItemActive, draggingClass })

  const nameFn = useCallback(
    (value: string) => {
      const name = REVERSED_GEO_JSON_NAMES[value] || value
      const lcName = name.toLowerCase()
      const query = lcQueries?.find((query) => lcName.includes(query)) || ''
      return nameFnProp ? nameFnProp(name, query) : <TextHighlight text={name} query={query} />
    },
    [nameFnProp, lcQueries],
  )

  useEffect(() => {
    const view = GEO_CONTINENT_VIEW[continent]

    echartsRef.current?.setOption({
      animation: false,
      // Echarts bug: visualMap colors ignore seriesIndex
      visualMap: {
        ...styles.legend,
        seriesIndex: [0, 1],
        max: legendMaxValue,
        min: legendMinValue,
        text: [legendMaxLabel, legendMinLabel],
        inRange: { color: [colors.valueMin, colors.valueMax] },
        formatter: legendFn as any,
        zlevel: 100,
      },
      series: [
        {
          data: countryItems,
          type: 'map',
          map: 'world',
          geoIndex: 0,
          selectedMode: false,
        },
        {
          zlevel: 2,
          data: cityItems,
          type: 'scatter',
          coordinateSystem: 'geo',
          symbolSize: sizes.city,
          itemStyle: styles.mapItem.default,
          emphasis: { itemStyle: styles.mapItem.hover },
        },
      ],
      geo: [
        {
          ...view,
          zlevel: 1,
          map: 'world',
          roam: 'scale',
          itemStyle: { opacity: 0 },
          regions: [
            // Echarts bug: only opacity can be overwritten, not areaColor
            ...countryItems.filter((item) => !item.match).map((item) => ({ ...item, itemStyle: { opacity: 0 } })),
            ...countryItems
              .filter((item) => item.match)
              .map((item) => ({
                ...item,
                itemStyle: lcQueries.length ? styles.mapItem.queryActive : styles.mapItem.default,
              })),
          ],
          emphasis: {
            itemStyle: styles.mapItem.hover,
            label: { show: false },
          },
        },
        {
          ...view,
          zlevel: 0,
          map: 'world',
          silent: true,
          itemStyle: styles.mapItem.landscape,
          regions: [
            ...countryItems
              .filter((item) => !item.match && lcQueries.length > 0)
              .map((item) => ({ ...item, itemStyle: styles.mapItem.queryOther })),
          ],
        },
      ],
      tooltip: {
        ...styles.tooltip,
        trigger: 'item',
        formatter: (item: any & EItem) => {
          const value = Array.isArray(item.value) ? item.value[2] : item.value
          return renderToStaticMarkup(<Tooltip name={item.name} value={value} nameFn={nameFn} />)
        },
      },
    } satisfies EChartsOption)
  }, [continent, countryItems, cityItems, colors])

  return <div ref={containerRef} className={className} css={cssContainer} />
}
