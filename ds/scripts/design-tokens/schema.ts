import { z } from 'zod'

const BaseValueSchema = z.union([z.string(), z.number()])
const ThemedValueSchema = z.object({ $light: BaseValueSchema, $dark: BaseValueSchema }).strict()
const AtomicValueSchema = z.union([BaseValueSchema, ThemedValueSchema])
const CompositeValueSchema = z.record(z.string(), z.union([BaseValueSchema, ThemedValueSchema]))
const TokenSchema = z.union([
  z.object({ $value: BaseValueSchema }).strict(),
  z.object({ $value: ThemedValueSchema }).strict(),
  z.object({ $type: z.literal('composite'), $value: CompositeValueSchema }).strict(),
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

type Token = z.infer<typeof TokenSchema>
type TokensJson = z.infer<typeof TokensJsonSchema>
type BaseValue = z.infer<typeof BaseValueSchema>
type ThemedValue = z.infer<typeof ThemedValueSchema>
type AtomicValue = z.infer<typeof AtomicValueSchema>
type CompositeValue = z.infer<typeof CompositeValueSchema>

export { TokensJsonSchema }
export type { AtomicValue, BaseValue, CompositeValue, ThemedValue, Token, TokensJson }
