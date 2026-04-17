export type GeoCity = {
  name: string
  lng: number
  lat: number
  iso2: string
}

export type GeoContinent = 'europe' | 'north-america' | 'south-america' | 'africa' | 'asia' | 'oceania'

export type WorldMapJson = {
  features: {
    geometry: { type: 'Polygon'; coordinates: number[][][] } | { type: 'MultiPolygon'; coordinates: number[][][][] }
    properties: {
      name: string
    }
  }[]
}
