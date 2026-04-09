import { useCountries } from '@app-i18n'
import { type ReactNode, useEffect, useMemo, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { type ChoroplethCity, type ChoroplethCountry } from '../_types'
import { Tooltip } from './tooltip'
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
  nameFn: (value: string) => ReactNode
}

export const Canvas = (props: Props) => {
  const { cities, countries, nameFn, className } = props
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
    chartRef.current = echarts.init(canvasRef.current, null, { renderer: 'svg' })
    chartRef.current.setOption({
      series: [
        // Country layer
        {
          data: countryData,
          type: 'map',
          map: 'world',
          geoIndex: 0,
          selectedMode: false,
          itemStyle: {
            areaColor: colors.land,
            borderColor: colors.border,
            borderWidth: 0.5,
          },
        },
        // City layer
        {
          data: cityData,
          type: 'scatter',
          coordinateSystem: 'geo',
          symbolSize: citySize,
          itemStyle: {
            borderColor: colors.border,
            borderWidth: 0.5,
          },
        },
      ],
      geo: {
        map: 'world',
        roam: true,
        silent: false,
        itemStyle: { areaColor: colors.land },
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
        padding: 0,
        borderWidth: 0,
        backgroundColor: 'transparent',
        extraCssText: 'box-shadow: none;',
        formatter: (item: any & EItem) => {
          const value = Array.isArray(item.value) ? item.value[2] : item.value
          return renderToStaticMarkup(<Tooltip name={item.name} value={value} nameFn={nameFn} />)
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
