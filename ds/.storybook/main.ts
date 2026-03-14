import { type StorybookConfig } from '@storybook/react-vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import remarkGfm from 'remark-gfm'

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ['../docs/**/*.@(mdx|stories.@(js|jsx|mjs|ts|tsx))'], // Must be a single regex
  previewAnnotations: (entry = []) => [...entry, path.resolve(dirname, './preview/preview.tsx')],
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
