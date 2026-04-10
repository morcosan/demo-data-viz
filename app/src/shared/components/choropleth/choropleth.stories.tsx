import { defineMeta, loremBool, loremFloat } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { Choropleth, type ChoroplethProps } from './choropleth'

const MAX = 100_000_000

const meta: Meta = {
  title: 'Components / Choropleth',
  ...defineMeta(Choropleth, {
    slots: {
      toolbar: '',
    },
    props: {
      data: {
        countries: [
          // Europe
          ...[
            { iso3: 'ALB', name: 'Albania', value: loremFloat(0, MAX) },
            { iso3: 'AND', name: 'Andorra', value: loremFloat(0, MAX) },
            { iso3: 'AUT', name: 'Austria', value: loremFloat(0, MAX) },
            { iso3: 'BLR', name: 'Belarus', value: loremFloat(0, MAX) },
            { iso3: 'BEL', name: 'Belgium', value: loremFloat(0, MAX) },
            { iso3: 'BIH', name: 'Bosnia and Herzegovina', value: loremFloat(0, MAX) },
            { iso3: 'BGR', name: 'Bulgaria', value: loremFloat(0, MAX) },
            { iso3: 'HRV', name: 'Croatia', value: loremFloat(0, MAX) },
            { iso3: 'CYP', name: 'Cyprus', value: loremFloat(0, MAX) },
            { iso3: 'CZE', name: 'Czech Republic', value: loremFloat(0, MAX) },
            { iso3: 'DNK', name: 'Denmark', value: loremFloat(0, MAX) },
            { iso3: 'EST', name: 'Estonia', value: loremFloat(0, MAX) },
            { iso3: 'FIN', name: 'Finland', value: loremFloat(0, MAX) },
            { iso3: 'FRA', name: 'France', value: loremFloat(0, MAX) },
            { iso3: 'DEU', name: 'Germany', value: loremFloat(0, MAX) },
            { iso3: 'GRC', name: 'Greece', value: loremFloat(0, MAX) },
            { iso3: 'HUN', name: 'Hungary', value: loremFloat(0, MAX) },
            { iso3: 'ISL', name: 'Iceland', value: loremFloat(0, MAX) },
            { iso3: 'IRL', name: 'Ireland', value: loremFloat(0, MAX) },
            { iso3: 'ITA', name: 'Italy', value: loremFloat(0, MAX) },
            { iso3: 'LVA', name: 'Latvia', value: loremFloat(0, MAX) },
            { iso3: 'LIE', name: 'Liechtenstein', value: loremFloat(0, MAX) },
            { iso3: 'LTU', name: 'Lithuania', value: loremFloat(0, MAX) },
            { iso3: 'LUX', name: 'Luxembourg', value: loremFloat(0, MAX) },
            { iso3: 'MLT', name: 'Malta', value: loremFloat(0, MAX) },
            { iso3: 'MDA', name: 'Moldova', value: loremFloat(0, MAX) },
            { iso3: 'MCO', name: 'Monaco', value: loremFloat(0, MAX) },
            { iso3: 'MNE', name: 'Montenegro', value: loremFloat(0, MAX) },
            { iso3: 'NLD', name: 'Netherlands', value: loremFloat(0, MAX) },
            { iso3: 'MKD', name: 'North Macedonia', value: loremFloat(0, MAX) },
            { iso3: 'NOR', name: 'Norway', value: loremFloat(0, MAX) },
            { iso3: 'POL', name: 'Poland', value: loremFloat(0, MAX) },
            { iso3: 'PRT', name: 'Portugal', value: loremFloat(0, MAX) },
            { iso3: 'ROU', name: 'Romania', value: loremFloat(0, MAX) },
            { iso3: 'RUS', name: 'Russia', value: loremFloat(0, MAX) },
            { iso3: 'SMR', name: 'San Marino', value: loremFloat(0, MAX) },
            { iso3: 'SRB', name: 'Serbia', value: loremFloat(0, MAX) },
            { iso3: 'SVK', name: 'Slovakia', value: loremFloat(0, MAX) },
            { iso3: 'SVN', name: 'Slovenia', value: loremFloat(0, MAX) },
            { iso3: 'ESP', name: 'Spain', value: loremFloat(0, MAX) },
            { iso3: 'SWE', name: 'Sweden', value: loremFloat(0, MAX) },
            { iso3: 'CHE', name: 'Switzerland', value: loremFloat(0, MAX) },
            { iso3: 'UKR', name: 'Ukraine', value: loremFloat(0, MAX) },
            { iso3: 'GBR', name: 'United Kingdom', value: loremFloat(0, MAX) },
          ].filter(() => loremBool()),
          // Weird names
          ...[
            { iso3: 'USA', name: 'United States', value: loremFloat(0, MAX) },
            { iso3: 'RUS', name: 'Russia', value: loremFloat(0, MAX) },
            { iso3: 'KOR', name: 'South Korea', value: loremFloat(0, MAX) },
            { iso3: 'PRK', name: 'North Korea', value: loremFloat(0, MAX) },
            { iso3: 'VNM', name: 'Vietnam', value: loremFloat(0, MAX) },
            { iso3: 'SYR', name: 'Syria', value: loremFloat(0, MAX) },
            { iso3: 'IRN', name: 'Iran', value: loremFloat(0, MAX) },
            { iso3: 'TZA', name: 'Tanzania', value: loremFloat(0, MAX) },
            { iso3: 'COD', name: 'Dem. Rep. Congo', value: loremFloat(0, MAX) },
            { iso3: 'BOL', name: 'Bolivia', value: loremFloat(0, MAX) },
            { iso3: 'VEN', name: 'Venezuela', value: loremFloat(0, MAX) },
            { iso3: 'ARE', name: 'United Arab Emirates', value: loremFloat(0, MAX) },
          ].filter(() => loremBool()),
        ],
        cities: [
          { name: 'New York', lng: -74.006, lat: 40.713, value: loremFloat(0, MAX) },
          { name: 'London', lng: -0.128, lat: 51.507, value: loremFloat(0, MAX) },
          { name: 'Tokyo', lng: 139.691, lat: 35.689, value: loremFloat(0, MAX) },
        ],
      },
      continent: 'world',
      nameFn: '' as any,
      queries: [],
      loading: false,
      toolbar: '',
      className: '',
      style: { height: '600px' },
    },
    inlineRadios: ['continent'],
    clearDefaults: ['data', 'nameFn'],
    render: (props: ChoroplethProps) => {
      return <Choropleth {...props} nameFn={props.nameFn ? eval(String(props.nameFn)) : undefined} />
    },
  }),
}

const Default: StoryObj<typeof Choropleth> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
