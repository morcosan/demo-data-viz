import type { ReactNode } from 'react'

export type BarChartEntry = Record<string, number | string>
export type BarChartData = { entries: BarChartEntry[] } // Data wrapper required due to Storybook limitations

export interface BarChartProps extends ReactProps {
  data: BarChartData
  barNames: Record<string, string>
  entryKey: string
  entryName: string
  entryFn?: (value: string, query: string) => ReactNode
  entryWidth?: number
  chartSize?: 'sm' | 'md' | 'lg'
  queries?: string[]
  sortKey?: string
  sortDir?: 'asc' | 'desc'
  loading?: boolean
  toolbar?: ReactNode
}
