import type { TableCell, TableCol, TableRow } from '@app/shared/types/table'
import { computeTextWidth, formatNumber } from '@app/shared/utils/formatting'

const formatCellValue = (value: TableCell, col: TableCol): string => {
  if (value === 0) return '0'

  const isNumeric = col.type === 'int' || col.type === 'float'
  const decimals = col.type === 'float' ? 2 : 0
  const numValue = col.type === 'float' ? parseFloat(String(value)) : parseInt(String(value))

  return isNumeric && !isNaN(numValue) ? formatNumber(numValue, decimals) : String(value)
}

const computeColSize = (col: TableCol, rows: TableRow[]): number => {
  const MIN_COL_SIZE = 100
  const MAX_COL_SIZE = 400
  const FONT_SIZE = 14 // sm
  const SORT_BUTTON_WIDTH = 32 // button-h-sm
  const SORT_BUTTON_MARGIN = 6 // xs-2
  const CELL_PADDING = 12 * 2 // xs-5
  const NUMBER_PADDING = 14 // xs-6
  const ERROR_PADDING = 24 // sm-0
  const SAMPLE_SIZE = 100

  const isNumeric = col.type === 'int' || col.type === 'float'
  const sampleRows = rows.slice(0, SAMPLE_SIZE)
  const headerSize = computeTextWidth(col.label, FONT_SIZE)
  const rowSizes = sampleRows.map((row) => computeTextWidth(formatCellValue(row[col.key], col), FONT_SIZE, isNumeric))
  const avgRowSize = rowSizes.length ? rowSizes.reduce((sum, size) => sum + size, 0) / rowSizes.length : 0
  const totalSize = Math.max(headerSize, avgRowSize)
  const padding = CELL_PADDING + SORT_BUTTON_WIDTH + SORT_BUTTON_MARGIN + NUMBER_PADDING + ERROR_PADDING

  return Math.min(MAX_COL_SIZE, Math.max(MIN_COL_SIZE, Math.round(totalSize + padding)))
}

export { computeColSize, formatCellValue }
