import { type ReactNode } from 'react'

export interface ChoroplethData {
  countries: ChoroplethCountry[]
}

export interface ChoroplethCountry {
  iso3: string // ISO-3 country code
  name: string
  value: number
}

export interface ChoroplethProps extends ReactProps {
  data: ChoroplethData
  labelFn?: (value: string, query: string) => ReactNode
  queries?: string[]
  loading?: boolean
  toolbar?: ReactNode
}
