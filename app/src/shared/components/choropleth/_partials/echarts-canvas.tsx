import { useCountries } from '@app-i18n'
import { useColors } from '@app/shared/components/choropleth/_partials/use-colors'
import * as echarts from 'echarts'
import { useEffect, useMemo, useRef } from 'react'
import { type ChoroplethCountry } from '../_types'
import worldGeoJson from './world-geo.json'

echarts.registerMap('world', worldGeoJson as unknown as Parameters<typeof echarts.registerMap>[1])

type EchartsData = {
  name: string
  value: number
}

export interface Props extends ReactProps {
  countries: ChoroplethCountry[]
}

export const EchartsCanvas = (props: Props) => {
  const { countries, className } = props
  const { getCountryName } = useCountries()
  const colors = useColors()
  const canvasRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.ECharts>(null)

  // Must match country name in world-geo.json
  const mapData = useMemo(
    () => countries.map((e): EchartsData => ({ name: getCountryName(e.iso3), value: e.value })),
    [countries, getCountryName],
  )

  useEffect(() => {
    if (!canvasRef.current) return

    chartRef.current?.dispose()
    chartRef.current = echarts.init(canvasRef.current, null, { renderer: 'svg' })
    chartRef.current.setOption({
      tooltip: {
        trigger: 'item',
        formatter: ({ data }: { data: EchartsData }) => {
          return data ? `<b>${data.name}</b><br/>Value: ${data.value}` : ''
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
            itemStyle: { areaColor: null },
            label: { show: false },
          },
          itemStyle: {
            areaColor: colors.land,
            borderColor: colors.border,
            borderWidth: 0.5,
          },
        },
      ],
    })

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
