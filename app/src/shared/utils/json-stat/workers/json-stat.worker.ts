import { type WorkerPayload } from '../../web-workers'
import { mapJsonStatData } from '../_map-data'
import { type JsonStat } from '../_types'

globalThis.onmessage = ({ data: payload }: MessageEvent<WorkerPayload>) => {
  const jsonStatStr = payload.body as string
  const jsonStat = JSON.parse(jsonStatStr) as JsonStat
  const result = mapJsonStatData(jsonStat)
  globalThis.postMessage(result)
}
