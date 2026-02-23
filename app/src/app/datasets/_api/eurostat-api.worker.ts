import { type WorkerPayload } from '@app/shared/utils/web-workers'
import { mapCatalogueToDatasetArray, mapJsonStatToDataset, WorkType } from './eurostat-mappers'

globalThis.onmessage = ({ data: payload }: MessageEvent<WorkerPayload>) => {
  if (payload.type === WorkType.MAP_DATASET_ARRAY) {
    const result = mapCatalogueToDatasetArray(payload.body as string)
    globalThis.postMessage(result)
  }

  if (payload.type === WorkType.MAP_DATASET) {
    const params = payload.body as Parameters<typeof mapJsonStatToDataset>
    const result = mapJsonStatToDataset(...params)
    globalThis.postMessage(result)
  }
}
