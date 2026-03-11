import type { JsonStatConst } from '@app/shared/utils/json-stat'

export interface Dataset extends BaseDataset {
  jsonStatStr: string
  updatedAt: string
  constants: JsonStatConst[]
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

export type MobileView = 'listing' | 'preview'
