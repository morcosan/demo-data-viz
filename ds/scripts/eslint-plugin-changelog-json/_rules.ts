import { type Rule } from 'eslint'
import { z } from 'zod'
import { defineJsonValidation } from '../_utils/eslint-utils.ts'

const ChangelogSchema = z.array(
  z
    .object({
      version: z.string(),
      date: z.string().nullable(),
      changes: z
        .object({
          breaking: z.array(z.string()).optional(),
          deprecated: z.array(z.string()).optional(),
          tokens: z.array(z.string()).optional(),
          components: z.array(z.string()).optional(),
          services: z.array(z.string()).optional(),
          utils: z.array(z.string()).optional(),
          assets: z.array(z.string()).optional(),
          docs: z.array(z.string()).optional(),
          internal: z.array(z.string()).optional(),
        })
        .strict(),
    })
    .strict(),
)

const enforceChangelogSchema: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: { description: 'Enforce changelog.json schema' },
    messages: {
      invalidJson: 'Invalid changelog json: {{message}}',
      invalidKeyExtra: 'Invalid changelog schema for "{{key}}": unrecognized key',
      invalidKeyMissing: 'Invalid changelog schema for "{{key}}": {{error}}',
      invalidSchema: 'Invalid changelog schema: {{message}}',
    },
  },
  create: defineJsonValidation(ChangelogSchema, {
    invalidSchema: 'invalidSchema',
    invalidJson: 'invalidJson',
    invalidKeyExtra: 'invalidKeyExtra',
    invalidKeyMissing: 'invalidKeyMissing',
  }),
}

export { enforceChangelogSchema }
