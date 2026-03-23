import { defineMeta, loremArray, loremInt, loremLastName } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { BarChart } from './bar-chart'

const meta: Meta = {
  title: 'Components / BarChart',
  ...defineMeta(BarChart, {
    props: {
      entries: loremArray(50, 50).map(() => ({ label: loremLastName(), v1: loremInt(10, 100), v2: loremInt(10, 100) })),
      labelKey: 'label',
      valueKeys: ['v1', 'v2'],
      className: '',
      style: { height: '500px' },
    },
    clearDefaults: ['entries', 'labelKey', 'valueKeys'],
  }),
}

const Default: StoryObj<typeof BarChart> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
