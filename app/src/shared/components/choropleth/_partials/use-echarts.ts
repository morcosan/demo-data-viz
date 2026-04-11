import * as echarts from 'echarts'
import { useCallback, useEffect, useRef } from 'react'
import { type ECharts, type EItem } from './echarts-config'

interface Props {
  markerSize: number
  isItemActive: (name: string) => boolean
  draggingClass: string
}

export const useEcharts = (props: Props) => {
  const { markerSize, isItemActive, draggingClass } = props
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ECharts>(null)
  const isDraggingRef = useRef(false)

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

  const handleMapMove = useCallback(() => {
    if (!containerRef.current) return
    isDraggingRef.current = true
    containerRef.current.style.cursor = 'grabbing'
    containerRef.current.classList.add(draggingClass)

    const geoOpt = chartRef.current?.getOption()?.geo as any[]
    const { zoom, center } = geoOpt?.[0] ?? {}

    // Sync all canvas layers
    chartRef.current?.setOption(
      {
        geo: [{}, { zoom, center }],
        series: [{}, { type: 'scatter', symbolSize: markerSize * Math.sqrt(zoom ?? 1) }],
      },
      { lazyUpdate: true },
    )
  }, [draggingClass, markerSize])

  const handlePointerUp = useCallback(() => {
    if (!containerRef.current) return
    isDraggingRef.current = false
    containerRef.current.style.cursor = 'unset'
    containerRef.current.classList.remove(draggingClass)
  }, [draggingClass])

  useEffect(() => {
    if (!containerRef.current) return

    chartRef.current?.dispose()
    chartRef.current = echarts.init(containerRef.current, null, { renderer: 'svg' })
    chartRef.current.on('mouseover', handleMapMouseOver)
    chartRef.current.on('georoam', handleMapMove)

    window.addEventListener('mouseup', handlePointerUp)

    const resizeObserver = new ResizeObserver(() => chartRef.current?.resize())
    resizeObserver.observe(containerRef.current)

    return () => {
      window.removeEventListener('mouseup', handlePointerUp)
      resizeObserver.disconnect()
      chartRef.current?.dispose()
      chartRef.current = null
    }
  }, [handleMapMouseOver, handleMapMove, handlePointerUp])

  return { containerRef, echartsRef: chartRef }
}
