import { API } from '@app-api'
import { ENV__EUROSTAT_BASE_URL } from '@app/env.ts'
import { type BaseDataset, type Dataset } from '../_types.ts'
import { DatasetIdSchema, mapCatalogueToDatasetArray, mapStatisticsToDataset } from './eurostat-mappers.ts'

export const EurostatApi = {
	async fetchDatasets(): Promise<BaseDataset[]> {
		const url = 'https://ec.europa.eu/eurostat/api/dissemination/catalogue/toc/txt?lang=en'
		const res = await API.get(ENV__EUROSTAT_BASE_URL + url)
		const data = await res.text()
		return mapCatalogueToDatasetArray(data)
	},

	async fetchDataset(id: string): Promise<Dataset> {
		const safeId = DatasetIdSchema.parse(id)
		const url = `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/${safeId}?format=JSON`
		const res = await API.get(ENV__EUROSTAT_BASE_URL + url)
		const data = await res.json()
		return mapStatisticsToDataset(data, id)
	},
}
