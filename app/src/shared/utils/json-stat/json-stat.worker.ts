import { type WorkerPayload } from '../web-workers'
import { mapJsonStatToTable } from './_mappers'
import { type JsonStat } from './_types'

globalThis.onmessage = ({ data: payload }: MessageEvent<WorkerPayload>) => {
  const jsonStatStr = payload.body as string
  const jsonStat = JSON.parse(jsonStatStr) as JsonStat
  const result = mapJsonStatToTable(jsonStat)
  globalThis.postMessage(result)
}
