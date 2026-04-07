import { defineMeta } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { Choropleth, type ChoroplethProps } from './choropleth'

const meta: Meta = {
  title: 'Components / Choropleth',
  ...defineMeta(Choropleth, {
    props: {
      data: {
        entries: [
          {
            key: 'DEU',
            label: 'Germany',
            value: 100,
          },
          {
            key: 'ROU',
            label: 'Romania',
            value: 10,
          },
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
