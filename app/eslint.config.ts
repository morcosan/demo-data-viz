import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import { defineConfig, globalIgnores } from 'eslint/config'
import { dsImports } from '../ds/dist/tooling/eslint.ts'

export default defineConfig([
	globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
	...nextVitals,
	...nextTs,
	{
		files: ['**/*.{ts,tsx}'],
		extends: [
			dsImports.configs.recommended,
			//
		],
		plugins: {
			// import: importPlugin, // Provided by nextVitals
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
