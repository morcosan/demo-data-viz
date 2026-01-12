import { type StorybookConfig } from '@storybook/nextjs-vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import remarkGfm from 'remark-gfm'
import { type InlineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import { createBuildNumber, getDsVersion } from '../../ds/dist/tooling/utilities.ts'

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
			image: { excludeFiles: ['**/*.svg'] }, // Disable default imports for SVG
		},
	},

	async viteFinal(config: InlineConfig) {
		config.plugins = [...(config.plugins || []), svgr({ include: '**/*.svg' })]
		config.resolve = {
			...(config.resolve || {}),
			alias: {
				...(config.resolve?.alias || {}),
				'@ds': path.resolve(dirname, '../../ds/dist/'),
			},
		}
		config.define = {
			ENV__BUILD_NUMBER: JSON.stringify(createBuildNumber()),
			ENV__DS_VERSION: JSON.stringify(getDsVersion()),
		}

		return config
	},
}

export default config
