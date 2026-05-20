import { ESLint, Linter } from 'eslint'
import { enforceDistImports } from './_rules.ts'

const PLUGIN_NAME = 'ds-imports'

export const dsImportsPlugin = {
  name: PLUGIN_NAME,
  rules: {
    'enforce-dist-imports': enforceDistImports,
  },
  configs: {
    recommended: {
      rules: {
        [`${PLUGIN_NAME}/enforce-dist-imports`]: 'error',
      },
    } satisfies Linter.Config,
  },
} satisfies ESLint.Plugin
