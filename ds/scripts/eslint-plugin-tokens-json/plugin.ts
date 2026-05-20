import { ESLint, Linter } from 'eslint'
import { enforceTokensSchema } from './_rules.ts'

const PLUGIN_NAME = 'tokens-json'

export const tokensJsonPlugin = {
  name: PLUGIN_NAME,
  rules: {
    'enforce-tokens-schema': enforceTokensSchema,
  },
  configs: {
    recommended: {
      rules: {
        [`${PLUGIN_NAME}/enforce-tokens-schema`]: 'error',
      },
    } satisfies Linter.Config,
  },
} satisfies ESLint.Plugin
