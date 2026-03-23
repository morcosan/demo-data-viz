import { defineMeta, loremArray, loremInt, loremLastName } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { BarChart, type ChartEntry } from './bar-chart'

const meta: Meta = {
  title: 'Components / BarChart',
  ...defineMeta(BarChart, {
    props: {
      entries: loremArray(50, 50).map((): ChartEntry => ({ name: loremLastName(), value: loremInt(10, 100) })),
      className: 'h-xl-0',
      style: {},
    },
    clearDefaults: ['entries'],
  }),
}

const Default: StoryObj<typeof BarChart> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
