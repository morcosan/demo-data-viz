import { ESLint, Linter } from 'eslint'
import { enforceDistImports } from './_rules.ts'

export const dsImports = {
  rules: {
    'enforce-dist-imports': enforceDistImports,
  },
  configs: {
    recommended: {
      rules: {
        'ds-imports/enforce-dist-imports': 'error',
      },
    } satisfies Linter.Config,
  },
} satisfies ESLint.Plugin
