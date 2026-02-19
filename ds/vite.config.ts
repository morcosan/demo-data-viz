import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import { createBuildNumber, getDsVersion } from './dist/tooling/utilities.ts'

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react({ jsxImportSource: '@emotion/react' }), svgr({ include: '**/*.svgr' })],

  resolve: {
    alias: {
      '@ds': path.resolve(dirname, './dist'),
    },
  },

  define: {
    ENV__BUILD_NUMBER: JSON.stringify(createBuildNumber()),
    ENV__DS_VERSION: JSON.stringify(getDsVersion()),
  },

  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
        test: {
          name: 'storybook',
          setupFiles: ['.storybook/vitest.setup.ts'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
