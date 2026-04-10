import * as echarts from 'echarts'
import { useCallback, useEffect, useRef } from 'react'
import { type ECharts, type EItem } from './echarts-config'

interface Props {
  geoCount: number
  markerSize: number
  isItemActive: (name: string) => boolean
}

export const useEcharts = (props: Props) => {
  const { geoCount, markerSize, isItemActive } = props
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ECharts>(null)
  const draggingRef = useRef(false)
  const lastPosRef = useRef({ x: 0, y: 0 })

  const handleMapMouseOver = useCallback(
    (item: any & EItem) => {
      if (item.seriesType === 'scatter') return
      if (item.seriesType === 'map') {
        if (!isItemActive(item.name)) {
          // Disable hover effect for inactive countries
          chartRef.current?.dispatchAction({ type: 'downplay', name: item.name })
        }
      }
    },
    [isItemActive],
  )

  const handleMapUpdate = useCallback(() => {
    const geoOpt = chartRef.current?.getOption()?.geo as any[]
    const { zoom, center } = geoOpt?.[0] ?? {}
    // Sync all canvas layers
    chartRef.current?.setOption({
      geo: [{}, { zoom, center }],
      series: [{}, { type: 'scatter', symbolSize: markerSize * Math.sqrt(zoom ?? 1) }],
    })
  }, [markerSize])

  const handleContainerMouseDown = useCallback((event: MouseEvent) => {
    if (event.button !== 0 || !containerRef.current) return
    draggingRef.current = true
    lastPosRef.current = { x: event.clientX, y: event.clientY }
    containerRef.current.style.cursor = 'grabbing'
    event.stopPropagation()
  }, [])

  const handleWindowMouseUp = useCallback(() => {
    if (!draggingRef.current || !containerRef.current) return
    draggingRef.current = false
    containerRef.current.style.cursor = 'unset'
  }, [])

  const handleWindowMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!draggingRef.current || !chartRef.current) return

      const dx = event.clientX - lastPosRef.current.x
      const dy = event.clientY - lastPosRef.current.y
      lastPosRef.current = { x: event.clientX, y: event.clientY }

      const geoOpt = chartRef.current.getOption()?.geo as any[]
      const { center } = geoOpt?.[0] ?? {}

      const centerPixel = chartRef.current.convertToPixel({ geoIndex: 0 }, center) as unknown as number[]
      if (!centerPixel) return

      const newCenter = chartRef.current.convertFromPixel({ geoIndex: 0 }, [centerPixel[0] - dx, centerPixel[1] - dy])
      if (!newCenter) return

      chartRef.current.setOption({ geo: Array.from({ length: geoCount }, () => ({ center: newCenter })) })
    },
    [geoCount],
  )

  useEffect(() => {
    if (!containerRef.current) return

    chartRef.current?.dispose()
    chartRef.current = echarts.init(containerRef.current, null, { renderer: 'svg' })
    chartRef.current.on('mouseover', handleMapMouseOver)
    chartRef.current.on('georoam', handleMapUpdate)

    containerRef.current.addEventListener('mousedown', handleContainerMouseDown)
    window.addEventListener('mousemove', handleWindowMouseMove)
    window.addEventListener('mouseup', handleWindowMouseUp)

    const resizeObserver = new ResizeObserver(() => chartRef.current?.resize())
    resizeObserver.observe(containerRef.current)

    return () => {
      containerRef.current?.removeEventListener('mousedown', handleContainerMouseDown)
      window.removeEventListener('mousemove', handleWindowMouseMove)
      window.removeEventListener('mouseup', handleWindowMouseUp)
      resizeObserver.disconnect()
      chartRef.current?.dispose()
      chartRef.current = null
    }
  }, [handleMapMouseOver, handleMapUpdate, handleContainerMouseDown, handleWindowMouseMove, handleWindowMouseUp])

  return { containerRef, echartsRef: chartRef }
}
