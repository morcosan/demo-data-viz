import { camelCase, upperFirst } from 'lodash'
import { type ComponentType, useEffect, useMemo, useState } from 'react'
import { type DocsAsset } from '../components/docs-asset-item'

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
      const filename = path.split('/').pop()
      const name = filename?.replace(/\.svgr?$/, '') || ''
      const asset: DocsAsset = {
        name,
        elem: files[path] as ComponentType,
        coding: `<${upperFirst(camelCase(name))}Svg className="" />`,
      }
      return asset
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

const useLocationMock = () => {
  const [pathname, setPathname] = useState('/')

  const location = useMemo(() => ({ ...window.location, pathname }), [pathname])

  const handleNavigate = (event: CustomEvent) => setPathname(event.detail[0])

  useEffect(() => {
    window.addEventListener('sb:navigate' as any, handleNavigate)
    return () => window.removeEventListener('sb:navigate' as any, handleNavigate)
  }, [])

  return {
    location,
  }
}

export { getAssetsFromFiles, renderHtml, useLocationMock }
