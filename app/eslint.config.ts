import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import { defineConfig, globalIgnores } from 'eslint/config'
import { baseConfig } from '../.config/base-eslint.config.ts'
import { dsImportsPlugin } from '../ds/dist/scripts/eslint.ts'

export default defineConfig([
  globalIgnores(['.next/**', 'out-*/**', 'next-env.d.ts', '**/workers/*.js']),
  ...nextVitals, // Provides eslint-plugin-import
  ...nextTs,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [dsImportsPlugin.configs.recommended],
    plugins: { [dsImportsPlugin.name]: dsImportsPlugin },
  },
  ...baseConfig,
])
