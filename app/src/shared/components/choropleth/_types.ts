import { type ReactNode } from 'react'

export interface ChoroplethData {
  countries: ChoroplethCountry[]
  cities: ChoroplethCity[]
}
export interface ChoroplethCountry {
  iso3: string
  name: string
  value: number
}
export interface ChoroplethCity {
  name: string
  lng: number
  lat: number
  value: number
}

export type Continent = 'world' | 'europe' | 'north-america' | 'south-america' | 'africa' | 'asia' | 'oceania'

export interface ChoroplethProps extends ReactProps {
  data: ChoroplethData
  continent?: Continent
  nameFn?: (value: string, query: string) => ReactNode
  queries?: string[]
  loading?: boolean
  toolbar?: ReactNode
}
