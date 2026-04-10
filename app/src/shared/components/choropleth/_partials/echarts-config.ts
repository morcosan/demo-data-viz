import * as echarts from 'echarts'
import { type Continent } from '../_types'
import worldGeoJson from './world-geo.json'

echarts.registerMap('world', worldGeoJson as unknown as Parameters<typeof echarts.registerMap>[1])

export const GEO_JSON_NAMES = {
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
} as const as Record<string, string>

export const GEO_CONTINENT_VIEW = {
  world: { center: [0, 0], zoom: 1 },
  europe: { center: [15, 54], zoom: 3.5 },
  'north-america': { center: [-100, 48], zoom: 2.2 },
  'south-america': { center: [-60, -15], zoom: 2.2 },
  africa: { center: [20, 5], zoom: 2.5 },
  asia: { center: [90, 35], zoom: 2.2 },
  oceania: { center: [140, -25], zoom: 3 },
} as const as Record<Continent, EView>

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
