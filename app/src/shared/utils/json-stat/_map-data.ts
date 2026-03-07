import { type TableCol, type TableRow } from '@app/shared/types/table'
import { mapJsonStatConstants } from './_map-constants'
import { type JsonStat, type JsonStatData, VALUE_KEY } from './_types'

const mapJsonStatData = (jsonStat: JsonStat): JsonStatData => {
  const { id, size, dimension, value } = jsonStat
  const rows: TableRow[] = []
  const indexedValues = Array.isArray(value)
    ? value.map((v, idx) => [idx, v] as const)
    : (() => {
        const result = []
        for (const key in value) {
          result.push([Number(key), value[key]] as const)
        }
        return result
      })()
  const totalRows = indexedValues.length
  const consts = mapJsonStatConstants(jsonStat)
  const constKeys = consts.map((c) => c.key)

  // Build headers from dimension labels plus value column
  const cols: TableCol[] = [
    ...id
      .filter((dimId) => !constKeys.includes(dimId))
      .map((dimId) => ({
        key: dimId,
        label: dimension[dimId]?.label || dimId,
      })),
    { key: VALUE_KEY, label: '' },
  ]

  // Pre-build inverted index: dimId -> array of category codes by position
  const dimCodes = id.map((dimId) => {
    const cats = dimension[dimId].category.index
    const codes: string[] = []
    for (const [code, idx] of Object.entries(cats)) {
      codes[idx] = code
    }
    return codes
  })

  for (let i = 0; i < totalRows; i++) {
    const [flatIndex, rawValue] = indexedValues[i]
    const row: TableRow = {}
    let index = flatIndex

    // Decode each dimension (iterate right to left for row-major order)
    for (let j = id.length - 1; j >= 0; j--) {
      const dimId = id[j]
      const dimSize = size[j]
      const dimIndex = index % dimSize
      index = Math.floor(index / dimSize)

      // Find the category code at this index
      const categoryCode = dimCodes[j][dimIndex] || ''

      // Use the label as the value
      row[dimId] = dimension[dimId].category.label[categoryCode] || categoryCode
    }

    // Add the value
    row.value = rawValue ?? '' // Allow 0 as value

    rows.push(row)
  }

  // Build valuesByCol
  const valuesByCol: Record<string, string[]> = Object.fromEntries(
    id
      .map((dimId: string) => {
        const { index, label } = dimension[dimId].category
        const values = Object.keys(index).map((code) => label[code] ?? code)
        return [dimId, values] as const
      })
      .filter(([, values]) => values.length > 1),
  )

  return { cols, rows, consts, valuesByCol }
}

export { mapJsonStatData }
