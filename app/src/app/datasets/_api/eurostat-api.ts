import { ENV__EUROSTAT_BASE_URL } from '@app/env.ts'
import { type BaseDataset, type Dataset } from '../_types.ts'
import { BaseDatasetSchema, EurostatDatasetSchema } from './schemas.ts'

export const EurostatApi = {
	async fetchDatasets(): Promise<BaseDataset[]> {
		const url = 'https://ec.europa.eu/eurostat/api/dissemination/catalogue/toc/txt?lang=en'
		const res = await fetch(ENV__EUROSTAT_BASE_URL + url)
		if (!res.ok) throw new Error('Network response was not ok')

		const uniqueCodes = new Set<string>()
		const data = await res.text()
		const lines = data.split('\n').slice(1) // Remove header

		return lines
			.map((line) => line.trim())
			.filter(Boolean)
			.map((line) => {
				const [title, code, type] = line.split('\t').map((col) => col.replace(/^"|"$/g, '').trim())
				return [code || '', title || '', type || '']
			})
			.filter(([code, title, type]) => code && title && (type === 'table' || type === 'dataset'))
			.filter(([code]) => !uniqueCodes.has(code) && uniqueCodes.add(code))
			.map(([code, title]) => BaseDatasetSchema.parse({ code, title, source: 'eurostat' }))
	},

	async fetchDataset(code: string): Promise<Dataset> {
		const url = `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/${code}?format=JSON`
		const res = await fetch(ENV__EUROSTAT_BASE_URL + url)
		if (!res.ok) throw new Error('Network response was not ok')

		const rawData = await res.json()
		const data = EurostatDatasetSchema.parse(rawData)
		return {
			code,
			title: data.label,
			source: 'eurostat',
			updatedAt: data.updated,
			jsonStat: {
				id: data.id,
				size: data.size,
				value: data.value,
				dimension: data.dimension,
			},
			stats: {
				colsCount: data.id.length,
				rowsCount: data.size.reduce((acc: number, size: number) => acc * size, 1),
			},
		}
	},
}
