import worldGeoJson from '@app/shared/utils/geo-data/world-geo-echarts.json'
import * as echarts from 'echarts'
import { type Continent } from '../_types'

echarts.registerMap('world', worldGeoJson as unknown as Parameters<typeof echarts.registerMap>[1])

export const GEO_JSON_NAMES: Record<string, string> = {
  Czechia: 'Czech Rep.',
  'Ivory Coast': "Côte d'Ivoire",
  Eswatini: 'Swaziland',
  'Timor-Leste': 'East Timor',
  "Lao People's Democratic Republic": 'Laos',
  'Syrian Arab Republic': 'Syria',
  'Dominican Republic': 'Dominican Rep.',
  'Solomon Islands': 'Solomon Is.',
  'Falkland Islands (Malvinas)': 'Falkland Is.',
  'Central African Republic': 'Central African Rep.',
  'South Sudan': 'S. Sudan',
  'Bosnia and Herzegovina': 'Bosnia and Herz.',
  'Democratic Republic of the Congo': 'Dem. Rep. Congo',
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
