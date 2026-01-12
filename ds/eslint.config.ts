import jsESLint from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tsESLint from 'typescript-eslint'
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
		rules: {
			'react-hooks/exhaustive-deps': 'off', // This rule is broken, it gives false positives all the time
			'react-hooks/set-state-in-effect': 'off', // TODO: fix this issue

			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-expressions': 'off',
			'@typescript-eslint/no-unused-vars': ['warn', { caughtErrors: 'none' }],

			'import/extensions': ['error', 'ignorePackages'],
		},
	},
])
