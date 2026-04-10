import { useCountries } from '@app-i18n'
import { formatInt } from '@app/shared/utils/formatting'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TextHighlight } from '../../text-highlight/text-highlight'
import { type ChoroplethProps } from '../_types'
import { Tooltip } from './tooltip'
import { type ECharts, type EChartsOption, useEcharts } from './use-echarts'
import { useStyles } from './use-styles'

interface EItem extends Record<string, any> {
  name: string
  value: number | number[]
  seriesType?: 'map' | 'scatter'
  match?: boolean
}

export const Canvas = (props: ChoroplethProps) => {
  const { data, nameFn: nameFnProp, queries = [], className } = props
  const { getCountryNames } = useCountries()
  const { echarts, GEO_JSON_NAMES } = useEcharts()
  const { colors, sizes, styles, cssCanvas } = useStyles()
  const canvasRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ECharts>(null)

  const maxValue = Math.max(...data.countries.map((c) => c.value), ...data.cities.map((c) => c.value))
  const minValue = Math.min(...data.countries.map((c) => c.value), ...data.cities.map((c) => c.value))
  const maxLabel = formatInt(maxValue, 'up')
  const minLabel = formatInt(minValue, 'down')

  const lcQueries = queries.map((q) => q.trim().toLowerCase()).filter(Boolean)

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
    if (!canvasRef.current) return

    chartRef.current?.dispose()
    chartRef.current = echarts.init(canvasRef.current, null, { renderer: 'svg' })

    // Disable hover effect for other countries
    chartRef.current.on('mouseover', (item: any & EItem) => {
      if (item.seriesType === 'scatter') return
      if (item.seriesType === 'map') {
        if (!countryNames.includes(item.name)) {
          chartRef.current?.dispatchAction({ type: 'downplay', name: item.name })
        }
      }
    })

    // Sync all canvas layers
    chartRef.current.on('georoam', () => {
      const geoOpt = chartRef.current?.getOption()?.geo as any[]
      const { zoom, center } = geoOpt?.[0] ?? {}
      chartRef.current?.setOption({
        geo: [{}, { zoom, center }],
        series: [{}, { type: 'scatter', symbolSize: sizes.city * Math.sqrt(zoom ?? 1) }],
      })
    })

    const handleResize = () => chartRef.current?.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chartRef.current?.dispose()
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    chartRef.current?.setOption({
      animation: false,
      visualMap: {
        seriesIndex: [0, 1, 2],
        min: minValue,
        max: maxValue,
        inRange: { color: [colors.scaleLow, colors.scaleHigh] },
        itemWidth: 20,
        itemHeight: 150,
        text: [maxLabel, minLabel],
        textStyle: {
          color: colors.text,
        },
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
          itemStyle: styles.lv1.default,
          emphasis: { itemStyle: styles.lv1.hover },
        },
      ],
      geo: [
        {
          zlevel: 1,
          map: 'world',
          roam: true,
          itemStyle: styles.lv1.landmark,
          regions: [
            ...countryData.filter((item) => !item.match).map((item) => ({ ...item, itemStyle: styles.lv1.landmark })),
            ...countryData.filter((item) => item.match).map((item) => ({ ...item, itemStyle: styles.lv1.default })),
            ...countryData
              .filter((item) => item.match && lcQueries.length > 0)
              .map((item) => ({ ...item, itemStyle: styles.lv1.query })),
          ],
          emphasis: {
            itemStyle: styles.lv1.hover,
            label: { show: false },
          },
        },
        {
          zlevel: 0,
          map: 'world',
          silent: true,
          itemStyle: styles.lv0.landmark,
          regions: [
            ...countryData
              .filter((item) => !item.match && lcQueries.length > 0)
              .map((item) => ({ ...item, itemStyle: styles.lv0.default })),
          ],
        },
      ],
      tooltip: {
        trigger: 'item',
        padding: 0,
        borderWidth: 0,
        backgroundColor: 'transparent',
        extraCssText: 'box-shadow: none; color: unset;',
        formatter: (item: any & EItem) => {
          const value = Array.isArray(item.value) ? item.value[2] : item.value
          return renderToStaticMarkup(<Tooltip name={item.name} value={value} nameFn={nameFn} />)
        },
      },
    } satisfies EChartsOption)
  }, [countryData, cityData, colors])

  return <div ref={canvasRef} className={className} css={cssCanvas} />
}
