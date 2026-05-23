import { z } from 'zod'

const CompositeValue = z.record(z.string(), z.union([z.string(), z.number()]))
const AtomicValue = z.union([z.string(), z.number()])
const ThemedValue = z.object({ $light: z.string(), $dark: z.string() }).strict()
const TokenSchema = z.union([
  z.object({ $value: AtomicValue }).strict(),
  z.object({ $value: ThemedValue }).strict(),
  z.object({ $type: z.literal('composite'), $value: CompositeValue }).strict(),
])
const TokensJsonSchema = z
  .object({
    blur: z.record(z.string(), TokenSchema),
    breakpoint: z.record(z.string(), TokenSchema),
    color: z.record(z.string(), TokenSchema),
    'font-family': z.record(z.string(), TokenSchema),
    'font-size': z.record(z.string(), TokenSchema),
    'font-weight': z.record(z.string(), TokenSchema),
    'line-height': z.record(z.string(), TokenSchema),
    radius: z.record(z.string(), TokenSchema),
    shadow: z.record(z.string(), TokenSchema),
    spacing: z.record(z.string(), TokenSchema),
    'z-index': z.record(z.string(), TokenSchema),
    surface: z.record(z.string(), TokenSchema),
  })
  .strict()

type TokenType = z.infer<typeof TokenSchema>
type TokensJsonType = z.infer<typeof TokensJsonSchema>

export { TokensJsonSchema }
export type { TokensJsonType, TokenType }
