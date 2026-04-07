import { useColors } from '@app/shared/components/choropleth/_partials/use-colors'
import * as echarts from 'echarts'
import { useEffect, useMemo, useRef } from 'react'
import { type ChoroplethEntry } from '../_types'
import worldGeoJson from './world-geo.json'

echarts.registerMap('world', worldGeoJson as unknown as Parameters<typeof echarts.registerMap>[1])

type EchartsData = {
  name: string
  value: number
}

export interface Props extends ReactProps {
  entries: ChoroplethEntry[]
}

export const EchartsCanvas = (props: Props) => {
  const { entries, className } = props
  const colors = useColors()
  const canvasRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.ECharts>(null)

  // Must match country name in world-geo.json
  const mapData = useMemo(() => entries.map((e): EchartsData => ({ name: e.label, value: e.value })), [entries])

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
        min: Math.min(...entries.map((e) => e.value)),
        max: Math.max(...entries.map((e) => e.value)),
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
            itemStyle: { areaColor: colors.hover },
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
