import jsESLint from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tsESLint from 'typescript-eslint'
import { baseConfig } from '../.config/base-eslint.config.ts'
import { dsImports } from './dist/tooling/eslint.ts'

export default defineConfig([
  globalIgnores(['out/**']),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    extends: [
      jsESLint.configs.recommended,
      tsESLint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      dsImports.configs.recommended,
    ],
    plugins: {
      import: importPlugin,
      'ds-imports': dsImports,
    },
    settings: {
      'import/resolver': { typescript: true },
    },
  },
  ...baseConfig,
  {
    files: ['**/tooling/**/*.ts'],
    rules: {
      'import/extensions': ['error', 'ignorePackages'],
    },
  },
])
