import { z } from 'zod'

interface JsonStat {
	id: string[]
	size: number[]
	dimension: Record<
		string,
		{
			label?: string
			category: {
				index: Record<string, number>
				label: Record<string, string>
			}
		}
	>
	value: number[] | Record<string, number>
}

type TableRowValue = string | number
type TableRow = Record<string, TableRowValue>
type TableCol = {
	key: string
	label: string
	size?: number
}
type TableData = {
	cols: TableCol[]
	rows: TableRow[]
}

const JsonStatSchema = z.object({
	id: z.array(z.string()),
	size: z.array(z.number()),
	dimension: z.record(
		z.string(),
		z.object({
			label: z.string().optional(),
			category: z.object({
				index: z.record(z.string(), z.number()),
				label: z.record(z.string(), z.string()),
			}),
		})
	),
	value: z.union([
		z.array(z.number()),
		z.record(z.string(), z.number()),
		//
	]),
}) satisfies z.ZodType<JsonStat>

const convertJsonStatToTable = (jsonStat: JsonStat): TableData => {
	const { id, size, dimension, value } = jsonStat
	const rows: TableRow[] = []

	// Convert value to array if it's an object
	const values = Array.isArray(value) ? value : Object.keys(value).map((key) => value[key])

	const totalRows = values.length

	// Build headers from dimension labels plus value column
	const headers: TableCol[] = [
		...id.map((dimId) => ({
			key: dimId,
			label: dimension[dimId]?.label || dimId,
		})),
		{ key: 'value', label: 'Value' },
	]

	for (let i = 0; i < totalRows; i++) {
		const row: TableRow = {}
		let index = i

		// Decode each dimension (iterate right to left for row-major order)
		for (let j = id.length - 1; j >= 0; j--) {
			const dimId = id[j]
			const dimSize = size[j]
			const dimIndex = index % dimSize
			index = Math.floor(index / dimSize)

			// Get category information
			const categories = dimension[dimId].category

			// Find the category code at this index
			const categoryCode = Object.entries(categories.index).find(([, idx]) => idx === dimIndex)?.[0] || ''

			// Use the label as the value
			row[dimId] = categories.label[categoryCode] || categoryCode
		}

		// Add the value
		row.value = values[i] || 0

		rows.push(row)
	}

	return { cols: headers, rows }
}

export { convertJsonStatToTable, JsonStatSchema }
export type { JsonStat, TableCol, TableData, TableRow, TableRowValue }
