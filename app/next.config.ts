import { type NextConfig } from 'next'
import path from 'node:path'
import { createBuildNumber } from '../ds/dist/tooling/utilities.ts'

const BASE_PATH = process.env.NEXT_PUBLIC__BASE_PATH || ''
const BUILD_NUMBER = createBuildNumber()

const nextConfig: NextConfig = {
	output: 'export',
	basePath: BASE_PATH,
	assetPrefix: BASE_PATH,
	env: {
		ENV__BASE_PATH: BASE_PATH,
		ENV__BUILD_NUMBER: BUILD_NUMBER,
		ENV__EUROSTAT_BASE_URL: process.env.NEXT_PUBLIC__EUROSTAT_BASE_URL || '',
	},
	compiler: { emotion: true },

	turbopack: {
		root: path.resolve(__dirname, '..'), // Monorepo root
		resolveAlias: {
			'@app-components': './src/shared/components/index.ts',
			'@app-utils': './src/shared/utils/index.ts',
			'@app-i18n': './src/config/i18n/index.ts',
			'@app-api': './src/config/api/index.ts',
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
