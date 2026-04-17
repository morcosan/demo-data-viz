import { MapChart, ScatterChart } from 'echarts/charts'
import { GeoComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { type RefObject, useCallback } from 'react'
import { type ECoords } from '../_types'

echarts.use([GeoComponent, MapChart, SVGRenderer, ScatterChart, TooltipComponent, VisualMapComponent])

export { echarts }

export type ItemLimits = { left: number; right: number; top: number; bottom: number }
export type ItemPosition = {
  center?: ECoords
  limits?: ItemLimits
}
export type ActionItem = {
  name: string
  seriesIndex: number
  center?: ECoords
  limits?: ItemLimits
  dataIndex?: number
}

interface Props {
  chartRef: RefObject<echarts.ECharts | null>
  containerRef: RefObject<HTMLDivElement | null>
}

export const useEchartsUtils = (props: Props) => {
  const { chartRef, containerRef } = props

  const getCountryPosition = useCallback((name: string): ItemPosition | undefined => {
    const features = (echarts.getMap('world')?.geoJSON as any)?.features
    const feature = features?.find((f: any) => f.properties?.name === name)
    if (!feature) return undefined

    // Collect all rings: Polygon has one level of nesting, MultiPolygon has two
    const { type, coordinates } = feature.geometry
    const rings: number[][][] = type === 'Polygon' ? coordinates : (coordinates as number[][][][]).flat()

    // Use shoelace formula for actual polygon area (not bounding-box area)
    const polygonArea = (ring: number[][]): number => {
      let area = 0
      for (let i = 0; i < ring.length - 1; i++) {
        area += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]
      }
      return Math.abs(area / 2)
    }

    const maxRing = rings.reduce(
      (best, ring) => {
        const area = polygonArea(ring)
        return area > best.area ? { ring, area } : best
      },
      { ring: rings[0], area: -Infinity },
    ).ring

    const lngs = maxRing.map((p) => p[0])
    const lats = maxRing.map((p) => p[1])

    return {
      center: [(Math.min(...lngs) + Math.max(...lngs)) / 2, (Math.min(...lats) + Math.max(...lats)) / 2],
      limits: { left: Math.min(...lngs), right: Math.max(...lngs), top: Math.max(...lats), bottom: Math.min(...lats) },
    }
  }, [])

  const bringIntoView = useCallback(
    (item: ActionItem): true | undefined => {
      if (!chartRef.current || !containerRef.current || !item.center) return

      const px = chartRef.current.convertToPixel({ geoIndex: 0 }, item.center) as ECoords | null
      if (!px) return

      const { width, height } = containerRef.current.getBoundingClientRect()
      const padding = 60 // px buffer from edge
      const isOutside = px[0] < padding || px[0] > width - padding || px[1] < padding || px[1] > height - padding

      if (isOutside) {
        chartRef.current.setOption({ geo: [{ center: item.center }, {}] }, { lazyUpdate: false })
        return true
      }
    },
    [chartRef, containerRef],
  )

  const dispatchAction = useCallback(
    (type: string, item: ActionItem) => {
      const chart = chartRef.current
      const geoOpt = chart?.getOption()?.geo as any[]
      const zoom = geoOpt?.[0]?.zoom ?? 1
      const BASE_MARGIN = 6
      const margin = BASE_MARGIN * Math.log2(zoom + 1)
      const center = item.center && chart?.convertToPixel({ geoIndex: 0 }, item.center)
      const bottom = item.limits && chart?.convertToPixel({ geoIndex: 0 }, [item.limits.right, item.limits.bottom])
      const position = center && bottom ? [center[0], bottom[1]] : bottom ? bottom : center ? center : null

      chart?.dispatchAction({
        type,
        seriesIndex: item.seriesIndex,
        ...(item.dataIndex !== undefined ? { dataIndex: item.dataIndex } : { name: item.name }),
        ...(position ? { position: [position[0], position[1] + margin] } : {}),
      })
    },
    [chartRef],
  )

  return {
    bringIntoView,
    dispatchAction,
    getCountryPosition,
  }
}
