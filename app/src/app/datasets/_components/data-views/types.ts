import type { TableData } from '@app/shared/types/table'
import type { ReactNode } from 'react'

export interface TableViewProps extends ReactProps {
  data: TableData
  queries: string[]
  cellFn: (value: string, query: string, flip?: boolean) => ReactNode
}

export interface ChartViewProps extends TableViewProps {
  colKey: string | null
  toolbar?: ReactNode
  chartProps?: ReactProps
}
