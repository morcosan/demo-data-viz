import { type WorldMapJson } from '@app/shared/utils/geo-data/types'
import { useViewportService } from '@ds/core'
import { MapChart, ScatterChart } from 'echarts/charts'
import { GeoComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { type RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ECharts, ECityItem, ECountryItem, EGeoRoam, EGeoRoamParams, EItem } from '../_types'
import { useEchartsA11y } from './use-echarts-a11y'

echarts.use([CanvasRenderer, GeoComponent, MapChart, SVGRenderer, ScatterChart, TooltipComponent, VisualMapComponent])

interface Props {
  containerRef: RefObject<HTMLDivElement | null>
  countryItems: ECountryItem[]
  cityItems: ECityItem[]
  getCitySize: (zoom: number) => number
  toggleDragging: (active: boolean) => void
}

export const useEcharts = (props: Props) => {
  const { containerRef, countryItems, cityItems, toggleDragging, getCitySize } = props
  const { isViewportMaxLG: isMobile } = useViewportService()
  const [geoMap, setGeoMap] = useState<WorldMapJson | null>(null)
  const chartRef = useRef<ECharts>(null)
  const syncFnRef = useRef<EGeoRoam>(() => {})
  const { dispatchAction, handleKeyDown, resetItemFocus } = useEchartsA11y({
    containerRef,
    chartRef,
    countryItems,
    cityItems,
    geoMap,
    syncFnRef,
  })

  const countryNames = useMemo(() => countryItems.map((item) => item.name), [countryItems])
  const isCountryActive = useCallback((name: string) => countryNames.includes(name), [countryNames])

  syncFnRef.current = useCallback(
    (params: unknown) => {
      const { zoom: zoomParam, type: typeParam, flush: flushParam } = params as EGeoRoamParams
      const isZoom = zoomParam !== undefined
      const isPointer = typeParam !== undefined

      if (isZoom) {
        const geoOpt = chartRef.current?.getOption()?.geo as any[]
        const { zoom } = geoOpt?.[0] ?? {}
        const symbolSize = getCitySize(zoom ?? 1)
        chartRef.current?.setOption({ series: [{}, { type: 'scatter', symbolSize }] }, { lazyUpdate: !flushParam })
      } else {
        isPointer && toggleDragging(true)
      }
    },
    [getCitySize, toggleDragging],
  )

  const handleMouseOver = useCallback(
    (item: any & EItem) => {
      if (item.seriesType === 'map' && !isCountryActive(item.name)) {
        dispatchAction('downplay', item) // Disable hover effect for inactive countries
      }
    },
    [isCountryActive, dispatchAction],
  )

  const handleMouseUp = useCallback(() => {
    toggleDragging(false)
    resetItemFocus()
  }, [toggleDragging, resetItemFocus])

  useEffect(() => {
    const init = async () => {
      if (geoMap) return
      const json = (await import('@app/shared/utils/geo-data/world-map.json')).default as WorldMapJson
      echarts.registerMap('world', json as any)
      setGeoMap(json)
    }
    init()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !geoMap) return

    chartRef.current?.dispose()
    chartRef.current = echarts.init(container, null, { renderer: isMobile ? 'canvas' : 'svg' })
    chartRef.current.on('mouseover', handleMouseOver)
    chartRef.current.on('georoam', syncFnRef.current as (_: unknown) => void)
    container.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mouseup', handleMouseUp)

    const observer = new ResizeObserver(() => chartRef.current?.resize())
    observer.observe(container)

    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
      container.removeEventListener('keydown', handleKeyDown)
      observer.disconnect()
      chartRef.current?.dispose()
      chartRef.current = null
    }
  }, [geoMap, handleMouseOver, syncFnRef.current, handleMouseUp, handleKeyDown, isMobile])

  return { chartRef }
}
