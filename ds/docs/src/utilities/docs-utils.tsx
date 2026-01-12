import { camelCase, upperFirst } from 'lodash'
import { type ComponentType } from 'react'
import { type DocsAsset } from '../components/docs-asset-item.tsx'

const renderHtml = (html: string): string => {
	return html
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/^\n/, '')
		.replace(/\n/g, '<br>')
		.replace(/`(.*?)`/g, '<code>$1</code>')
}

const getAssetsFromFiles = (files: Record<string, unknown>): DocsAsset[] => {
	return Object.keys(files)
		.map((path: string) => {
			const name = path.split('/').pop()!.replace('.svg', '')
			const asset: DocsAsset = {
				name,
				elem: files[path] as ComponentType,
				coding: `<${upperFirst(camelCase(name))}Svg className="" />`,
			}
			return asset
		})
		.sort((a, b) => a.name.localeCompare(b.name))
}

export { getAssetsFromFiles, renderHtml }
