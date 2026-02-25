import { mapJsonStatToTable } from './_mappers'
import { type JsonStat, type TableData } from './_types'

const convertJsonStatToTable = async (jsonStatStr: string): Promise<TableData> => {
  // const timer = startTimer('convertJsonStatToTable')
  const jsonStat = JSON.parse(jsonStatStr) as JsonStat
  const result = mapJsonStatToTable(jsonStat)

  // 🙁 Worker data deserialization is slower than the actual conversion
  // const payload = { type: 0, body: jsonStatStr }
  // const result = await runWebWorker<TableData>('/workers/json-stat.worker.js', payload)

  // timer.stop()
  return result
}

export { JsonStatSchema } from './_types'
export type { JsonStat, TableCol, TableConst, TableData, TableRow, TableRowValue } from './_types'
export { extractConstantsFromJsonStat } from './_utils'
export { convertJsonStatToTable }
