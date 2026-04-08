import { defineMeta, loremBool, loremInt } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { Choropleth, type ChoroplethProps } from './choropleth'

const meta: Meta = {
  title: 'Components / Choropleth',
  ...defineMeta(Choropleth, {
    props: {
      data: {
        countries: [
          // Europe
          ...[
            { iso3: 'ALB', name: 'Albania', value: loremInt(0, 100) },
            { iso3: 'AND', name: 'Andorra', value: loremInt(0, 100) },
            { iso3: 'AUT', name: 'Austria', value: loremInt(0, 100) },
            { iso3: 'BLR', name: 'Belarus', value: loremInt(0, 100) },
            { iso3: 'BEL', name: 'Belgium', value: loremInt(0, 100) },
            { iso3: 'BIH', name: 'Bosnia and Herzegovina', value: loremInt(0, 100) },
            { iso3: 'BGR', name: 'Bulgaria', value: loremInt(0, 100) },
            { iso3: 'HRV', name: 'Croatia', value: loremInt(0, 100) },
            { iso3: 'CYP', name: 'Cyprus', value: loremInt(0, 100) },
            { iso3: 'CZE', name: 'Czech Republic', value: loremInt(0, 100) },
            { iso3: 'DNK', name: 'Denmark', value: loremInt(0, 100) },
            { iso3: 'EST', name: 'Estonia', value: loremInt(0, 100) },
            { iso3: 'FIN', name: 'Finland', value: loremInt(0, 100) },
            { iso3: 'FRA', name: 'France', value: loremInt(0, 100) },
            { iso3: 'DEU', name: 'Germany', value: loremInt(0, 100) },
            { iso3: 'GRC', name: 'Greece', value: loremInt(0, 100) },
            { iso3: 'HUN', name: 'Hungary', value: loremInt(0, 100) },
            { iso3: 'ISL', name: 'Iceland', value: loremInt(0, 100) },
            { iso3: 'IRL', name: 'Ireland', value: loremInt(0, 100) },
            { iso3: 'ITA', name: 'Italy', value: loremInt(0, 100) },
            { iso3: 'LVA', name: 'Latvia', value: loremInt(0, 100) },
            { iso3: 'LIE', name: 'Liechtenstein', value: loremInt(0, 100) },
            { iso3: 'LTU', name: 'Lithuania', value: loremInt(0, 100) },
            { iso3: 'LUX', name: 'Luxembourg', value: loremInt(0, 100) },
            { iso3: 'MLT', name: 'Malta', value: loremInt(0, 100) },
            { iso3: 'MDA', name: 'Moldova', value: loremInt(0, 100) },
            { iso3: 'MCO', name: 'Monaco', value: loremInt(0, 100) },
            { iso3: 'MNE', name: 'Montenegro', value: loremInt(0, 100) },
            { iso3: 'NLD', name: 'Netherlands', value: loremInt(0, 100) },
            { iso3: 'MKD', name: 'North Macedonia', value: loremInt(0, 100) },
            { iso3: 'NOR', name: 'Norway', value: loremInt(0, 100) },
            { iso3: 'POL', name: 'Poland', value: loremInt(0, 100) },
            { iso3: 'PRT', name: 'Portugal', value: loremInt(0, 100) },
            { iso3: 'ROU', name: 'Romania', value: loremInt(0, 100) },
            { iso3: 'RUS', name: 'Russia', value: loremInt(0, 100) },
            { iso3: 'SMR', name: 'San Marino', value: loremInt(0, 100) },
            { iso3: 'SRB', name: 'Serbia', value: loremInt(0, 100) },
            { iso3: 'SVK', name: 'Slovakia', value: loremInt(0, 100) },
            { iso3: 'SVN', name: 'Slovenia', value: loremInt(0, 100) },
            { iso3: 'ESP', name: 'Spain', value: loremInt(0, 100) },
            { iso3: 'SWE', name: 'Sweden', value: loremInt(0, 100) },
            { iso3: 'CHE', name: 'Switzerland', value: loremInt(0, 100) },
            { iso3: 'UKR', name: 'Ukraine', value: loremInt(0, 100) },
            { iso3: 'GBR', name: 'United Kingdom', value: loremInt(0, 100) },
          ].filter(() => loremBool()),
          // Weird names
          ...[
            { iso3: 'USA', name: 'United States', value: loremInt(0, 100) },
            { iso3: 'RUS', name: 'Russia', value: loremInt(0, 100) },
            { iso3: 'KOR', name: 'South Korea', value: loremInt(0, 100) },
            { iso3: 'PRK', name: 'North Korea', value: loremInt(0, 100) },
            { iso3: 'VNM', name: 'Vietnam', value: loremInt(0, 100) },
            { iso3: 'SYR', name: 'Syria', value: loremInt(0, 100) },
            { iso3: 'IRN', name: 'Iran', value: loremInt(0, 100) },
            { iso3: 'TZA', name: 'Tanzania', value: loremInt(0, 100) },
            { iso3: 'COD', name: 'Dem. Rep. Congo', value: loremInt(0, 100) },
            { iso3: 'BOL', name: 'Bolivia', value: loremInt(0, 100) },
            { iso3: 'VEN', name: 'Venezuela', value: loremInt(0, 100) },
            { iso3: 'ARE', name: 'United Arab Emirates', value: loremInt(0, 100) },
          ].filter(() => loremBool()),
        ],
        cities: [
          { name: 'New York', lng: -74.006, lat: 40.713, value: loremInt(0, 100) },
          { name: 'London', lng: -0.128, lat: 51.507, value: loremInt(0, 100) },
          { name: 'Tokyo', lng: 139.691, lat: 35.689, value: loremInt(0, 100) },
        ],
      },
      labelFn: '' as any,
      queries: [],
      loading: false,
      toolbar: '',
      className: '',
      style: { height: '500px' },
    },
    clearDefaults: ['data', 'labelFn'],
    render: (props: ChoroplethProps) => {
      return <Choropleth {...props} labelFn={props.labelFn ? eval(String(props.labelFn)) : undefined} />
    },
  }),
}

const Default: StoryObj<typeof Choropleth> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
