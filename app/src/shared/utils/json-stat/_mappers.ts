import type { JsonStat, TableCol, TableData, TableRow } from './_types'

const mapJsonStatToTable = (jsonStat: JsonStat): TableData => {
  const { id, size, dimension, value } = jsonStat
  const rows: TableRow[] = []

  // Convert value to array if it's an object
  const values = Array.isArray(value) ? value : Object.keys(value).map((key) => value[key])

  const totalRows = values.length

  // Build headers from dimension labels plus value column
  const headers: TableCol[] = [
    ...id.map((dimId) => ({
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
    const row: TableRow = {}
    let index = i

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
    row.value = values[i] || ''

    rows.push(row)
  }

  return { cols: headers, rows }
}

export { mapJsonStatToTable }
