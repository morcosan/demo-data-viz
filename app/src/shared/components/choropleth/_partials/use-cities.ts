import type { ChoroEntry } from '@app-components'
import { type GeoCity, type GeoContinent } from '@app/shared/utils/geo-data/types'
import { useCallback, useState } from 'react'

type AreaCoords = { lng: [number, number]; lat: [number, number] }
type CoordsByContinent = Record<GeoContinent, AreaCoords>

const COORDS_BY_AREA: CoordsByContinent = {
  europe: { lng: [-25, 45], lat: [34, 72] },
  'north-america': { lng: [-170, -50], lat: [7, 83] },
  'south-america': { lng: [-92, -30], lat: [-56, 13] },
  africa: { lng: [-20, 55], lat: [-35, 37] },
  asia: { lng: [25, 180], lat: [-10, 82] },
  oceania: { lng: [110, 180], lat: [-50, 0] },
} as const

export const useCities = () => {
  const [geoCities, setGeoCities] = useState<GeoCity[]>([])

  const getGeoCity = useCallback(
    (entry: ChoroEntry) => {
      const name = entry.name.trim().toLowerCase()
      const area = entry.area
      const iso2 = entry.iso2
      const cities = geoCities.filter((gc) => gc.name.toLowerCase() === name)
      const coords = COORDS_BY_AREA[area || ('' as GeoContinent)]

      if (iso2) {
        const match = cities.find((gc) => gc.iso2 === iso2)
        if (match) return match
      }

      return cities.find((city: GeoCity) => {
        if (!coords) return true
        return (
          city.lng >= coords.lng[0] && //
          city.lng <= coords.lng[1] && //
          city.lat >= coords.lat[0] && //
          city.lat <= coords.lat[1]
        )
      })
    },
    [geoCities],
  )

  const loadCities = async () => {
    if (geoCities.length) return
    setGeoCities((await import('@app/shared/utils/geo-data/cities.json')).default)
  }

  return { geoCities, getGeoCity, loadCities }
}
