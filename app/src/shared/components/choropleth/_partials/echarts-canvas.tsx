import { useCountries } from '@app-i18n'
import { useColors } from '@app/shared/components/choropleth/_partials/use-colors'
import type { EChartsOption } from 'echarts'
import * as echarts from 'echarts'
import { useEffect, useMemo, useRef } from 'react'
import { type ChoroplethCountry } from '../_types'
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

export interface Props extends ReactProps {
  countries: ChoroplethCountry[]
}

export const EchartsCanvas = (props: Props) => {
  const { countries, className } = props
  const { getCountryNames } = useCountries()
  const colors = useColors()
  const canvasRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.ECharts>(null)

  // Must match country name in world-geo.json
  const mapData = useMemo(() => {
    const entries = [] as ECountry[]
    countries.forEach((country) => {
      getCountryNames(country.iso3).forEach((name) =>
        entries.push({ name: GEO_JSON_COUNTRIES[name] || name, value: country.value }),
      )
    })
    return entries
  }, [countries, getCountryNames])

  log(mapData)
  useEffect(() => {
    if (!canvasRef.current) return

    chartRef.current?.dispose()
    chartRef.current = echarts.init(canvasRef.current, null, { renderer: 'svg' })
    chartRef.current.setOption({
      tooltip: {
        trigger: 'item',
        formatter: (country: any & ECountry) => {
          return `<b>${country.name}</b><br/>Value: ${country.value}`
        },
      },
      visualMap: {
        show: true,
        min: Math.min(...countries.map((e) => e.value)),
        max: Math.max(...countries.map((e) => e.value)),
        itemWidth: 20,
        itemHeight: 150,
        inRange: { color: [colors.scaleLow, colors.scaleHigh] },
      },
      series: [
        {
          data: mapData,
          type: 'map',
          map: 'world',
          roam: true,
          emphasis: {
            itemStyle: { areaColor: undefined },
            label: { show: false },
          },
          itemStyle: {
            areaColor: colors.land,
            borderColor: colors.border,
            borderWidth: 0.5,
          },
        },
      ],
    } satisfies EChartsOption)

    const handleResize = () => chartRef.current?.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chartRef.current?.dispose()
      chartRef.current = null
    }
  }, [mapData, colors])

  return <div ref={canvasRef} className={className} style={{ backgroundColor: colors.ocean }} />
}
