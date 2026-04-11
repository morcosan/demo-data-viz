import * as echarts from 'echarts'
import { type Continent } from '../_types'

let _registered = false
export const registerWorldMap = async () => {
  if (_registered) return
  const res = await fetch('/world-geo.json')
  const worldGeoJson = await res.json()
  echarts.registerMap('world', worldGeoJson)
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
  europe: { center: [15, 52], zoom: 4.4 },
  'north-america': { center: [-100, 45], zoom: 2.2 },
  'south-america': { center: [-60, -22], zoom: 2.4 },
  africa: { center: [20, 1], zoom: 2.35 },
  asia: { center: [90, 33], zoom: 1.95 },
  oceania: { center: [140, -28], zoom: 4.2 },
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
