import { type WorldMapJson } from '@app/shared/utils/geo-data/types'
import { Keyboard } from '@ds/core'
import { type RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { type ECityItem, type ECountryItem, type EItem } from '../_types'
import { type ActionItem, echarts, useEchartsUtils } from './use-echarts-utils'

interface GeoRoamParams {
  type?: string
  zoom?: number
  flush?: boolean
}

interface Props {
  containerRef: RefObject<HTMLDivElement | null>
  countryItems: ECountryItem[]
  cityItems: ECityItem[]
  getCitySize: (zoom: number) => number
  toggleDragging: (active: boolean) => void
}

export const useEcharts = (props: Props) => {
  const { containerRef, countryItems, cityItems, toggleDragging, getCitySize } = props
  const [geoMap, setGeoMap] = useState<WorldMapJson | null>(null)
  const chartRef = useRef<echarts.ECharts>(null)
  const indexRef = useRef<number>(-1)
  const { bringIntoView, dispatchAction, getCountryPosition } = useEchartsUtils({ chartRef, containerRef })

  const MOVE_SPEED = 8
  const ZOOM_SPEED = 1.1
  const MIN_ZOOM = 1.2
  const MAX_ZOOM = 30
  const MOVE_DELTA = {
    [Keyboard.ARROW_LEFT]: [-1, 0],
    [Keyboard.ARROW_RIGHT]: [1, 0],
    [Keyboard.ARROW_UP]: [0, 1],
    [Keyboard.ARROW_DOWN]: [0, -1],
  }
  const ZOOM_DELTA = {
    [Keyboard.PLUS]: 1,
    [Keyboard.EQUAL]: 1,
    [Keyboard.MINUS]: -1,
  }
  const HANDLED_KEYS = [Keyboard.SPACE, Keyboard.ESCAPE, ...Object.keys(MOVE_DELTA), ...Object.keys(ZOOM_DELTA)]

  const geoCountryNames = useMemo(() => geoMap?.features.map((f) => f.properties.name) || [], [geoMap])

  const itemSortFn = useCallback((a: ActionItem, b: ActionItem) => {
    const [lngA = 0, latA = 0] = a.center ?? []
    const [lngB = 0, latB = 0] = b.center ?? []
    const BAND_SIZE = 5 // Snap latitude to a band
    const bandA = Math.round(latA / BAND_SIZE)
    const bandB = Math.round(latB / BAND_SIZE)
    if (bandA !== bandB) return bandB - bandA
    return lngA - lngB
  }, [])

  const actionItems = useMemo(() => {
    return [
      ...countryItems
        .filter((item) => geoCountryNames.includes(item.name))
        .map(
          (item): ActionItem => ({
            seriesIndex: 0,
            name: item.name,
            ...getCountryPosition(item.name),
          }),
        ),
      ...cityItems.map(
        (item, index): ActionItem => ({
          seriesIndex: 1,
          name: item.name,
          dataIndex: index,
          center: [item.value[0], item.value[1]],
        }),
      ),
    ].sort(itemSortFn)
  }, [countryItems, cityItems, geoCountryNames, getCountryPosition])

  const countryNames = useMemo(() => countryItems.map((item) => item.name), [countryItems])
  const isCountryActive = useCallback((name: string) => countryNames.includes(name), [countryNames])

  const handleMapMouseOver = useCallback(
    (item: any & EItem) => {
      if (item.seriesType === 'map' && !isCountryActive(item.name)) {
        // Disable hover effect for inactive countries
        dispatchAction('downplay', item)
      }
    },
    [isCountryActive, dispatchAction],
  )

  const handleMapSync = useCallback(
    (params: unknown) => {
      const isZoom = (params as GeoRoamParams).zoom !== undefined
      const isPointer = (params as GeoRoamParams).type !== undefined
      const flush = Boolean((params as GeoRoamParams).flush)
      const geoOpt = chartRef.current?.getOption()?.geo as any[]
      const { zoom } = geoOpt?.[0] ?? {}
      const symbolSize = getCitySize(zoom ?? 1)

      // Sync layers (countries + cities)
      chartRef.current?.setOption({ series: [{}, { type: 'scatter', symbolSize }] }, { lazyUpdate: !flush })

      isPointer && !isZoom && toggleDragging(true)
    },
    [getCitySize, toggleDragging],
  )

  const focusItem = useCallback(
    (index: number) => {
      if (!actionItems.length || !chartRef.current) return

      const prev = actionItems[indexRef.current]
      indexRef.current = (index + actionItems.length) % actionItems.length
      const next = actionItems[indexRef.current]

      if (prev) {
        dispatchAction('downplay', prev)
        dispatchAction('hideTip', prev)
      }
      if (next) {
        bringIntoView(next) && handleMapSync({ flush: true })
        dispatchAction('highlight', next)
        dispatchAction('showTip', next)
      }
    },
    [actionItems, dispatchAction, bringIntoView, handleMapSync],
  )

  const resetItemFocus = useCallback(() => {
    const prev = actionItems[indexRef.current]
    if (prev) {
      dispatchAction('downplay', prev)
      dispatchAction('hideTip', prev)
    }
    indexRef.current = -1
  }, [actionItems, dispatchAction])

  const handleMouseUp = useCallback(() => {
    toggleDragging(false)
    resetItemFocus()
  }, [toggleDragging, resetItemFocus])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!chartRef.current) return
      if (HANDLED_KEYS.includes(event.key)) {
        event.preventDefault()
      }

      if (event.key === Keyboard.SPACE) {
        event.shiftKey ? focusItem(indexRef.current - 1) : focusItem(indexRef.current + 1)
        return
      }

      if (event.key === Keyboard.ESCAPE) {
        resetItemFocus()
        return
      }

      if (event.key in ZOOM_DELTA) {
        const geoOpt = chartRef.current.getOption()?.geo as any[]
        const { zoom = 1, center } = geoOpt?.[0] ?? {}
        const newZoom = Math.min(
          Math.max(ZOOM_DELTA[event.key] > 0 ? zoom * ZOOM_SPEED : zoom / ZOOM_SPEED, MIN_ZOOM),
          MAX_ZOOM,
        )
        chartRef.current.setOption({ geo: [{ zoom: newZoom, center }, {}] }, { lazyUpdate: true })
        handleMapSync({ zoom: newZoom })
      }

      if (event.key in MOVE_DELTA) {
        const geoOpt = chartRef.current.getOption()?.geo as any[]
        const { zoom = 1, center = [0, 0] } = geoOpt?.[0] ?? {}
        const step = MOVE_SPEED / zoom
        const newCenter = [center[0] + MOVE_DELTA[event.key][0] * step, center[1] + MOVE_DELTA[event.key][1] * step]
        chartRef.current.setOption({ geo: [{ center: newCenter }, {}] }, { lazyUpdate: true })
        handleMapSync({})
      }
    },
    [handleMapSync, focusItem, resetItemFocus],
  )

  const loadWorldMap = async () => {
    if (geoMap) return
    const json = (await import('@app/shared/utils/geo-data/world-map.json')).default as WorldMapJson
    echarts.registerMap('world', json as any)
    setGeoMap(json)
  }

  useEffect(() => {
    loadWorldMap()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !geoMap) return

    chartRef.current?.dispose()
    chartRef.current = echarts.init(container, null, { renderer: 'svg' })
    chartRef.current.on('mouseover', handleMapMouseOver)
    chartRef.current.on('georoam', handleMapSync)

    container.addEventListener('keydown', handleKeyDown)

    window.addEventListener('mouseup', handleMouseUp)

    const resizeObserver = new ResizeObserver(() => chartRef.current?.resize())
    resizeObserver.observe(container)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mouseup', handleMouseUp)
      resizeObserver.disconnect()
      chartRef.current?.dispose()
      chartRef.current = null
    }
  }, [geoMap, handleMapMouseOver, handleMapSync, handleMouseUp, handleKeyDown])

  return { chartRef }
}
