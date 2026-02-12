import { type StorybookConfig } from '@storybook/nextjs-vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import remarkGfm from 'remark-gfm'
import { type InlineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import { createBuildNumber, getDsVersion } from '../../ds/dist/tooling/utilities.ts'

const BASE_PATH = process.env.NEXT_PUBLIC__BASE_PATH || ''
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
	stories: ['../src/**/*.@(mdx|stories.@(js|jsx|mjs|ts|tsx))'], // Must be a single regex
	addons: [
		'@storybook/addon-vitest',
		'@storybook/addon-a11y',
		{
			name: '@storybook/addon-docs',
			options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
		},
	],
	framework: {
		name: '@storybook/nextjs-vite',
		options: {
			// 	image: { excludeFiles: ['**/*.svg'] }, // Disable default imports for SVG
		},
	},

	async viteFinal(config: InlineConfig) {
		config.plugins = [...(config.plugins || []), svgr({ include: '**/*.svgr' })]
		config.resolve = {
			...(config.resolve || {}),
			alias: {
				...(config.resolve?.alias || {}),
				'@app-components': path.resolve(dirname, '../src/shared/components/index.ts'),
				'@app-utils': path.resolve(dirname, '../src/shared/utils/index.ts'),
				'@app-i18n': path.resolve(dirname, '../src/config/i18n/index.ts'),
				'@app-api': path.resolve(dirname, '../src/config/api/index.ts'),
				'@app': path.resolve(dirname, '../src/'),
				'@ds': path.resolve(dirname, '../../ds/dist/'),
			},
		}
		config.define = {
			ENV__BUILD_NUMBER: JSON.stringify(createBuildNumber()),
			ENV__DS_VERSION: JSON.stringify(getDsVersion()),
			ENV__BASE_PATH: JSON.stringify(BASE_PATH),
		}
		config.build = {
			...(config.build || {}),
			rollupOptions: {
				...(config.build?.rollupOptions || {}),
				onwarn(warning, warn) {
					if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
					if (warning.message?.includes('Error when using sourcemap')) return
					warn(warning)
				},
			},
		}

		return config
	},
}

export default config
