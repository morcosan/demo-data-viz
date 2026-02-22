import { type JsonStat } from '@app/shared/utils/json-stat'

export interface Dataset extends BaseDataset {
  jsonStat: JsonStat
  updatedAt: string
}

export interface BaseDataset {
  id: string
  title: string
  source: 'eurostat'
  stats?: DatasetStats
}

export interface DatasetStats {
  colsCount: number
  rowsCount: number
}

export type ViewedDatasets = Record<string, DatasetStats>
