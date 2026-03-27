import { TOKENS } from '@ds/core'
import { defineMeta, loremArray, loremBool, loremInt, loremLastName } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { BarChart, type BarChartEntry, type BarChartProps } from './bar-chart'

const meta: Meta = {
  title: 'Components / BarChart',
  ...defineMeta(BarChart, {
    props: {
      data: {
        entries: loremBool()
          ? loremArray(10, 30).map(
              (): BarChartEntry => ({
                label: loremLastName(),
                v1: loremInt(0, 100_000_000),
                v2: loremInt(0, 100_000_000),
                v3: loremInt(0, 100_000_000),
              }),
            )
          : loremArray(2, 10).map(
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
      entryFn: `(value) => '🔥' + value` as any,
      entryWidth: parseFloat(TOKENS.SPACING['md-5'].$value),
      query: '',
      className: '',
      style: { height: '500px' },
    },
    clearDefaults: ['data', 'entryKey', 'entryFn', 'barNames'],
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
