import type { TableCell, TableData } from '@app/shared/types/table'
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
  value: (number | null)[] | Record<string, number>
}
interface JsonStatData extends TableData {
  source: 'eurostat'
  consts: JsonStatConst[]
  cellsByCol: Record<string, JsonStatCell[]>
}
interface JsonStatConst {
  key: string
  label: string
  value: TableCell
}
interface JsonStatCell {
  code: string
  value: TableCell
}

const JsonStatSchema = z.object({
  label: z.string(),
  updated: z.string(),
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
    }),
  ),
  value: z.union([
    z.array(z.number().nullable()),
    z.record(z.string(), z.number()),
    //
  ]),
}) satisfies z.ZodType<JsonStat>

const EurostatConfig = {
  DEFAULT_INDEX_KEYS: ['geo', 'cities'],
  DEFAULT_PIVOT_KEYS: ['time'],
  DEFAULT_FILTERS: {
    partner: 'WRL_REST',
  },
  CITY_KEY: 'cities',
  GEO_KEY: 'geo',
  TIME_KEY: 'time',
} as const
const JSON_STAT_VALUE_KEY = 'value'

export { EurostatConfig, JSON_STAT_VALUE_KEY, JsonStatSchema }
export type { JsonStat, JsonStatCell, JsonStatConst, JsonStatData }
