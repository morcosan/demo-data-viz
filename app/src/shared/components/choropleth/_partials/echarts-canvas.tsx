import { useCountries } from '@app-i18n'
import { useEffect, useMemo, useRef } from 'react'
import { type ChoroplethCity, type ChoroplethCountry } from '../_types'
import { useColors } from './use-colors'
import { type ECharts, type EChartsOption, useEcharts } from './use-echarts'

interface EItem extends Record<string, any> {
  name: string
  value: number | number[]
  seriesType?: 'map' | 'scatter'
}

export interface Props extends ReactProps {
  countries: ChoroplethCountry[]
  cities: ChoroplethCity[]
}

export const EchartsCanvas = (props: Props) => {
  const { cities, countries, className } = props
  const { getCountryNames } = useCountries()
  const { echarts, GEO_JSON_NAMES } = useEcharts()
  const colors = useColors()
  const canvasRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ECharts>(null)

  const countryData = useMemo(() => {
    const items = [] as EItem[]
    countries.forEach((country) => {
      getCountryNames(country.iso3).forEach((name) =>
        items.push({
          name: GEO_JSON_NAMES[name] || name,
          value: country.value,
        }),
      )
    })
    return items
  }, [countries, getCountryNames, GEO_JSON_NAMES])
  const countryNames = countryData.map((country) => country.name)

  const citySize = 12 // px
  const cityData = useMemo(
    () => cities.map((city): EItem => ({ name: city.name, value: [city.lng, city.lat, city.value] })),
    [cities],
  )

  useEffect(() => {
    if (!canvasRef.current) return

    chartRef.current?.dispose()
    chartRef.current = echarts.init(canvasRef.current, null, { renderer: 'canvas' })
    chartRef.current.setOption({
      series: [
        // Country layer
        {
          data: countryData,
          type: 'map',
          map: 'world',
          geoIndex: 0,
          selectedMode: false,
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
        formatter: (item: any & EItem) => {
          if (item.seriesType === 'scatter' && Array.isArray(item.value)) {
            return `<b>${item.name}</b><br/>Value: ${item.value[2]}`
          }
          if (item.seriesType === 'map' && item.value !== undefined && !isNaN(item.value)) {
            return `<b>${item.name}</b><br/>Value: ${item.value}`
          }
          return ''
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

    chartRef.current.on('mouseover', (item: any & EItem) => {
      if (item.seriesType === 'scatter') return
      if (item.seriesType === 'map') {
        if (!countryNames.includes(item.name)) {
          chartRef.current?.dispatchAction({ type: 'downplay', name: item.name })
        }
      }
    })

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

  return (
    <div ref={canvasRef} className={cx(className, '[&_*]:cursor-default!')} style={{ backgroundColor: colors.ocean }} />
  )
}
