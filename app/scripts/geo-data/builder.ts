import i18nIso from 'i18n-iso-countries'
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { type GeoCity } from '../../src/shared/utils/geo-data/types.ts'

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

  // Natural Earth uses custom ISO3 codes
  const ISO2_FALLBACK: Record<string, string> = {
    PSX: 'PS',
    SAH: 'EH',
    KOS: 'XK',
  }
  const citiesData = await (await fetch(citiesUrl)).json()
  const cities = (citiesData as any).features.map((feature: any) => {
    const iso3 = feature.properties.ADM0_A3
    const iso2 = i18nIso.alpha3ToAlpha2(iso3) || ISO2_FALLBACK[iso3] || ''
    return {
      name: feature.properties.NAME,
      lng: feature.geometry.coordinates[0],
      lat: feature.geometry.coordinates[1],
      iso2: iso2,
    } satisfies GeoCity
  })

  writeFileSync(worldMapFile, JSON.stringify(worldMap), 'utf-8')
  writeFileSync(citiesFile, JSON.stringify(cities), 'utf-8')
}

build()
