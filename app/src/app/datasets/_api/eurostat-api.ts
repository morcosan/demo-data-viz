// https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nama_10_gdp?format=JSON

export interface Dataset {
	title: string
	code: string
	type: 'table' | 'dataset' | string
}

export const EurostatApi = {
	async fetchDatasets(): Promise<Dataset[]> {
		const url = 'https://ec.europa.eu/eurostat/api/dissemination/catalogue/toc/txt?lang=en'
		const res = await fetch(ENV__EUROSTAT_BASE_URL + url)
		if (!res.ok) throw new Error('Network response was not ok')

		const uniqueCodes = new Set<string>()
		const data = await res.text()
		const lines = data.split('\n')
		lines.shift()

		return lines
			.map((line) => line.trim())
			.filter(Boolean)
			.map((line) => {
				const cols = line.split('\t')
				const title = cols[0].replace(/^"|"$/g, '').trimStart()
				const code = cols[1]?.replace(/^"|"$/g, '')
				const type = cols[2]?.replace(/^"|"$/g, '')

				return { title, code, type }
			})
			.filter(({ code, type }: Dataset) => code && (type === 'table' || type === 'dataset'))
			.filter(({ code }: Dataset) => {
				if (uniqueCodes.has(code)) return false
				uniqueCodes.add(code)
				return true
			})
		// .slice(0, 100)
	},
}
