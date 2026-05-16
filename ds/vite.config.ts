import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import path from 'node:path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import { createBuildNumber, getDsVersion } from './dist/scripts/utilities.ts'

export default defineConfig({
  plugins: [react({ jsxImportSource: '@emotion/react' }), svgr({ include: '**/*.svgr' })],

  resolve: {
    // Must use "postcss-url": { url: "rebase" } to resolve URLs relative to CSS files
    alias: {
      '@ds': path.resolve(__dirname, './dist'),
    },
  },

  define: {
    ENV__BUILD_NUMBER: JSON.stringify(createBuildNumber()),
    ENV__DS_VERSION: JSON.stringify(getDsVersion()),
  },

  // Vitest config
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(__dirname, '.storybook') })],
        test: {
          name: 'storybook',
          setupFiles: ['./.storybook/preview/vitest.setup.ts'],
          browser: {
            enabled: true,
            provider: playwright({}),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
