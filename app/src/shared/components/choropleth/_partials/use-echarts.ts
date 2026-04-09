import * as echarts from 'echarts'
import worldGeoJson from './world-geo.json'

echarts.registerMap('world', worldGeoJson as unknown as Parameters<typeof echarts.registerMap>[1])

const GEO_JSON_NAMES = {
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

export type ECharts = echarts.ECharts
export type EChartsOption = echarts.EChartsOption

export const useEcharts = () => {
  return { echarts, GEO_JSON_NAMES }
}
