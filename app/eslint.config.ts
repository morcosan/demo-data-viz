import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import { defineConfig, globalIgnores } from 'eslint/config'
import { baseConfig } from '../.config/base-eslint.config.ts'
import { dsImports } from '../ds/dist/tooling/eslint.ts'

export default defineConfig([
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
  ...nextVitals, // Provides eslint-plugin-import
  ...nextTs,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      dsImports.configs.recommended,
      //
    ],
    plugins: {
      'ds-imports': dsImports,
    },
  },
  ...baseConfig,
])
