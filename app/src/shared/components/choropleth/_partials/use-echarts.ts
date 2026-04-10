import * as echarts from 'echarts'
import { type RefObject, useEffect, useRef } from 'react'
import worldGeoJson from './world-geo.json'

echarts.registerMap('world', worldGeoJson as unknown as Parameters<typeof echarts.registerMap>[1])

const GEO_JSON_NAMES = {
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

export type ECharts = echarts.ECharts
export type EChartsOption = echarts.EChartsOption
export type EItemStyle = echarts.MapSeriesOption['itemStyle']
export type ELegend = echarts.EChartsOption['visualMap']
export type ETooltip = echarts.EChartsOption['tooltip']
export type EItem = {
  name: string
  value: number | number[]
  seriesType?: 'map' | 'scatter'
  match?: boolean
} & Record<string, any>

interface Props {
  containerRef: RefObject<HTMLDivElement | null>
  isActiveFn: (name: string) => boolean
  citySize: number
}

export const useEcharts = (props: Props) => {
  const { containerRef, isActiveFn, citySize } = props
  const echartsRef = useRef<ECharts>(null)

  useEffect(() => {
    if (!containerRef.current) return

    echartsRef.current?.dispose()
    echartsRef.current = echarts.init(containerRef.current, null, { renderer: 'svg' })

    // Disable hover effect for inactive countries
    echartsRef.current.on('mouseover', (item: any & EItem) => {
      if (item.seriesType === 'scatter') return
      if (item.seriesType === 'map') {
        if (!isActiveFn(item.name)) {
          echartsRef.current?.dispatchAction({ type: 'downplay', name: item.name })
        }
      }
    })

    // Sync all canvas layers
    echartsRef.current.on('georoam', () => {
      const geoOpt = echartsRef.current?.getOption()?.geo as any[]
      const { zoom, center } = geoOpt?.[0] ?? {}
      echartsRef.current?.setOption({
        geo: [{}, { zoom, center }],
        series: [{}, { type: 'scatter', symbolSize: citySize * Math.sqrt(zoom ?? 1) }],
      })
    })

    // ---- Full-canvas drag override ----
    const container = containerRef.current
    let dragging = false
    let lastX = 0
    let lastY = 0

    container.style.cursor = 'unset'

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
      container.style.cursor = 'grabbing'
      e.stopPropagation()
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY

      const chart = echartsRef.current
      if (!chart) return

      const geoOpt = chart.getOption()?.geo as any[]
      const { center } = geoOpt?.[0] ?? {}

      // Convert current center to pixel, shift by delta, convert back
      const centerPixel = chart.convertToPixel({ geoIndex: 0 }, center) as unknown as number[]
      if (!centerPixel) return

      const newCenter = chart.convertFromPixel({ geoIndex: 0 }, [centerPixel[0] - dx, centerPixel[1] - dy])
      if (!newCenter) return

      chart.setOption({
        geo: [{ center: newCenter }, { center: newCenter }],
      })
    }

    const onMouseUp = () => {
      if (!dragging) return
      dragging = false
      container.style.cursor = 'unset'
    }

    // Attach mousedown on the container, move/up on window so fast drags don't break
    container.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    // -----------------------------------

    const resizeObserver = new ResizeObserver(() => echartsRef.current?.resize())
    resizeObserver.observe(container)

    return () => {
      container.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      resizeObserver.disconnect()
      echartsRef.current?.dispose()
      echartsRef.current = null
    }
  }, [])

  return { echarts, GEO_JSON_NAMES, echartsRef }
}
