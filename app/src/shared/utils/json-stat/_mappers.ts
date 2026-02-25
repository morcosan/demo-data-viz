import type { JsonStat, TableCol, TableData, TableRow } from './_types'
import { extractConstantsFromJsonStat } from './_utils'

const mapJsonStatToTable = (jsonStat: JsonStat): TableData => {
  const { id, size, dimension, value } = jsonStat
  const rows: TableRow[] = []
  const indexedValues = Array.isArray(value)
    ? value.map((v, idx) => [idx, v] as const)
    : (() => {
        const result = [] // Object.entries and Object.keys are too slow for large datasets
        for (const key in value) {
          result.push([Number(key), value[key]] as const)
        }
        return result
      })()
  const totalRows = indexedValues.length
  const consts = extractConstantsFromJsonStat(jsonStat)
  const constKeys = consts.map((c) => c.key)

  // Build headers from dimension labels plus value column
  const cols: TableCol[] = [
    ...id
      .filter((dimId) => !constKeys.includes(dimId))
      .map((dimId) => ({
        key: dimId,
        label: dimension[dimId]?.label || dimId,
      })),
    { key: 'value', label: 'Value' },
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

  return { cols, rows, consts }
}

export { mapJsonStatToTable }
