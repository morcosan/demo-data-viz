import { useColors } from '@app/shared/components/choropleth/_partials/use-colors'
import * as echarts from 'echarts'
import { useEffect, useMemo, useRef } from 'react'
import { type ChoroplethEntry } from '../_types'
import worldGeoJson from './world-geo.json'

echarts.registerMap('world', worldGeoJson as unknown as Parameters<typeof echarts.registerMap>[1])

export interface Props extends ReactProps {
  entries: ChoroplethEntry[]
}

export const EchartsCanvas = (props: Props) => {
  const { entries, className } = props
  const colors = useColors()
  const canvasRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.ECharts>(null)

  const mapData = useMemo(
    () =>
      entries.map((e) => ({
        name: e.label, // ECharts matches by country name in the GeoJSON
        value: e.value,
        iso3: e.key, // Keep the ISO-3 key available for custom tooltip use
      })),
    [entries],
  )

  useEffect(() => {
    if (!canvasRef.current) return

    chartRef.current?.dispose()
    chartRef.current = echarts.init(canvasRef.current, null, { renderer: 'svg' })
    chartRef.current.setOption({
      tooltip: {
        trigger: 'item',
        formatter: (params: echarts.DefaultLabelFormatterCallbackParams) => {
          const d = params.data as { name: string; value: number } | undefined
          if (!d) return ''
          return `<b>${d.name}</b><br/>Value: ${d.value}`
        },
      },
      visualMap: {
        min: Math.min(...entries.map((e) => e.value)),
        max: Math.max(...entries.map((e) => e.value)),
        show: true,
        orient: 'vertical',
        left: 'right',
        bottom: 'center',
        itemWidth: 15,
        itemHeight: 120,
        inRange: {
          color: [colors.scaleLow, colors.scaleHigh],
        },
      },
      series: [
        {
          type: 'map',
          map: 'world',
          roam: false,
          emphasis: {
            label: { show: false },
            itemStyle: { areaColor: colors.scaleHigh },
          },
          itemStyle: {
            areaColor: colors.land,
            borderColor: '#ffffff',
            borderWidth: 0.5,
          },
          data: mapData,
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
