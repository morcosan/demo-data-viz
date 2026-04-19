import { type WorldMapJson } from '@app/shared/utils/geo-data/types'
import { Keyboard } from '@ds/core'
import { type RefObject, useCallback, useMemo, useRef } from 'react'
import { type ECharts, type ECityItem, type ECountryItem, type EGeoRoam } from '../_types'
import { type ActionItem, useEchartsUtils } from './use-echarts-utils'

interface Props {
  containerRef: RefObject<HTMLDivElement | null>
  chartRef: RefObject<ECharts | null>
  countryItems: ECountryItem[]
  cityItems: ECityItem[]
  geoMap: WorldMapJson | null
  syncFnRef: RefObject<EGeoRoam>
}

export const useEchartsA11y = (props: Props) => {
  const { containerRef, chartRef, countryItems, cityItems, geoMap, syncFnRef } = props
  const { bringIntoView, dispatchAction, getCountryPosition } = useEchartsUtils({ chartRef, containerRef })
  const indexRef = useRef<number>(-1)

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
        bringIntoView(next) && syncFnRef.current({ flush: true })
        dispatchAction('highlight', next)
        dispatchAction('showTip', next)
      }
    },
    [chartRef, actionItems, dispatchAction, bringIntoView, syncFnRef],
  )

  const resetItemFocus = useCallback(() => {
    const prev = actionItems[indexRef.current]
    if (prev) {
      dispatchAction('downplay', prev)
      dispatchAction('hideTip', prev)
    }
    indexRef.current = -1
  }, [actionItems, dispatchAction])

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
        syncFnRef.current({ zoom: newZoom })
      }

      if (event.key in MOVE_DELTA) {
        const geoOpt = chartRef.current.getOption()?.geo as any[]
        const { zoom = 1, center = [0, 0] } = geoOpt?.[0] ?? {}
        const step = MOVE_SPEED / zoom
        const newCenter = [center[0] + MOVE_DELTA[event.key][0] * step, center[1] + MOVE_DELTA[event.key][1] * step]
        chartRef.current.setOption({ geo: [{ center: newCenter }, {}] }, { lazyUpdate: true })
        syncFnRef.current({})
      }
    },
    [chartRef, syncFnRef, focusItem, resetItemFocus],
  )

  return { handleKeyDown, resetItemFocus, dispatchAction }
}
