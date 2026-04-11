import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(dirname, '../../src/shared/utils/geo-data/world-geo.json')
const dataUrl =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson'

const buildGeoJson = async () => {
  const worldGeoData = await (await fetch(dataUrl)).json()
  const worldGeoJson = {
    features: (worldGeoData as any).features
      .filter((feature: any) => feature.properties.ADMIN !== 'Antarctica')
      .map((feature: any) => ({
        geometry: feature.geometry,
        properties: { name: feature.properties.ADMIN },
      })),
  }
  writeFileSync(distPath, JSON.stringify(worldGeoJson), 'utf-8')
}

buildGeoJson()
