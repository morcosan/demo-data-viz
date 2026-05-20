import { type Rule } from 'eslint'
import { z } from 'zod'
import { defineJsonValidation } from '../_utils/eslint-utils.ts'

const TokenValue = z.union([
  z.object({ $value: z.union([z.string(), z.number()]) }).strict(),
  z.object({ $value: z.object({ light: z.string(), dark: z.string() }).strict() }).strict(),
])
const TokensSchema = z
  .object({
    blur: z.record(z.string(), TokenValue),
    breakpoint: z.record(z.string(), TokenValue),
    color: z.record(z.string(), TokenValue),
    'font-family': z.record(z.string(), TokenValue),
    'font-size': z.record(z.string(), TokenValue),
    'font-weight': z.record(z.string(), TokenValue),
    'line-height': z.record(z.string(), TokenValue),
    radius: z.record(z.string(), TokenValue),
    shadow: z.record(z.string(), TokenValue),
    spacing: z.record(z.string(), TokenValue),
    'z-index': z.record(z.string(), TokenValue),
  })
  .strict()

const enforceTokensSchema: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: { description: 'Enforce tokens.json schema' },
    messages: {
      invalidJson: 'Invalid tokens json: {{message}}',
      invalidKeyExtra: 'Invalid tokens schema for "{{key}}": unrecognized key',
      invalidKeyMissing: 'Invalid tokens schema for "{{key}}": {{error}}',
      invalidSchema: 'Invalid tokens schema: {{message}}',
    },
  },
  create: defineJsonValidation(TokensSchema, {
    invalidSchema: 'invalidSchema',
    invalidJson: 'invalidJson',
    invalidKeyExtra: 'invalidKeyExtra',
    invalidKeyMissing: 'invalidKeyMissing',
  }),
}

export { enforceTokensSchema }
