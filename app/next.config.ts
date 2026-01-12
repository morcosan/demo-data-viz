import { type NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
	output: 'export',

	compiler: {
		emotion: true,
	},

	turbopack: {
		root: path.resolve(__dirname, '..'), // Monorepo root
		resolveAlias: {
			'@ds/*': '../ds/dist/*',
		},
		rules: {
			'*.svg': {
				loaders: ['@svgr/webpack'],
				as: '*.js',
			},
		},
	},

	webpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			'@ds': path.resolve(__dirname, '../ds/dist'),
		}
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		})
		return config
	},
}

export default nextConfig
