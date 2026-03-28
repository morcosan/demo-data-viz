import { TOKENS } from '@ds/core'
import { defineMeta, loremArray, loremInt, loremLastName, loremTrue } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { BarChart, type BarChartEntry, type BarChartProps } from './bar-chart'

const meta: Meta = {
  title: 'Components / BarChart',
  ...defineMeta(BarChart, {
    props: {
      data: {
        entries: loremTrue()
          ? loremArray(15, 30).map(
              (): BarChartEntry => ({
                label: loremLastName(),
                v1: loremInt(0, 100_000_000),
                v2: loremInt(0, 100_000_000),
                v3: loremInt(0, 100_000_000),
              }),
            )
          : loremArray(5, 15).map(
              (): BarChartEntry => ({
                label: loremLastName(),
                v1: loremInt(-100, 100),
                v2: loremInt(-100, 100),
                v3: loremInt(-100, 100),
              }),
            ),
      },
      barNames: {
        v1: 'Value 1',
        v2: 'Value 2',
        v3: 'Value 3',
      },
      entryKey: 'label',
      entryName: 'Entity',
      entryFn: '' as any,
      entryWidth: parseFloat(TOKENS.SPACING['md-5'].$value),
      chartSize: 'md',
      query: '',
      toolbar: '',
      className: '',
      style: { height: '500px' },
    },
    inlineRadios: ['chartSize'],
    clearDefaults: ['data', 'entryKey', 'entryName', 'entryFn', 'barNames'],
    render: (props: BarChartProps) => {
      return <BarChart {...props} entryFn={props.entryFn ? eval(String(props.entryFn)) : undefined} />
    },
  }),
}

const Default: StoryObj<typeof BarChart> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
