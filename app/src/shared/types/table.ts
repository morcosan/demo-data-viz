export type TableRowValue = string | number
export type TableRow = Record<string, TableRowValue>
export type TableCol = {
  key: string
  label: string
  size?: number
  pivoted?: boolean
}
export type TableData = {
  cols: TableCol[]
  rows: TableRow[]
}
