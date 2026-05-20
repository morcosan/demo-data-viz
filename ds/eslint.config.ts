import jsPlugin from '@eslint/js'
import jsonPlugin from '@eslint/json'
import { ESLint } from 'eslint'
import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tsPlugin from 'typescript-eslint'
import { baseConfig } from '../.config/base-eslint.config.ts'
import { changelogJsonPlugin } from './scripts/eslint-plugin-changelog-json/plugin.ts'
import { dsImportsPlugin } from './scripts/eslint-plugin-ds-imports/plugin.ts'
import { tokensJsonPlugin } from './scripts/eslint-plugin-tokens-json/plugin.ts'

export default defineConfig([
  globalIgnores(['out-docs/**']),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    extends: [
      jsPlugin.configs.recommended,
      tsPlugin.configs.recommended,
      reactHooksPlugin.configs.flat.recommended,
      reactRefreshPlugin.configs.vite,
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat['jsx-runtime'],
    ],
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': { typescript: true },
      react: { version: 'detect' },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [dsImportsPlugin.configs.recommended],
    plugins: { [dsImportsPlugin.name]: dsImportsPlugin },
  },
  {
    files: ['**/tokens.json'],
    extends: [tokensJsonPlugin.configs.recommended],
    plugins: { json: jsonPlugin as unknown as ESLint.Plugin, [tokensJsonPlugin.name]: tokensJsonPlugin },
    language: 'json/json',
  },
  {
    files: ['**/changelog.json'],
    extends: [changelogJsonPlugin.configs.recommended],
    plugins: { json: jsonPlugin as unknown as ESLint.Plugin, [changelogJsonPlugin.name]: changelogJsonPlugin },
    language: 'json/json',
  },
  ...baseConfig,
])
