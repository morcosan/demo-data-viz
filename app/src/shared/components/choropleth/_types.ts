import { type GeoContinent } from '@app/shared/utils/geo-data/types'
import { type MapSeriesOption } from 'echarts/charts'
import { type EChartsCoreOption } from 'echarts/core'
import { type ReactNode } from 'react'

export type EChartsOption = EChartsCoreOption
export type EItemStyle = MapSeriesOption['itemStyle']
export type ELegend = EChartsCoreOption['visualMap']
export type ETooltip = EChartsCoreOption['tooltip']
export type ECoords = [number, number]
export type ECountryValue = number
export type ECityValue = [number, number, number]
export type EViewConfig = { center: ECoords; zoom: number }
export type ECountryItem = EItem<ECountryValue>
export type ECityItem = EItem<ECityValue>
export type EItem<T = ECountryValue | ECityValue> = {
  name: string
  value: T
  data?: ChoroEntry
  seriesType?: 'map' | 'scatter'
  match?: boolean
} & Record<string, any>

export interface ChoroData {
  countries: ChoroEntry[]
  cities: ChoroEntry[]
}
export interface ChoroEntry {
  name: string
  value: number
  iso2?: string
  area?: GeoContinent
}

export type ChoroView = 'world' | 'europe' | 'north-america' | 'south-america' | 'africa' | 'asia' | 'oceania'

export interface ChoroplethProps extends ReactProps {
  data: ChoroData
  view?: ChoroView
  queries?: string[]
  loading?: boolean
  toolbar?: ReactNode
  chartProps?: ReactProps
}
