import { type BaseDataset, type Dataset } from '@app/app/datasets/_types'
import { JsonStatSchema } from '@app/shared/utils/json-stat'
import { z } from 'zod'

const StatisticsSchema = z.object({
  label: z.string(),
  updated: z.string(),
  id: JsonStatSchema.shape.id,
  size: JsonStatSchema.shape.size,
  value: JsonStatSchema.shape.value,
  dimension: JsonStatSchema.shape.dimension,
})
const DatasetIdSchema = z.string().regex(/^[a-zA-Z0-9_]+$/, 'Invalid ID format')

const mapCatalogueToDatasetArray = (data: string): BaseDataset[] => {
  const uniqueIds = new Set<string>()
  const lines = data.split('\n').slice(1) // Remove header

  return lines
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, id, type] = line.split('\t').map((item) => item.replace(/^"|"$/g, '').trim())
      const parsedId = DatasetIdSchema.safeParse(id)
      return [parsedId.success ? parsedId.data : '', title || '', type || '']
    })
    .filter(([id, title, type]) => id && title && (type === 'table' || type === 'dataset'))
    .filter(([id]) => !uniqueIds.has(id) && uniqueIds.add(id))
    .map(([id, title]) => ({ id, title, source: 'eurostat' }))
}

const mapStatisticsToDataset = (rawData: unknown, id: string): Dataset => {
  const data = StatisticsSchema.parse(rawData)
  return {
    id,
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
}

export { DatasetIdSchema, mapCatalogueToDatasetArray, mapStatisticsToDataset }
