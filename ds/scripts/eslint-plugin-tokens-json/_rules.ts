import { type Rule } from 'eslint'
import { defineJsonValidation } from '../_utils/eslint-utils.ts'
import { TokensJsonSchema } from '../design-tokens/schema.ts'

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
  create: defineJsonValidation(TokensJsonSchema, {
    invalidSchema: 'invalidSchema',
    invalidJson: 'invalidJson',
    invalidKeyExtra: 'invalidKeyExtra',
    invalidKeyMissing: 'invalidKeyMissing',
  }),
}

export { enforceTokensSchema }
