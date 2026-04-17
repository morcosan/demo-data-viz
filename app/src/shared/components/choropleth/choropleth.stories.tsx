import { defineMeta, loremFloat, loremTrue } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { Choropleth } from './choropleth'

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
            { name: 'Albania', value: loremFloat(0, MAX) },
            { name: 'Andorra', value: loremFloat(0, MAX) },
            { name: 'Austria', value: loremFloat(0, MAX) },
            { name: 'Belarus', value: loremFloat(0, MAX) },
            { name: 'Belgium', value: loremFloat(0, MAX) },
            { name: 'Bosnia and Herzegovina', value: loremFloat(0, MAX) },
            { name: 'Bulgaria', value: loremFloat(0, MAX) },
            { name: 'Croatia', value: loremFloat(0, MAX) },
            { name: 'Cyprus', value: loremFloat(0, MAX) },
            { name: 'Czech Republic', value: loremFloat(0, MAX) },
            { name: 'Denmark', value: loremFloat(0, MAX) },
            { name: 'Estonia', value: loremFloat(0, MAX) },
            { name: 'Finland', value: loremFloat(0, MAX) },
            { name: 'France', value: loremFloat(0, MAX) },
            { name: 'Germany', value: loremFloat(0, MAX) },
            { name: 'Greece', value: loremFloat(0, MAX) },
            { name: 'Hungary', value: loremFloat(0, MAX) },
            { name: 'Iceland', value: loremFloat(0, MAX) },
            { name: 'Ireland', value: loremFloat(0, MAX) },
            { name: 'Italy', value: loremFloat(0, MAX) },
            { name: 'Latvia', value: loremFloat(0, MAX) },
            { name: 'Liechtenstein', value: loremFloat(0, MAX) },
            { name: 'Lithuania', value: loremFloat(0, MAX) },
            { name: 'Luxembourg', value: loremFloat(0, MAX) },
            { name: 'Malta', value: loremFloat(0, MAX) },
            { name: 'Moldova', value: loremFloat(0, MAX) },
            { name: 'Monaco', value: loremFloat(0, MAX) },
            { name: 'Montenegro', value: loremFloat(0, MAX) },
            { name: 'Netherlands', value: loremFloat(0, MAX) },
            { name: 'North Macedonia', value: loremFloat(0, MAX) },
            { name: 'Norway', value: loremFloat(0, MAX) },
            { name: 'Poland', value: loremFloat(0, MAX) },
            { name: 'Portugal', value: loremFloat(0, MAX) },
            { name: 'Romania', value: loremFloat(0, MAX) },
            { name: 'San Marino', value: loremFloat(0, MAX) },
            { name: 'Serbia', value: loremFloat(0, MAX) },
            { name: 'Slovakia', value: loremFloat(0, MAX) },
            { name: 'Slovenia', value: loremFloat(0, MAX) },
            { name: 'Spain', value: loremFloat(0, MAX) },
            { name: 'Sweden', value: loremFloat(0, MAX) },
            { name: 'Switzerland', value: loremFloat(0, MAX) },
            { name: 'Ukraine', value: loremFloat(0, MAX) },
            { name: 'United Kingdom', value: loremFloat(0, MAX) },
          ].filter(() => loremTrue()),
          // Weird names
          ...[
            { name: 'East Timor', value: loremFloat(0, MAX) },
            { name: 'Falkland Islands', value: loremFloat(0, MAX) },
            { name: 'Kosovo', value: loremFloat(0, MAX) },
            { name: 'Laos', value: loremFloat(0, MAX) },
            { name: 'Palestine', value: loremFloat(0, MAX) },
            { name: 'Syria', value: loremFloat(0, MAX) },
            { name: 'Taiwan', value: loremFloat(0, MAX) },
            { name: 'eSwatini', value: loremFloat(0, MAX) },
          ],
        ],
        cities: [
          { name: 'Athens', value: loremFloat(0, MAX) },
          { name: 'Athens', value: loremFloat(0, MAX), area: 'europe' },
          { name: 'Berlin', value: loremFloat(0, MAX) },
          { name: 'Brussels', value: loremFloat(0, MAX) },
          { name: 'Bucharest', value: loremFloat(0, MAX) },
          { name: 'Gaza', value: loremFloat(0, MAX) },
          { name: 'Kiev', value: loremFloat(0, MAX) },
          { name: 'London', value: loremFloat(0, MAX), iso2: 'GB' },
          { name: 'New York', value: loremFloat(0, MAX) },
          { name: 'Paris', value: loremFloat(0, MAX) },
          { name: 'Pristina', value: loremFloat(0, MAX) },
          { name: 'Rotterdam', value: loremFloat(0, MAX) },
          { name: 'Taipei', value: loremFloat(0, MAX) },
          { name: 'The Hague', value: loremFloat(0, MAX) },
          { name: 'Tokyo', value: loremFloat(0, MAX) },
        ],
      },
      view: 'world',
      queries: [],
      loading: false,
      chartProps: { className: '', style: {} },
      className: '',
      style: { height: '600px' },
    },
    inlineRadios: ['view'],
    clearDefaults: ['data', 'chartProps'],
  }),
}

const Default: StoryObj<typeof Choropleth> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
