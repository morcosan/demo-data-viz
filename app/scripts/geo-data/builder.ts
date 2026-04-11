import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const worldMapUrl =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson'
const citiesUrl =
  'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/10m/cultural/ne_10m_populated_places.json'

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))
const dirPath = path.join(dirname, '../../src/shared/utils/geo-data')
const worldMapFile = path.join(dirPath, 'world-map.json')
const citiesFile = path.join(dirPath, 'cities.json')

const build = async () => {
  const worldMapData = await (await fetch(worldMapUrl)).json()
  const worldMap = {
    features: (worldMapData as any).features
      .filter((feature: any) => feature.properties.ADMIN !== 'Antarctica')
      .map((feature: any) => ({
        geometry: feature.geometry,
        properties: { name: feature.properties.ADMIN },
      })),
  }

  const citiesData = await (await fetch(citiesUrl)).json()
  const cities = (citiesData as any).features.map((feature: any) => ({
    name: feature.properties.NAME,
    lng: feature.geometry.coordinates[0],
    lat: feature.geometry.coordinates[1],
  }))

  writeFileSync(worldMapFile, JSON.stringify(worldMap), 'utf-8')
  writeFileSync(citiesFile, JSON.stringify(cities), 'utf-8')
}

build()
