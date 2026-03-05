import type { TableData, TableRowValue } from '@app/shared/types/table'
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
  consts: JsonStatConst[]
  valuesByCol: Record<string, string[]>
}
interface JsonStatConst {
  key: string
  label: string
  value: TableRowValue
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

export { JsonStatSchema }
export type { JsonStat, JsonStatConst, JsonStatData }
