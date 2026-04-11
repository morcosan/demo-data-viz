import * as echarts from 'echarts'
import { useCallback, useEffect, useRef } from 'react'
import { type ECharts, type EItem } from './echarts-config'

interface Props {
  geoCount: number
  markerSize: number
  isItemActive: (name: string) => boolean
  draggingClass: string
}

export const useEcharts = (props: Props) => {
  const { geoCount, markerSize, isItemActive, draggingClass } = props
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ECharts>(null)
  const isDraggingRef = useRef(false)
  const lastPosRef = useRef({ x: 0, y: 0 })
  const DRAG_THRESHOLD = 10

  const getEventCoords = (event: MouseEvent | TouchEvent) => {
    return 'touches' in event
      ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
      : { x: event.clientX, y: event.clientY }
  }

  const updateMapPosition = useCallback(
    (dx: number, dy: number) => {
      if (!chartRef.current) return

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

  const enableDragging = useCallback(() => {
    if (!containerRef.current) return
    isDraggingRef.current = true
    containerRef.current.style.cursor = 'grabbing'
    containerRef.current.classList.add(draggingClass)
  }, [draggingClass])

  const disableDragging = useCallback(() => {
    if (!containerRef.current) return
    isDraggingRef.current = false
    containerRef.current.style.cursor = 'unset'
    containerRef.current.classList.remove(draggingClass)
  }, [draggingClass])

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

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (!containerRef.current || event.button !== 0) return
      enableDragging()
      lastPosRef.current = getEventCoords(event)
      event.stopPropagation()
    },
    [enableDragging],
  )

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (!containerRef.current || event.touches.length !== 1) return
    lastPosRef.current = getEventCoords(event)
    event.preventDefault()

    // Trigger tooltip at touchpoint, mimicking mouse hover
    const rect = containerRef.current.getBoundingClientRect()
    const { x, y } = getEventCoords(event)
    chartRef.current?.dispatchAction({
      type: 'showTip',
      x: x - rect.left,
      y: y - rect.top,
    })
  }, [])

  const handlePointerUp = disableDragging

  const handlePointerMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!chartRef.current) return
      if ('touches' in event) {
        if (event.touches.length !== 1) return // Ignore multi-touch (pinch-zoom)
      } else {
        if (!isDraggingRef.current) return
      }

      const { x, y } = getEventCoords(event)
      const dx = x - lastPosRef.current.x
      const dy = y - lastPosRef.current.y
      lastPosRef.current = { x, y }

      // Start dragging only after threshold
      if (!isDraggingRef.current) {
        if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return
        enableDragging()
      }

      updateMapPosition(dx, dy)
    },
    [enableDragging, updateMapPosition],
  )

  useEffect(() => {
    if (!containerRef.current) return

    chartRef.current?.dispose()
    chartRef.current = echarts.init(containerRef.current, null, { renderer: 'svg' })
    chartRef.current.on('mouseover', handleMapMouseOver)
    chartRef.current.on('georoam', handleMapUpdate)

    containerRef.current.addEventListener('mousedown', handleMouseDown, { passive: false })
    containerRef.current.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('mousemove', handlePointerMove)
    window.addEventListener('touchmove', handlePointerMove)
    window.addEventListener('mouseup', handlePointerUp)
    window.addEventListener('touchend', handlePointerUp)

    const resizeObserver = new ResizeObserver(() => chartRef.current?.resize())
    resizeObserver.observe(containerRef.current)

    return () => {
      containerRef.current?.removeEventListener('mousedown', handleMouseDown)
      containerRef.current?.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('touchmove', handlePointerMove)
      window.removeEventListener('mouseup', handlePointerUp)
      window.removeEventListener('touchend', handlePointerUp)
      resizeObserver.disconnect()
      chartRef.current?.dispose()
      chartRef.current = null
    }
  }, [handleMapMouseOver, handleMapUpdate, handleMouseDown, handlePointerMove, handlePointerUp, handleTouchStart])

  return { containerRef, echartsRef: chartRef }
}
