import { useCountries } from '@app-i18n'
import { useColors } from '@app/shared/components/choropleth/_partials/use-colors'
import type { EChartsOption } from 'echarts'
import * as echarts from 'echarts'
import { useEffect, useMemo, useRef } from 'react'
import { type ChoroplethCity, type ChoroplethCountry } from '../_types'
import worldGeoJson from './world-geo.json'

echarts.registerMap('world', worldGeoJson as unknown as Parameters<typeof echarts.registerMap>[1])

const GEO_JSON_COUNTRIES = {
  Czechia: 'Czech Rep.',
  'Ivory Coast': "Côte d'Ivoire",
  Eswatini: 'Swaziland',
  'Timor-Leste': 'East Timor',
  "Lao People's Democratic Republic": 'Laos',
  'Syrian Arab Republic': 'Syria',
  'Dominican Republic': 'Dominican Rep.',
  'Solomon Islands': 'Solomon Is.',
  'Falkland Islands (Malvinas)': 'Falkland Is.',
  'Central African Republic': 'Central African Rep.',
  'South Sudan': 'S. Sudan',
  'Bosnia and Herzegovina': 'Bosnia and Herz.',
  'Democratic Republic of the Congo': 'Dem. Rep. Congo',
} as const as Record<string, string>

type ECountry = {
  name: string
  value: number
}
type ECity = {
  name: string
  value: number[]
}

export interface Props extends ReactProps {
  countries: ChoroplethCountry[]
  cities: ChoroplethCity[]
}

export const EchartsCanvas = (props: Props) => {
  const { cities, countries, className } = props
  const { getCountryNames } = useCountries()
  const colors = useColors()
  const canvasRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.ECharts>(null)

  // Must match country name in world-geo.json
  const countryData = useMemo(() => {
    const entries = [] as ECountry[]
    countries.forEach((country) => {
      getCountryNames(country.iso3).forEach((name) =>
        entries.push({ name: GEO_JSON_COUNTRIES[name] || name, value: country.value }),
      )
    })
    return entries
  }, [countries, getCountryNames])

  const cityData = useMemo(
    () => cities.map((city): ECity => ({ name: city.name, value: [city.lng, city.lat, city.value] })),
    [cities],
  )

  const citySize = 12 // px

  useEffect(() => {
    if (!canvasRef.current) return

    chartRef.current?.dispose()
    chartRef.current = echarts.init(canvasRef.current, null, { renderer: 'svg' })
    chartRef.current.setOption({
      series: [
        // Country layer
        {
          data: countryData,
          type: 'map',
          map: 'world',
          geoIndex: 0,
        },
        // City layer
        {
          data: cityData,
          type: 'scatter',
          coordinateSystem: 'geo',
          symbolSize: citySize,
        },
      ],
      geo: {
        map: 'world',
        roam: true,
        silent: false,
        itemStyle: {
          areaColor: colors.land,
          borderColor: colors.border,
          borderWidth: 0.5,
        },
        emphasis: {
          itemStyle: {
            areaColor: 'inherit',
            borderColor: colors.hover,
            borderWidth: 1,
          },
          label: { show: false },
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: (item: any & (ECountry | ECity)) => {
          return Array.isArray(item.value)
            ? `<b>${item.name}</b><br/>Value: ${item.value[2]}`
            : `<b>${item.name}</b><br/>Value: ${item.value}`
        },
      },
      visualMap: {
        show: true,
        min: Math.min(...countries.map((e) => e.value)),
        max: Math.max(...countries.map((e) => e.value)),
        itemWidth: 20,
        itemHeight: 150,
        inRange: { color: [colors.scaleLow, colors.scaleHigh] },
        seriesIndex: [0, 1],
      },
    } satisfies EChartsOption)

    chartRef.current.on('georoam', () => {
      const geo = chartRef.current?.getOption()?.geo as any[]
      const zoom = geo?.[0]?.zoom ?? 1
      chartRef.current?.setOption({
        series: [{}, { type: 'scatter', symbolSize: citySize * Math.sqrt(zoom) }],
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

  return <div ref={canvasRef} className={className} style={{ backgroundColor: colors.ocean }} />
}
