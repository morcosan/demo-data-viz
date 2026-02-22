import { API } from '@app-api'
import { ENV__EUROSTAT_BASE_URL } from '@app/env'
import { runWebWorker } from '@app/shared/utils/web-workers'
import { type BaseDataset, type Dataset } from '../_types'
import { DatasetIdSchema, mapJsonStatToDataset, WorkType } from './eurostat-mappers'

export const EurostatApi = {
  async fetchDatasets(): Promise<BaseDataset[]> {
    const url = 'https://ec.europa.eu/eurostat/api/dissemination/catalogue/toc/txt?lang=en'
    const res = await API.get(ENV__EUROSTAT_BASE_URL + url)
    const raw = await res.text()

    // const timer = startTimer('mapCatalogueToDatasetArray')
    const payload = { type: WorkType.MAP_DATASET_ARRAY, body: raw }
    const result = await runWebWorker<BaseDataset[]>('/workers/eurostat-api.worker.js', payload)
    // const result = mapCatalogueToDatasetArray(raw)
    // timer.stop()

    return result
  },

  async fetchDataset(id: string): Promise<Dataset> {
    const safeId = DatasetIdSchema.parse(id)
    const url = `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/${safeId}?format=JSON`
    const res = await API.get(ENV__EUROSTAT_BASE_URL + url)
    const raw = await res.text()

    // const timer = startTimer('mapJsonStatToDataset')
    const payload = {
      type: WorkType.MAP_DATASET,
      body: [raw, id] as Parameters<typeof mapJsonStatToDataset>,
    }
    const result = await runWebWorker<Dataset>('/workers/eurostat-api.worker.js', payload)
    // const result = mapJsonStatToDataset(raw, id)
    // timer.stop()

    return result
  },
}
