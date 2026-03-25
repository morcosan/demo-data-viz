import { defineMeta, loremArray, loremInt, loremLastName } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { BarChart, type BarChartEntry, type BarChartProps } from './bar-chart'

const meta: Meta = {
  title: 'Components / BarChart',
  ...defineMeta(BarChart, {
    props: {
      data: {
        entries: loremArray(50, 50).map(
          (): BarChartEntry => ({
            label: loremLastName(),
            v1: loremInt(10, 100),
            v2: loremInt(10, 100),
            v3: loremInt(10, 100),
          }),
        ),
      },
      labelKey: 'label',
      barLabels: {
        v1: 'Value 1',
        v2: 'Value 2',
        v3: 'Value 3',
      },
      labelFn: `(value) => '🔥' + value` as any,
      className: '',
      style: { height: '500px' },
    },
    clearDefaults: ['data', 'labelKey', 'labelFn', 'barLabels'],
    render: (props: BarChartProps) => {
      return <BarChart {...props} labelFn={props.labelFn ? eval(String(props.labelFn)) : undefined} />
    },
  }),
}

const Default: StoryObj<typeof BarChart> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
