import { useCountries } from '@app-i18n'
import { formatInt, formatNumber } from '@app/shared/utils/formatting'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TextHighlight } from '../../text-highlight/text-highlight'
import { type ChoroplethProps } from '../_types'
import { Tooltip } from './tooltip'
import { type EChartsOption, type EItem, useEcharts } from './use-echarts'
import { useStyles } from './use-styles'

export const Canvas = (props: ChoroplethProps) => {
  const { data, nameFn: nameFnProp, queries = [], className } = props
  const { getCountryNames } = useCountries()
  const containerRef = useRef<HTMLDivElement>(null)
  const { colors, sizes, styles, cssContainer } = useStyles()
  const { echartsRef, GEO_JSON_NAMES } = useEcharts({
    containerRef,
    citySize: sizes.city,
    isActiveFn: (name: string) => countryNames.includes(name),
  })

  const maxValue = Math.max(...data.countries.map((c) => c.value), ...data.cities.map((c) => c.value))
  const minValue = Math.min(...data.countries.map((c) => c.value), ...data.cities.map((c) => c.value))
  const hasDigits = maxValue <= 10 && minValue >= -10
  const maxLabel = hasDigits ? formatNumber(maxValue) : formatInt(maxValue, 'up')
  const minLabel = hasDigits ? formatNumber(minValue) : formatInt(minValue, 'down')
  const legendFn = (value: number) => (hasDigits ? formatNumber(value) : formatInt(value))

  const lcQueries = useMemo(() => queries.map((query) => query.trim().toLowerCase()).filter(Boolean), [queries])

  const nameFn = useCallback(
    (value: string) => {
      const lcValue = value.toLowerCase()
      const query = lcQueries?.find((query) => lcValue.includes(query)) || ''
      return nameFnProp ? nameFnProp(value, query) : <TextHighlight text={value} query={query} />
    },
    [nameFnProp, lcQueries],
  )

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

  const [countryData, countryNames] = useMemo(() => {
    const items = [] as EItem[]
    data.countries.forEach((country) => {
      const match = queryNames.includes(country.name)
      getCountryNames(country.iso3).forEach((name) =>
        items.push({
          name: GEO_JSON_NAMES[name] || name,
          value: country.value,
          match,
        }),
      )
    })
    return [items, items.map((item) => item.name)]
  }, [data.countries, getCountryNames, GEO_JSON_NAMES, queryNames])

  const cityData = useMemo(
    () => data.cities.map((city): EItem => ({ name: city.name, value: [city.lng, city.lat, city.value] })),
    [data.cities],
  )

  useEffect(() => {
    echartsRef.current?.setOption({
      animation: false,
      visualMap: {
        ...styles.legend,
        seriesIndex: [0, 1],
        max: maxValue,
        min: minValue,
        text: [maxLabel, minLabel],
        inRange: { color: [colors.minValue, colors.maxValue] },
        formatter: legendFn as any,
      },
      series: [
        {
          data: countryData,
          type: 'map',
          map: 'world',
          geoIndex: 0,
          selectedMode: false,
        },
        {
          zlevel: 2,
          data: cityData,
          type: 'scatter',
          coordinateSystem: 'geo',
          symbolSize: sizes.city,
          itemStyle: styles.layer1.default,
          emphasis: { itemStyle: styles.layer1.hover },
        },
      ],
      geo: [
        {
          zlevel: 1,
          map: 'world',
          center: [0, 0],
          zoom: 1,
          roam: true,
          itemStyle: styles.layer1.landscape,
          regions: [
            ...countryData
              .filter((item) => !item.match)
              .map((item) => ({ ...item, itemStyle: styles.layer1.landscape })),
            ...countryData.filter((item) => item.match).map((item) => ({ ...item, itemStyle: styles.layer1.default })),
            ...countryData
              .filter((item) => item.match && lcQueries.length > 0)
              .map((item) => ({ ...item, itemStyle: styles.layer1.query })),
          ],
          emphasis: {
            itemStyle: styles.layer1.hover,
            label: { show: false },
          },
        },
        {
          zlevel: 0,
          map: 'world',
          center: [0, 0],
          zoom: 1,
          silent: true,
          itemStyle: styles.layer0.landscape,
          regions: [
            ...countryData
              .filter((item) => !item.match && lcQueries.length > 0)
              .map((item) => ({ ...item, itemStyle: styles.layer0.default })),
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
  }, [countryData, cityData, colors])

  return <div ref={containerRef} className={className} css={cssContainer} />
}
