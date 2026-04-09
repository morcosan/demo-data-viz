import { useCountries } from '@app-i18n'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TextHighlight } from '../../text-highlight/text-highlight'
import { type ChoroplethProps } from '../_types'
import { Tooltip } from './tooltip'
import { useColors } from './use-colors'
import { type ECharts, type EChartsOption, useEcharts } from './use-echarts'

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
  const colors = useColors()
  const canvasRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ECharts>(null)

  const minValue = Math.min(...data.countries.map((c) => c.value), ...data.cities.map((c) => c.value))
  const maxValue = Math.max(...data.countries.map((c) => c.value), ...data.cities.map((c) => c.value))

  const nameFn = useCallback(
    (value: string) => {
      const lcValue = value.toLowerCase()
      const query = queries?.find((query) => lcValue.includes(query.toLowerCase())) || ''
      return nameFnProp ? nameFnProp(value, query) : <TextHighlight text={value} query={query} />
    },
    [nameFnProp, queries],
  )

  const queryNames = useMemo(() => {
    const lcQueries = queries.map((q) => q.trim().toLowerCase()).filter(Boolean)
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
  }, [data.countries, data.cities, queries])

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

  const citySize = 12 // px
  const cityData = useMemo(
    () => data.cities.map((city): EItem => ({ name: city.name, value: [city.lng, city.lat, city.value] })),
    [data.cities],
  )

  useEffect(() => {
    if (!canvasRef.current) return

    chartRef.current?.dispose()
    chartRef.current = echarts.init(canvasRef.current, null, { renderer: 'svg' })
    chartRef.current.setOption({
      animation: false,
      visualMap: {
        seriesIndex: [0, 1, 2],
        min: minValue,
        max: maxValue,
        inRange: { color: [colors.scaleLow, colors.scaleHigh] },
        itemWidth: 20,
        itemHeight: 150,
      },
      series: [
        {
          data: countryData.filter((item) => item.match),
          type: 'map',
          map: 'world',
          geoIndex: 0,
          selectedMode: false,
        },
        {
          data: countryData
            .filter((item) => !item.match)
            .map((item) => ({
              ...item,
              itemStyle: { areaColor: colors.land },
            })),
          type: 'map',
          map: 'world',
          geoIndex: 0,
          selectedMode: false,
          itemStyle: {
            areaColor: colors.land,
          },
        },
        {
          data: cityData,
          type: 'scatter',
          coordinateSystem: 'geo',
          symbolSize: citySize,
          itemStyle: {
            borderWidth: 0.8,
            opacity: 1,
          },
          emphasis: {
            itemStyle: {
              borderColor: colors.borderHover,
              borderWidth: 1.2,
            },
          },
        },
      ],
      geo: [
        {
          map: 'world',
          roam: true,
          regions: [
            ...countryData
              .filter((item) => !item.match)
              .map((item) => ({
                ...item,
                itemStyle: {
                  opacity: 0,
                },
              })),
          ],
          itemStyle: {
            areaColor: colors.land,
            borderColor: colors.border,
            borderWidth: 0.8,
          },
          emphasis: {
            itemStyle: {
              areaColor: 'inherit',
              borderColor: colors.borderHover,
              borderWidth: 1.2,
              opacity: 1,
            },
            label: { show: false },
          },
        },
        {
          zlevel: -1,
          map: 'world',
          silent: true,
          itemStyle: { areaColor: colors.scaleLow },
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

    chartRef.current.on('mouseover', (item: any & EItem) => {
      if (item.seriesType === 'scatter') return
      if (item.seriesType === 'map') {
        if (!countryNames.includes(item.name)) {
          chartRef.current?.dispatchAction({ type: 'downplay', name: item.name })
        }
      }
    })

    chartRef.current.on('georoam', () => {
      const geoOpt = chartRef.current?.getOption()?.geo as any[]
      const { zoom, center } = geoOpt?.[0] ?? {}
      chartRef.current?.setOption({
        geo: [{}, { zoom, center }],
        series: [{}, {}, { type: 'scatter', symbolSize: citySize * Math.sqrt(zoom ?? 1) }],
      })
    })

    const handleResize = () => chartRef.current?.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chartRef.current?.dispose()
      chartRef.current = null
    }
  }, [countryData, cityData, colors])

  return (
    <div ref={canvasRef} className={cx(className, '[&_*]:cursor-default!')} style={{ backgroundColor: colors.ocean }} />
  )
}
