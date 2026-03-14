export type TableCell = string | number
export type TableRow = Record<string, TableCell>
export type TableCol = {
  key: string
  label: string
  type: 'any' | 'int' | 'float'
  size?: number
  pivoted?: boolean
}
export type TableData = {
  cols: TableCol[]
  rows: TableRow[]
}
