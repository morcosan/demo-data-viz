import { type ReactNode } from 'react'

export type ChoroplethData = { entries: ChoroplethEntry[] } // Data wrapper required due to Storybook limitations
export type ChoroplethEntry = {
  key: string // ISO-3 country code
  label: string
  value: number
}

export interface ChoroplethProps extends ReactProps {
  data: ChoroplethData
  labelFn?: (value: string, query: string) => ReactNode
  queries?: string[]
  loading?: boolean
  toolbar?: ReactNode
}
