import { type NextConfig } from 'next'
import path from 'node:path'
import { createBuildNumber } from '../ds/dist/scripts/utilities.ts'

const env = process.env
const IS_LOCAL = env.USE_LOCAL === 'true'
const BASE_PATH = (IS_LOCAL ? env.LOCAL__BASE_PATH : env.PUBLIC__BASE_PATH) || ''
const EUROSTAT_BASE_URL = (IS_LOCAL ? env.LOCAL__EUROSTAT_BASE_URL : env.PUBLIC__EUROSTAT_BASE_URL) || ''
const OUT_DIR = env.NODE_ENV === 'development' ? undefined : env.LOCAL__APP_OUT_DIR
const BUILD_NUMBER = createBuildNumber()

const nextConfig: NextConfig = {
  output: 'export',
  distDir: OUT_DIR,
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH,
  env: {
    ENV__BASE_PATH: BASE_PATH,
    ENV__BUILD_NUMBER: BUILD_NUMBER,
    ENV__EUROSTAT_BASE_URL: EUROSTAT_BASE_URL,
  },
  compiler: { emotion: true },
  reactStrictMode: false, // StrictMode is added manually
  devIndicators: { position: 'bottom-right' },

  turbopack: {
    root: path.resolve(__dirname, '..'), // Monorepo root
    resolveAlias: {
      // ESLint doesn't detect "@app-utils/*.ts" imports
      '@app-components': './src/shared/components/index.ts',
      '@app-i18n': './src/core/i18n/index.ts',
      '@app-api': './src/core/api/index.ts',
      '@app/*': './src/*',
      '@ds/*': '../ds/dist/*',
    },
    rules: {
      '*.svgr': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: [
                  { name: 'preset-default', params: { overrides: { removeViewBox: false, cleanupIds: false } } },
                ],
              },
            },
          },
        ],
        as: '*.js',
      },
    },
  },

  // webpack: (config) => {
  // 	config.resolve.alias = {
  // 		...config.resolve.alias,
  // 		'@ds': path.resolve(__dirname, '../ds/dist'),
  // 	}
  // 	config.module.rules.push({
  // 		test: /\.svg$/,
  // 		use: ['@svgr/webpack'],
  // 	})
  // 	config.plugins?.push(
  // 		new webpack.DefinePlugin({
  // 			ENV__BASE_PATH: JSON.stringify(BASE_PATH),
  // 			ENV__BUILD_NUMBER: BUILD_NUMBER,
  // 		})
  // 	)
  // 	return config
  // },
}

export default nextConfig
