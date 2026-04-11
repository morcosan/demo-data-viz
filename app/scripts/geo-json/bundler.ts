import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import baseWorldGeoJson from './ne_50m.json' with { type: 'json' }

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))
const distPath = {
  nextjs: path.join(dirname, '../../public/world-geo.json'),
  storybook: path.join(dirname, '../../.storybook/public/world-geo.json'),
}

const buildGeoJson = () => {
  const worldGeoJson = {
    features: baseWorldGeoJson.features.map((feature: any) => ({
      geometry: feature.geometry,
      properties: { name: feature.properties.ADMIN },
    })),
  }
  writeFileSync(distPath.nextjs, JSON.stringify(worldGeoJson), 'utf-8')
  writeFileSync(distPath.storybook, JSON.stringify(worldGeoJson), 'utf-8')
}

export { buildGeoJson }
