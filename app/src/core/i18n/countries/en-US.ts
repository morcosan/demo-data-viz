import enJson from 'i18n-iso-countries/langs/en.json'

const EXTRA_NAMES = {
  FK: 'Falkland Islands',
  LA: 'Laos',
  MD: 'Moldova',
  SY: 'Syria',
  SZ: 'eSwatini',
  TL: 'East Timor',
}

// Fix country names
Object.entries(EXTRA_NAMES).forEach(([iso2, name]) => {
  const json = enJson as any
  const names = json.countries[iso2]
  json.countries[iso2] = Array.isArray(names) ? [...names, name] : [names, name]
})

export default enJson
