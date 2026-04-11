import * as echarts from 'echarts'
import { type Continent } from '../_types'

let _registered = false
export const registerWorldMap = async () => {
  if (_registered) return
  const worldGeoJson = (await import('@app/shared/utils/geo-data/world-geo.json')).default
  echarts.registerMap('world', worldGeoJson as any)
  _registered = true
}

export const GEO_JSON_NAMES: Record<string, string> = {
  'Timor-Leste': 'East Timor',
  "Lao People's Democratic Republic": 'Laos',
  'Syrian Arab Republic': 'Syria',
  Eswatini: 'eSwatini',
  'Falkland Islands (Malvinas)': 'Falkland Islands',
} as const

export const GEO_CONTINENT_VIEW: Record<Continent, EView> = {
  world: { center: [0, 13], zoom: 1.2 },
  europe: { center: [15, 52.5], zoom: 4.75 },
  'north-america': { center: [-100, 45], zoom: 2.3 },
  'south-america': { center: [-60, -22], zoom: 2.6 },
  africa: { center: [20, 1], zoom: 2.45 },
  asia: { center: [80, 33], zoom: 1.95 },
  oceania: { center: [140, -27], zoom: 4.1 },
} as const

export type EView = { center: [number, number]; zoom: number }
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
