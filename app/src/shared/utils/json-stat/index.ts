import { mapJsonStatData } from './_map-data'
import { type JsonStat, type JsonStatData } from './_types'

const convertJsonStatToTable = async (jsonStatStr: string): Promise<JsonStatData> => {
  // const timer = startTimer('convertJsonStatToTable')
  const jsonStat = JSON.parse(jsonStatStr) as JsonStat
  const result = mapJsonStatData(jsonStat)

  // 🙁 Worker data deserialization is slower than the actual conversion
  // const payload = { type: 0, body: jsonStatStr }
  // const result = await runWebWorker<TableData>('/workers/json-stat.worker.js', payload)

  // timer.stop()
  return result
}

export { mapJsonStatConstants } from './_map-constants'
export { pivotJsonStatTable } from './_pivot-table'
export * from './_types'
export { convertJsonStatToTable }
