import { type GeoCity, type GeoContinent } from '@app/shared/utils/geo-data/types'
import { useCallback, useState } from 'react'
import { type ChoroEntry } from '../_types'
import { COORDS_BY_AREA } from './constants'

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
