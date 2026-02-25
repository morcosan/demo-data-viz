import type { JsonStat, TableConst } from './_types'

const extractConstantsFromJsonStat = (jsonStat: JsonStat): TableConst[] => {
  const { id, size, dimension, value } = jsonStat

  const totalRows = Array.isArray(value) ? value.length : size.reduce((acc, s) => acc * s, 1)

  // Compute row-major strides
  const strides = new Array(size.length).fill(1)
  let acc = 1
  for (let j = size.length - 1; j >= 0; j--) {
    strides[j] = acc
    acc *= size[j]
  }

  const result: TableConst[] = []

  for (let j = 0; j < id.length; j++) {
    const dimId = id[j]
    const dimSize = size[j]

    // Constant if:
    // - only 1 category
    // - or we never advance far enough to change its index
    const isConstant = dimSize === 1 || totalRows <= strides[j]

    if (!isConstant) continue

    // Determine which category index is used (always 0 in both cases)
    const dimIndex = 0

    // Invert category index (position -> code)
    const categoryIndex = dimension[dimId].category.index
    let code = ''
    for (const [c, index] of Object.entries(categoryIndex)) {
      if (index === dimIndex) {
        code = c
        break
      }
    }

    result.push({
      key: dimId,
      label: dimension[dimId]?.label || dimId,
      value: dimension[dimId].category.label[code] ?? code,
    })
  }

  return result
}

export { extractConstantsFromJsonStat }
