import { ESLint, Linter } from 'eslint'
import { enforceChangelogSchema } from './_rules.ts'

const PLUGIN_NAME = 'changelog-json'

export const changelogJsonPlugin = {
  name: PLUGIN_NAME,
  rules: {
    'enforce-changelog-schema': enforceChangelogSchema,
  },
  configs: {
    recommended: {
      rules: {
        [`${PLUGIN_NAME}/enforce-changelog-schema`]: 'error',
      },
    } satisfies Linter.Config,
  },
} satisfies ESLint.Plugin
