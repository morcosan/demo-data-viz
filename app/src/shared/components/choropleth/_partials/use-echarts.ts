import * as echarts from 'echarts'
import { type RefObject, useEffect, useRef } from 'react'
import { type ECharts, type EItem } from './echarts-config'

interface Props {
  containerRef: RefObject<HTMLDivElement | null>
  isActiveFn: (name: string) => boolean
  citySize: number
}

export const useEcharts = (props: Props) => {
  const { containerRef, isActiveFn, citySize } = props
  const echartsRef = useRef<ECharts>(null)

  const handleMapMouseOver = (item: any & EItem) => {
    if (item.seriesType === 'scatter') return
    if (item.seriesType === 'map') {
      if (!isActiveFn(item.name)) {
        // Disable hover effect for inactive countries
        echartsRef.current?.dispatchAction({ type: 'downplay', name: item.name })
      }
    }
  }

  const handleMapUpdate = () => {
    const geoOpt = echartsRef.current?.getOption()?.geo as any[]
    const { zoom, center } = geoOpt?.[0] ?? {}
    // Sync all canvas layers
    echartsRef.current?.setOption({
      geo: [{}, { zoom, center }],
      series: [{}, { type: 'scatter', symbolSize: citySize * Math.sqrt(zoom ?? 1) }],
    })
  }

  useEffect(() => {
    if (!containerRef.current) return

    echartsRef.current?.dispose()
    echartsRef.current = echarts.init(containerRef.current, null, { renderer: 'svg' })
    echartsRef.current.on('mouseover', handleMapMouseOver)
    echartsRef.current.on('georoam', handleMapUpdate)

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

  return { echarts, echartsRef }
}
