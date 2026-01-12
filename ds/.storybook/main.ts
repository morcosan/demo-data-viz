import { type StorybookConfig } from '@storybook/react-vite'
import remarkGfm from 'remark-gfm'

const config: StorybookConfig = {
	stories: ['../docs/**/*.@(mdx|stories.@(js|jsx|mjs|ts|tsx))'], // Must be a single regex
	addons: [
		'@storybook/addon-vitest',
		'@storybook/addon-a11y',
		{
			name: '@storybook/addon-docs',
			options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
		},
	],
	framework: '@storybook/react-vite',
	staticDirs: ['public'],
}
export default config
