import { extractConstantsFromJsonStat, JsonStatSchema } from '@app/shared/utils/json-stat'
import { z } from 'zod'
import { type BaseDataset, type Dataset } from '../_types'

const DatasetIdSchema = z.string().regex(/^[a-zA-Z0-9_]+$/, 'Invalid ID format')

const WorkType = {
  MAP_DATASET_ARRAY: 0,
  MAP_DATASET: 1,
} as const

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

const mapJsonStatToDataset = (rawStr: string, id: string): Dataset => {
  const data = JSON.parse(rawStr)
  const jsonStat = JsonStatSchema.parse(data)
  const constants = extractConstantsFromJsonStat(jsonStat)
  return {
    id,
    constants,
    title: jsonStat.label,
    source: 'eurostat',
    updatedAt: jsonStat.updated,
    stats: {
      colsCount: jsonStat.id.length + 1 - constants.length,
      rowsCount: jsonStat.size.reduce((acc: number, size: number) => acc * size, 1),
    },
    jsonStatStr: rawStr,
  }
}

export { DatasetIdSchema, mapCatalogueToDatasetArray, mapJsonStatToDataset, WorkType }
